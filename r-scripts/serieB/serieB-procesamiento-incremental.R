
### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## lista proy_listB con directorio actualizado Proyectos de Ley
##        ---> fichero "dir-serieB.rd"
## lista bol_listB con referencias a documentos para todos los Proyectos de Ley en proy_listB
##        ---> ficheros del tipo "dir-A-X.rd"
# Salida: ninguna; se alimenta bbdd mongo
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("RSQLite")
library("rmongodb")

source("../common.R")
source("../mongodb-conn.R")
source("funciones-procesamiento.R")

#listas comunes a todas las series
source("../common-lists.R")

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Procesamiento Boletines Serie A: Proyectos de Ley      #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

load(paste0(GENERATED_BASE_DIR, "dir-serieB.rd")) # se carga proy_listB
length(proy_listB)

# proy_listB[[i]]$codigo
for(i in 1:length(proy_listB)){#i=1 #for(i in 1:length(proy_listB))

	filename <- paste0(GENERATED_BASE_DIR, "dir-", proy_listB[[i]]$codigo, ".rd")
	if(!file.exists(filename)){ next() }
	load(filename) # se carga bol_listB
	#         length(bol_listB) # hay 15 documentos asociados
	# names(bol_listB[[i]]) #campos para cada tramite del Proyecto
	# bol_listB[[i]]$tramite #trámite en cuestión

	count <- 0
	#vector de control
	vcontrol <- rep(0, length(bol_listB))
	for(d in 1:length(bol_listB)){#d=1

		#q <- mongo.bson.from.JSON(paste0('{ "bol":"', bol_listB[[d]]$codigo, '", "numenmienda":"', '', '" }'))
		q <- mongo.bson.from.JSON(paste0('{ "bol":"', bol_listB[[d]]$codigo, '" }'))
		a <- mongo.find(mongo, mongo_collection("referencias"), q)
		if(!mongo.cursor.next(a))
		{
			print("No estaba, añadiendo")
			print(bol_listB[[d]]$codigo)
			if(!file.exists(bol_listB[[d]]$filename)){ next() }
			load(bol_listB[[d]]$filename) # carga lines, que contiene el texto a procesar
                        #Procesammos el primero y lo guardamos.
			#Procesamiento del boletín B-1-X: Proposición de Ley
			if(bol_listB[[d]]$tramite %in% c("Iniciativa", "Proposicion de Ley", "Proposición de Ley")){
			        #procesamos el primero y lo guardamos.
			        lcont1 <- try(proc_serieB(lines, codigo = bol_listB[[d]]$codigo, tramite = bol_listB[[d]]$tramite))
                                #tratar campo autor.
                                if(!is.null(lcont1$autor)){#eliminar autores iguales a '='
                                        if(lcont1$autor == ""){ lcont1$autor <- NULL }
                                }
                                #Crear campo autor.
                                lcont1 <- crearCampoAutor(lcont1)
			        #Enviar a mongoDB.
			        if(class(lcont1) == "try-error"){
			                lcont1 <- vector("list")
			                lcont1$bol <- bol_listB[[d]]$codigo
			                lcont1$url <- bol_listB[[d]]$url
			                print(paste("falla el boletin:", bol_listB[[d]]$codigo))
							write_error_log("serieB", bol_listB[[d]], "procesamiento erróneo")
			                next()
			        }
			        #boletin procesado, enviar a MongoDB
			        if(class(lcont1) != "try-error" & length(lcont1)>0){
			                #Añadir url a cada elemento de la lista (uno por enmienda)
			                lcont1$url <- bol_listB[[d]]$url
			                #Enviar
			                mongo.remove(mongo, mongo_collection("referencias"), criteria=list(bol=bol_listB[[d]]$codigo))
			                lcontb <- lapply(list(lcont1), function(x) {return(mongo.bson.from.list(x))})
			                mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb)
			        }
			        vcontrol[d] <- 1
			}
			#Procesamiento de los siguientes, según tipo de trámite
			#NOTA. Si son enmiendas se envía una por cada grupo.
			#      Si son de otro tipo se unen y se envían juntas.
			if(bol_listB[[d]]$tramite %in% c("Enmiendas e índice de enmiendas al articulado","Enmiendas")){
			        # procesar trámite "Enmiendas e índice de enmiendas al articulado"
			        # Primeramente lcont contiene cada enmienda por separado.
			        lcont <- try(proc_serieB(lines, codigo = bol_listB[[d]]$codigo, tramite = bol_listB[[d]]$tramite))
			        #Consieramos el grupo no detectado por R como un nuevo grupo, para que una las Enmiendas (sin determinar).
			        for(k in 1:length(lcont)){#k=1
			                if(is.null(lcont[[k]]$grupos)){ lcont[[k]]$grupos <- "Sin Determinar" }
			        }
			        #Unir Enmiendas.
			        if(class(lcont) == "list"){
			                if(length(lcont)>1){#Unir enmiendas.
			                        #unir Enmiendas mismo grupo parlamentario
			                        lcont2 <- list() ###TODO. bucle para añadir a lcont el grupo "sin asignar" y añadir éste a lgrupos para que itere.
			                        lgrupos <- unique(sapply(1:length(lcont), function(x){ print(lcont[[x]]$grupos) }, simplify = TRUE))
			                        for(i in 1:length(lgrupos)){#i=1
			                                if(!is.character(lgrupos[[i]])){#grupo nulo, se salta de momento.TODO.Forzar que todos tengan '='
			                                        next()
			                                }
			                                elem <- agruparUnGrupo(lcont = lcont, grupo = lgrupos[[i]])
			                                lcont2[[i]] <- elem
			                        }
			                        #lgrupos nos da cuáles hay que juntar
			                        #Quitar elementos nulos, si los hay.
			                        lcont2 <- lcont2[!sapply(lcont2, is.null)]
			                        #Crear campo autor
			                        #                                         lcont <- sapply(lcont, FUN=crearCampoAutor)
			                        lcontEn <- list()
			                        for(k in 1:length(lcont2)){#k=1
			                                lcontEn[[k]] <- crearCampoAutor(lcont2[[k]])  
			                        }
			                        lcont <- lcontEn
			                }else if(length(lcont)==1){#crear campo autor
			                        lcont[[1]] <- crearCampoAutor(lcont[[1]])
			                }
			        } 
			        #caso de error al procesar: imprimir mensaje y enviar vacio.
			        if(class(lcont) == "try-error"){
			                lcont <- vector("list")
			                lcont$bol <- bol_listB[[d]]$codigo
			                lcont$url <- bol_listB[[d]]$url
			                print(paste("falla el boletin:", bol_listB[[d]]$codigo))
							write_error_log("serieB", bol_listB[[d]], "procesamiento erróneo")
			                next()
			        }
			        #boletin procesado, enviar a MongoDB
			        if(class(lcont) != "try-error" & length(lcont)>0){
			                #Añadir url a cada elemento de la lista (uno por enmienda)
			                for(k in 1:length(lcont)){
			                        lcont[[k]]$url <- bol_listB[[d]]$url
			                        lcont[[k]]$created <- as.POSIXct(Sys.time(), tz="CET")
			                }
			                mongo.remove(mongo, mongo_collection("referencias"), criteria=list(bol=bol_listB[[d]]$codigo))
			                lcontb <- lapply(lcont, function(x) {return(mongo.bson.from.list(x))})
			                mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb)
			                vcontrol[d] <- 1
			                next()
			        }
			}
                        #
			#El resto de documentos. 
			#Vamos uniendo los boletines.
			if(count == 0 & !(bol_listB[[d]]$tramite %in% c("Enmiendas e índice de enmiendas al articulado","Enmiendas")) & !(bol_listB[[d]]$tramite %in% c("Iniciativa", "Proposición de Ley", "Proposicion de Ley"))){
			        #Primera vez que se envía un boletín del tercer grupo.
			        lcont2 <- try(proc_serieB(lines, codigo = bol_listB[[d]]$codigo, tramite = bol_listB[[d]]$tramite))
			        if(class(lcont2) == "try-error"){#procesamiento erróneo
							write_error_log("serieB", bol_listB[[d]], "procesamiento erróneo")
			                next()
			        }
			        #tratar campo autor.
			        if(!is.null(lcont2$autor)){#eliminar autores iguales a '='
			                if(lcont2$autor == ""){ lcont2$autor <- NULL }
			        }
			        #Crear campo autor.
			        lcont2 <- crearCampoAutor(lcont2)
                                #
			        lcont2$bol <- list("bol"=lcont2$bol)
			        lcont2$tramite <- list("tramite"=lcont2$tramite)
			        lcont2$url <- list("url"=bol_listB[[d]]$url)
			        count <- count + 1
			        vcontrol[d] <- 1
			}
                        #
			if(count > 0){#unir todas, si hay más de una.
			        ltmp <- try(proc_serieB(lines, codigo = bol_listB[[d]]$codigo, tramite = bol_listB[[d]]$tramite))
			        if(class(ltmp) == "try-error"){#procesamiento erróneo
							write_error_log("serieB", bol_listB[[d]], "procesamiento erróneo")
			                next()
			        }
			        #Añadir url
			        ltmp$url <- bol_listB[[d]]$url
			        #Actualizar lcont2
                                if(count != 1){
                                        lcont2$bol <- c(lcont2$bol, "bol"=ltmp$bol)
                                        lcont2$tramite <- c(lcont2$tramite, "tramite"=ltmp$tramite)
                                        lcont2$content <- c(lcont2$content, ltmp$content)
                                        lcont2$url <- c(lcont2$url, "url"=ltmp$url)
                                }
			        vcontrol[d] <- 1
			        rm(ltmp)
			        if(sum(vcontrol)==length(vcontrol)){#ya hemos procesado todo
			                #enviar a mongo
			                mongo.remove(mongo, mongo_collection("referencias"), criteria=list(bol=bol_listB[[d]]$codigo))
			                lcontb2 <- lapply(list(lcont2), function(x) {return(mongo.bson.from.list(x))})
			                mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb2)
			        }
			        
			}
	}
}
}
