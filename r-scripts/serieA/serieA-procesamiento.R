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

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Procesamiento Boletines Serie A: Proyectos de Ley      #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

load(paste0(GENERATED_BASE_DIR, "dir-serieA.rd")) # se carga proy_listA
length(proy_listA)
i=1
names(proy_listA[[i]])

# proy_listA[[i]]$codigo
for(i in 1:length(proy_listA))
{
        filename <- paste0(GENERATED_BASE_DIR, "dir-", proy_listA[[i]]$codigo, ".rd")
        if(!file.exists(filename)){ next() }
        load(filename) # se carga bol_listA
#         length(bol_listA) # hay 15 documentos asociados
        # names(bol_listA[[i]]) #campos para cada tramite del Proyecto
        # bol_listA[[i]]$tramite #trámite en cuestión
        
        for(d in 1:length(bol_listA)){#d=1
                load(paste0(bol_listA[[d]]$filename)) # carga lines, que contiene el texto a procesar
                
                #Procesamiento según tipo de trámite
                if(bol_listA[[d]]$tramite == tramitesA[3]){
                        # procesar trámite "Enmiendas e índice de enmiendas al articulado"
                        lcont <- try(proc_serieA_enmiendas(lines, codigo = bol_listA[[d]]$codigo))
#                         lcont <- proc_serieA_enmiendas(lines, codigo=bol_listA[[d]]$codigo)
                        #caso de error al procesar: imprimir mensaje y enviar vacio.
                        if(class(lcont) == "try-error"){
                          lcont <- vector("list")
                          lcont$bol <- bol_listA[[d]]$codigo
                          print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                          next()
                        }
                        #boletin procesado, enviar a MongoDB
                        if(class(lcont) != "try-error" & length(lcont)>0){
                                mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
                                lcontb <- lapply(lcont, function(x) {
                                        return(mongo.bson.from.list(x))
                                })
                                mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                        }
                } else {
#                         lcont <- proc_serieA(lines, codigo=bol_listA[[d]]$codigo)
                        lcont <- try(proc_serieA(lines, codigo = bol_listA[[d]]$codigo))
                        #caso de error al procesar: imprimir mensaje y enviar vacio.
                        if(class(lcont) == "try-error"){
                          lcont <- vector("list")
                          lcont$bol <- bol_listA[[d]]$codigo
                          print(paste("falla el boletin:", bol_listA[[d]]$codigo))
                          next()
                        }
                        #boletin procesado, enviar a MongoDB
                        if (class(lcont) != "try-error" & length(lcont) > 0) {
                                mongo.remove(mongo, mongo_collection("serieA"), criteria=list(bol=bol_listA[[d]]$codigo))
                                lcontb <- lapply(list(lcont), function(x) {
                                        return(mongo.bson.from.list(lcont))
                                })
                                cat(" ", length(lcontb), "\n")
                                mongo.insert.batch(mongo, mongo_collection("serieA"), lcontb)
                        }
                }
        }
}


