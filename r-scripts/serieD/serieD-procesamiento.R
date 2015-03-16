### Acerca de este script
#++++++++++++++++++++++++++++++++++++++++++++++++#
# Procesamiento masivo textos boletines serie D  #
#++++++++++++++++++++++++++++++++++++++++++++++++#

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
## Cargar lista actualizada de diputados: ¿Es realmente necesario? A REVISAR.
# mg <- mongo.create(host="grserrano.net")
# # diputados
# diputadosan <- mongo.get.values(mg, "pdfs.diputados", "nombrecomp")
# mongo.disconnect(mg)
# ## Se construye la tabla para buscar diputados
# diputados <- data.frame(apnom=diputadosan, nomapre=sapply(diputadosan, apn2nap))
# rownames(diputados) <- NULL
# if (any(duplicated(diputados$diputadosnc))) stop("Cadenas no únicas en diputadosnc")
load("diputados-mongo.rd")

#++++++++++++++++++++++++++++++#
# Listado boletines a procesar #
#++++++++++++++++++++++++++++++#

### obtener listado completo boletines
# cargar fichero abl.rd
load("abl.rd")

# obtener numeros de boletin
nums <- as.character(abl$num)

#directorio para ficheros locales
dir <- "./bocgs-proc"

##################
#  Carga masiva  #
##################

# Cargar código procesamiento
source("funciones-procesamiento.R")

# Presupone ficheros locales guardados: 
## bocgs-proc/BOCG-D-num.rd : siendo num un parámetro (número de boletín)

# bucle
for(i in 1:length(nums)){ #i=630
        #suponemos .rd ya existe
        num <- nums[i] #num=555
        load(paste0(dir, "/BOCG-D-", num, ".rd")) #esto carga lines
        #
        # Procesar contenido
        resul <- try(proc_boletin(lines, num))
        if(class(resul) == "try-error"){
                lcont <- vector("list")
                lcont$bol <- "num"
                print(paste("falla el boletin:", num))
                next()
        } else {
                lcont <- resul
        }
        #enviar a bbdd
        if (length(lcont) > 0) {
                if (!mongo.is.connected(mg)) mg <- mongo.create(host="ds043447.mongolab.com:43447")
                mongo.authenticate(mg, username = "ines", password = "#ines15+?", db = "tipi_debug")
                mongo.remove(mg, "tipi_debug.serieD", criteria=list(bol=num))
                lcontb <- lapply(lcont, function(x) {
                        #campos que no interesa enviar
                        x$ndx <- NULL
                        x$cnt <- NULL
                        return(mongo.bson.from.list(x))
                })
                cat(" ", length(lcontb), "\n")
                mongo.insert.batch(mg, "tipi_debug.serieD", lcontb)
        }
}


