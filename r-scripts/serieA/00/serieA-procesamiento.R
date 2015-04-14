### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## lista proy_listA con directorio actualizado Proyectos de Ley
##        ---> fichero "dir-serieA.rd"
## lista bol_listA con referencias a documentos para todos los Proyectos de Ley en proy_listA
##        ---> ficheros del tipo "dir-A-X.rd"
# Salida: ninguna; se alimenta bbdd mongo
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

source("../common.R")
source("../mongodb-conn.R")
source("funciones-procesamiento.R")

#listas comunes a todas las series
source("../common-lists.R")

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Procesamiento Boletines Serie A: Proyectos de Ley      #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

load(paste0(GENERATED_BASE_DIR, "dir-serieA.rd")) # se carga proy_listA
length(proy_listA)
i=1
names(proy_listA[[i]])

for(i in 1:length(proy_listA)){#i=1
        filename <- paste0(GENERATED_BASE_DIR, "dir-", proy_listA[[i]]$codigo, ".rd")
        if(!file.exists(filename)){ next() }
        load(filename) # se carga bol_listA
        #         length(bol_listA) # hay 15 documentos asociados
        # names(bol_listA[[i]]) #campos para cada tramite del Proyecto
        # bol_listA[[i]]$tramite #trámite en cuestión
        
        #NOTA. Código provisional. Enviar solo el primero
        load(paste0(bol_listA[[1]]$filename))
        q <- mongo.bson.from.JSON(paste0('{ "bol":"', bol_listA[[d]]$codigo, '" }'))
        a <- mongo.find(mongo, mongo_collection("serieA"), q)
        if(!mongo.cursor.next(a)){
                print("No presente en mongo, añadiendo.\n")
                #Procesamiento del boletín A-1-X: Proyecto de Ley
                if(bol_listA[[1]]$tramite %in% c("Iniciativa", "Proyecto de Ley")){
                        #procesamos el primero y lo guardamos.
                        lcont1 <- try(proc_serieA(lines, codigo = bol_listA[[1]]$codigo, tramite = bol_listA[[1]]$tramite))
                        #enviar a mongo.
                        if(class(lcont1) == "try-error"){
                                lcont1 <- vector("list")
                                lcont1$bol <- bol_listA[[d]]$codigo
                                lcont1$url <- bol_listA[[d]]$url
                                print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                        }
                        #boletin correctamente procesado, enviar a mongo
                        if(class(lcont1) != "try-error" & length(lcont1)>0){
                                #Añadir url a cada elemento de la lista (uno por enmienda)
                                lcont1$url <- bol_listA[[1]]$url
                                #Enviar
                                mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[1]]$codigo))
                                lcontb <- lapply(list(lcont1), function(x) {return(mongo.bson.from.list(x))})
                                mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                        }
                }
                
                #         for(d in 1:length(bol_listA)){#d=1
                #                 load(paste0(bol_listA[[d]]$filename)) # carga lines, que contiene el texto a procesar
                #                 
                #                 q <- mongo.bson.from.JSON(paste0('{ "bol":"', bol_listA[[d]]$codigo, '" }'))
                #                 a <- mongo.find(mongo, mongo_collection("serieA"), q)
                #                 if(!mongo.cursor.next(a))
                #                 {
                #                         print("No presente en mongo, añadiendo.\n")
                #                         #Procesamiento del boletín A-1-X: Proyecto de Ley
                #                         if(bol_listA[[d]]$tramite %in% c("Iniciativa", "Proyecto de Ley")){
                #                                 #procesamos el primero y lo guardamos.
                #                                 lcont1 <- try(proc_serieA(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
                #                                 #Enviar a mongoDB.
                #                                 if(class(lcont1) == "try-error"){
                #                                         lcont1 <- vector("list")
                #                                         lcont1$bol <- bol_listA[[d]]$codigo
                #                                         lcont1$url <- bol_listA[[d]]$url
                #                                         print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                #                                         next()
                #                                 }
                #                                 #boletin procesado, enviar a MongoDB
                #                                 if(class(lcont1) != "try-error" & length(lcont1)>0){
                #                                         #Añadir url a cada elemento de la lista (uno por enmienda)
                #                                         lcont1$url <- bol_listA[[d]]$url
                #                                         #Enviar
                #                                         mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
                #                                         lcontb <- lapply(list(lcont1), function(x) {return(mongo.bson.from.list(x))})
                #                                         mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                #                                         next()
                #                                 }
                #                         }
                #                         #Procesamiento de los siguientes, según tipo de trámite
                #                         #NOTA. Si son enmiendas se envía una por cada grupo.
                #                         #      Si son de otro tipo se unen y se envían juntas.
                #                         if(bol_listA[[d]]$tramite %in% c("Enmiendas e índice de enmiendas al articulado","Enmiendas")){
                #                                 # procesar trámite "Enmiendas e índice de enmiendas al articulado"
                #                                 # y enviar aparte.
                #                                 lcont <- try(proc_serieA_enmiendas(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
                #                                 if(class(lcont) == "list"){
                #                                         #unir Enmiendas mismo grupo parlamentario
                #                                         lcont <- unirEnmiendas(lcont)
                #                                         #Crear campo autor
                #                                         #                                         lcont <- sapply(lcont, FUN=crearCampoAutor)
                #                                 } 
                #                                 #caso de error al procesar: imprimir mensaje y enviar vacio.
                #                                 if(class(lcont) == "try-error"){
                #                                         lcont <- vector("list")
                #                                         lcont$bol <- bol_listA[[d]]$codigo
                #                                         lcont$url <- bol_listA[[d]]$url
                #                                         print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                #                                         next()
                #                                 }
                #                                 #boletin procesado, enviar a MongoDB
                #                                 if(class(lcont) != "try-error" & length(lcont)>0){
                #                                         #Añadir url a cada elemento de la lista (uno por enmienda)
                #                                         for(k in 1:length(lcont)){
                #                                                 lcont[[k]]$url <- bol_listA[[d]]$url
                #                                                 lcont[[k]]$created <- as.POSIXct(Sys.time(), tz="CET")
                #                                         }
                #                                         mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
                #                                         lcontb <- lapply(lcont, function(x) {return(mongo.bson.from.list(x))})
                #                                         mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                #                                         next()
                #                                 }
                #                         } else {#El resto de documentos. 
                #                                 #Vamos uniendo los boletines.
                #                                 lcont2 <- list() 
                #                                 if(length(lcont2) > 0){
                #                                         #ya existe, añadimos elementos.
                #                                         ltmp <- try(proc_serieA(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
                #                                         ltmp$url <- bol_listA[[d]]$url
                #                                         #Actualizar lcont2
                #                                         lcont2$bol <- c(lcont2$bol, ltmp$bol)
                #                                         lcont2$tramite <- c(lcont2$bol, ltmp$tramite)
                #                                         lcont2$content <- c(lcont2$content, ltmp$content)
                #                                         lcont2$fecha <- c(lcont2$fecha, ltmp$fecha)
                #                                         lcont2$url <- c(lcont2$url, ltmp$url)
                #                                 }
                #                                 if(length(lcont2) == 0){
                #                                         lcont2 <- try(proc_serieA(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
                #                                         lcont2$url <- bol_listA[[d]]$url
                #                                 }
                #                                 #caso de error al procesar: imprimir mensaje y enviar vacio.
                #                                 if(class(lcont2) == "try-error"){
                #                                         lcont2 <- vector("list")
                #                                         lcont2$bol <- bol_listA[[d]]$codigo
                #                                         lcont2$url <- bol_listA[[d]]$url
                #                                         lcont2$created <- as.POSIXct(Sys.time(), tz="CET")
                #                                         print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                #                                         next()
                #                                 }
                #                                 #boletin procesado, enviar a MongoDB
                #                                 if (class(lcont2) != "try-error" & length(lcont) > 0) {
                #                                         #añadir fecha de creacion
                #                                         lcont2$created <- as.POSIXct(Sys.time(), tz="CET")
                #                                         mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
                #                                         lcontb <- lapply(list(lcont2), function(x) {return(mongo.bson.from.list(lcont))})
                #                                         cat(" ", length(lcontb), "\n")
                #                                         mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                #                                 }
                #                         }
                #                 }
                #                 else
                #                 {
                #                         print("Ya presente en mongo!\n")
                #                 }
        }
}

# proy_listA[[i]]$codigo
# for(i in 1:length(proy_listA))
# {
# 	filename <- paste0(GENERATED_BASE_DIR, "dir-", proy_listA[[i]]$codigo, ".rd")
# 	if(!file.exists(filename)){ next() }
# 	load(filename) # se carga bol_listA
# 	#         length(bol_listA) # hay 15 documentos asociados
# 	# names(bol_listA[[i]]) #campos para cada tramite del Proyecto
# 	# bol_listA[[i]]$tramite #trámite en cuestión
# 
# 	for(d in 1:length(bol_listA)){#d=1
# 		load(paste0(bol_listA[[d]]$filename)) # carga lines, que contiene el texto a procesar
# 
# 		#Procesamiento según tipo de trámite
# 		if(bol_listA[[d]]$tramite %in% c("Enmiendas e índice de enmiendas al articulado","Enmiendas")){
# 			# procesar trámite "Enmiendas e índice de enmiendas al articulado"
# 			lcont <- try(proc_serieA_enmiendas(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
# 			#                         lcont <- proc_serieA_enmiendas(lines, codigo=bol_listA[[d]]$codigo)
# 			#caso de error al procesar: imprimir mensaje y enviar vacio.
# 			if(class(lcont) == "try-error"){
# 				lcont <- vector("list")
# 				lcont$bol <- bol_listA[[d]]$codigo
# 				lcont$url <- bol_listA[[d]]$url
# 				print(paste("falla el boletin:", bol_listA[[d]]$codigo))
# 				next()
# 			}
# 			#boletin procesado, enviar a MongoDB
# 			if(class(lcont) != "try-error" & length(lcont)>0){
#                                 #Añadir url a cada elemento de la lista (uno por enmienda)
# 			        for(k in 1:length(lcont)){
# 			                lcont[[k]]$url <- bol_listA[[d]]$url
# 			        }
# 				mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
# 				lcontb <- lapply(lcont, function(x) {return(mongo.bson.from.list(x))})
# 				mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
# 			}
# 		} else {
# 			#                         lcont <- proc_serieA(lines, codigo=bol_listA[[d]]$codigo)
# 			lcont <- try(proc_serieA(lines, codigo = bol_listA[[d]]$codigo, tramite = bol_listA[[d]]$tramite))
# 			#caso de error al procesar: imprimir mensaje y enviar vacio.
# 			if(class(lcont) == "try-error"){
# 				lcont <- vector("list")
# 				lcont$bol <- bol_listA[[d]]$codigo
# 				lcont$url <- bol_listA[[d]]$url
# 				print(paste("falla el boletin:", bol_listA[[d]]$codigo))
# 				next()
# 			}
# 			#boletin procesado, enviar a MongoDB
# 			if (class(lcont) != "try-error" & length(lcont) > 0) {
#                                 lcont$url <- bol_listA[[d]]$url
# 				mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
# 				lcontb <- lapply(list(lcont), function(x) {return(mongo.bson.from.list(lcont))})
# 				cat(" ", length(lcontb), "\n")
# 				mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
# 			}
# 		}
# 	}
# }


