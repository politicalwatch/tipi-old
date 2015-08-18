### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## lista proy_listB con directorio actualizado Proyectos de Ley
##        ---> fichero "dir-serieB.rd"
## lista bol_listB con referencias a documentos para todos los Proyectos de Ley en proy_listB
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

load(paste0(GENERATED_BASE_DIR, "dir-serieB.rd")) # se carga proy_listB
length(proy_listB)
i=1
names(proy_listB[[i]])

# proy_listB[[i]]$codigo
for(i in 1:length(proy_listB)){#i=1 #for(i in 1:length(proy_listB))
    filename <- paste0(GENERATED_BASE_DIR, "dir-", proy_listB[[i]]$codigo, ".rd")
    if(!file.exists(filename)){ next() }
    load(filename) # se carga bol_listB
    #         length(bol_listB) # hay 15 documentos asociados
    # names(bol_listB[[i]]) #campos para cada tramite del Proyecto
    # bol_listB[[i]]$tramite #trámite en cuestión
    
    for(d in 1:length(bol_listB)){#d=1
      if(!file.exists(bol_listB[[d]]$filename)){ next() }
      load(bol_listB[[d]]$filename) # carga lines, que contiene el texto a procesar
      
      #Procesamiento idéntico para todos los B
      lcont <- try(proc_serieB(lines, codigo = bol_listB[[d]]$codigo, tramite = bol_listB[[d]]$tramite))
      #caso de error al procesar: imprimir mensaje y enviar vacio.
      if(class(lcont) == "try-error"){
        lcont <- vector("list")
        lcont$bol <- bol_listB[[d]]$codigo
        lcont$url <- bol_listB[[d]]$url
        print(paste("falla el boletin:", bol_listB[[d]]$codigo))
        next()
      }
      #boletin procesado, enviar a MongoDB
      #caso de boletin 'normal' (i.e. sin enmiendas)
      if ( class(lcont) != "try-error" & length(lcont[[1]]) == 1 ) {
        #URL como campo adicional a enviar a mongoDB
        lcont$url <- bol_listB[[d]]$url
        mongo.remove(mongo, mongo_collection("referencias"), criteria=list(bol=bol_listB[[d]]$codigo))
        lcontb <- lapply(list(lcont), function(x) {
          return(mongo.bson.from.list(lcont))
        })
        cat(" ", length(lcontb), "\n")
        mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb)
      }
      #caso de boletin con enmiendas. Ej B-157-5.
      #el primer elemento seria a su vez una lista (con mas de 1 elemento), luego length()>1
      if ( class(lcont) != "try-error" & length(lcont[[1]]) > 1 ){
              for(k in 1:length(lcont)){
                      lcont[[k]]$url <- bol_listB[[d]]$url
              }
              mongo.remove(mongo, mongo_collection("referencias"), criteria=list(bol=bol_listB[[d]]$codigo))
              lcontb <- lapply(lcont, function(x) {
                      return(mongo.bson.from.list(x))
              })
              mongo.insert.batch(mg, mongo_collection("referencias"), lcontb)
      }
    }
}
