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

#directorio para ficheros locales
dir <- paste0(GENERATED_BASE_DIR, "bocgs-proc")

##################
#  Carga masiva  #
##################

library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("Hmisc")
library("RSQLite")
library("rmongodb")

source("../mongodb-conn.R")
# Cargar código procesamiento
source("../common-funciones-diarios.R")
# source("funciones-procesamiento.R")
# source("funciones-extraccion.R")

# Presupone ficheros locales guardados: 
## bocgs-proc/Diario-PD-num.rd : siendo num un parámetro (número de boletín)

load(paste0(GENERATED_BASE_DIR, "abl.rd"))

l <- list.files(paste0(GENERATED_BASE_DIR, "bocgs-proc"), pattern="Diario-PD-[0-9]+.rd")

# bucle
for(i in 1:length(l)){ #i=8 #i in 1:length(listos_mongo)
	filename <- l[[i]]
	filepath <- paste0(dir, "/", filename)
	num <- str_match(filename, "Diario-PD-([0-9]+).rd")[2]
	print(num)
	load(filepath) #esto carga lines
	#suponemos .rd ya existe
	#         num <- listos_mongo[[i]] #num=555
	resul <- try(proc_DS(lines, num))
	if(class(resul) == "try-error"){
		lcont <- vector("list")
		lcont$bol <- "num"
		#Añadir url
		lcont$url <- paste0("http://www.congreso.es", abl[num, "url"])
		print(paste("falla el boletin:", num))
		next()
		write_error_log("DS-Pleno", paste0("boletin numero ",num), "procesamiento erróneo")
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
		for(k in 1:length(lcont)){#k=1 #
			ref <- lcont[[k]]$ref
			bol <- lcont[[k]]$bol
			print(ref)
			print(bol)
			q <- mongo.bson.from.JSON(paste0('{ "ref":"', lcont[[k]]$ref, '", "bol":"', lcont[[k]]$bol, '" }'))
			a <- mongo.find(mongo, mongo_collection("referencias"), q)
				print("b");
			if(!mongo.cursor.next(a))
			{
				lcont2 <- list()
				lcont2[[1]] <- crearCampoAutor(lcont[[k]])
				lcont2[[1]]$url <- paste0("http://www.congreso.es", abl[num, "url"]) 
				lcont2[[1]]$fecha <- as.POSIXct(abl[num, "date"], tz="CET")
				lcont2[[1]]$origen <- "diariosPD"
				lcontb <- lapply(lcont2, function(x) {return(mongo.bson.from.list(x))})
				mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb)
			}
			else
			{
				print("YA PRESENTE EN MONGO!")
			}
		}
	}
}
