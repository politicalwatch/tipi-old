### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Procesamiento masivo textos Diarios de Sesiones - Pleno y Diputación Permanente #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Nota. Ahora mismo tira de ficheros locales.
# Para que corra automáticamente en el sistema  debemos introducir la lectura
# desde la web como un paso adicional (i.e. evitar leer desde un fichero local)

#################
#  Info previa  # 
#################

#++++++++++++++++++++++++#
# Cargar info de MongoDB #
#++++++++++++++++++++++++#

#####
## Cargar lista actualizada de diputados:
load("diputados-mongo.rd")

#++++++++++++++++++++++++++++++#
# Listado boletines a procesar #
#++++++++++++++++++++++++++++++#
source("../common.R")
#listas comunes a todas las series
source("../common-lists.R")

### obtener listado completo boletines
# cargar fichero abl.rd
load(paste0(GENERATED_BASE_DIR, "listos_mongo.rd"))

#directorio para ficheros locales
dir <- paste0(GENERATED_BASE_DIR, "bocgs-proc")

##################
#  Carga masiva  #
##################

library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("RSQLite")
library("rmongodb")

source("../mongodb-conn.R")
# Cargar código procesamiento
source("funciones-procesamiento.R")
source("funciones-extraccion.R")

# Presupone ficheros locales guardados: 
## bocgs-proc/Diario-PD-num.rd : siendo num un parámetro (número de boletín)

load(paste0(GENERATED_BASE_DIR, "abl.rd"))
load(paste0(GENERATED_BASE_DIR, "listos_mongo.rd"))
if( file.exists(paste0(GENERATED_BASE_DIR, "introducidos_mongo.rd")) )
{
        load(paste0(GENERATED_BASE_DIR, "introducidos_mongo.rd"))
} else {
        introducidos_mongo <- list()
}

pendientes <- setdiff(y = introducidos_mongo, x = listos_mongo)


# bucle
for(i in 1:length(listos_mongo)){ #i=8 #i in 1:length(listos_mongo)
        #suponemos .rd ya existe
#         num <- listos_mongo[[i]] #num=555
        num <- i
        print(num)
        if( ! num %in% introducidos_mongo )
        {
                if(file.exists(paste0(dir, "/Diario-PD-", num, ".rd"))){
                        load(paste0(dir, "/Diario-PD-", num, ".rd")) #esto carga lines
                        #
                        # Procesar contenido
                        resul <- try(proc_DS(lines, num))
                        if(class(resul) == "try-error"){
                                lcont <- vector("list")
                                lcont$bol <- "num"
                                #Añadir url
                                lcont$url <- paste0("http://www.congreso.es", abl[num, "url"]) 
                                print(paste("falla el boletin:", num))
                                next()
                        } else {
                                lcont <- resul
                        }
                        #Actualizar lista eliminando tipos que no se deben procesar.
                        if (length(lcont) > 0 & is.null(lcont$special)){
                                for(k in 1:length(lcont)){
                                        if(lcont[[k]]$tipo %in% noprocesarDS) lcont <- lcont[-k]
                                }
                        }
                        lcont2 <- lcont
                        if (length(lcont2) > 0 & is.null(lcont2$special)){
                                #Añadir url y procesar campo autor
                                for(k in 1:length(lcont)){#k=1
                                        lcont2[[k]] <- crearCampoAutor(lcont[[k]])
                                        lcont2[[k]]$url <- paste0("http://www.congreso.es", abl[num, "url"]) 
                                }
                                
                                lcontb <- lapply(lcont2, function(x) {
                                        #campos que no interesa enviar
#                                         x$ndx <- NULL
#                                         x$cnt <- NULL
                                        #TODO. quitar algunos más.
#                                         x$gopag <- NULL
                                        return(mongo.bson.from.list(x))
                                })
                                #enviar a bbdd
                                mongo.insert.batch(mongo, mongo_collection("diariosPD"), lcontb)
                                introducidos_mongo <- c(introducidos_mongo, num)
                                save(introducidos_mongo, file=paste0(GENERATED_BASE_DIR, "introducidos_mongo.rd"))
                        }
                }
        }
        else
        {
                cat("ya introducido en mongo!")
        }
}