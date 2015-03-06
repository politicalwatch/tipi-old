### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## lista proy_listA con directorio actualizado Proyectos de Ley
##        ---> fichero "dir-serieA.rd"
## lista bol_listA con referencias a documentos para todos los Proyectos de Ley en proy_listA
##        ---> ficheros del tipo "dir-A-X.rd"
# Salida: ninguna; se alimenta bbdd mongo
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

source("funciones-procesamiento.R")

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Procesamiento Boletines Serie A: Proyectos de Ley      #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

load("dir-serieA.rd") # se carga proy_listA
length(proy_listA)
i=1
names(proy_listA[[i]])

# proy_listA[[i]]$codigo
for(i in 1:length(proy_listA)){#i=1
        filename <- paste0("dir-", proy_listA[[i]]$codigo, ".rd")
        load(filename) # se carga bol_listA
#         length(bol_listA) # hay 15 documentos asociados
        # names(bol_listA[[i]]) #campos para cada tramite del Proyecto
        # bol_listA[[i]]$tramite #trámite en cuestión
        
        for(d in 1:length(bol_listA)){#d=1
                load(bol_listA[[d]]$filename) # carga lines, que contiene el texto a procesar
                
                #Procesamiento según tipo de trámite
                if(bol_listA[[d]]$tramite == tramitesA[3]){
                        # procesar trámite "Enmiendas e índice de enmiendas al articulado"
                        resul <- proc_serieA_enmiendas(lines)
                        #boletin procesado, enviar a MongoDB
                        #TODO. Adaptar al caso de lista de listas
                } else {
                        resul <- proc_serieA(lines)
                        #boletin procesado, enviar a MongoDB
#                         if (length(resul) > 0) {
#                                 if (!mongo.is.connected(mg)) mg <- mongo.create(host="grserrano.net")
#                                 mongo.remove(mg, "pdfs.depuracionesInes", criteria=list(bol=bol))
#                                 lcontb <- lapply(lcont, function(x) {
#                                         x$ndx <- NULL
#                                         x$cnt <- NULL
#                                         return(mongo.bson.from.list(x))
#                                 })
#                                 cat(" ", length(lcontb), "\n")
#                                 mongo.insert.batch(mg, "pdfs.depuracionesInes", lcontb)
#                         }
                }
                #Boletin procesado, enviar a mongo

        }
}



