
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
library("RSQLite")
library("rmongodb")

source("../mongodb-conn.R")
# Cargar código procesamiento
source("funciones-procesamiento.R")

# Presupone ficheros locales guardados: 
## bocgs-proc/BOCG-D-num.rd : siendo num un parámetro (número de boletín)


load(paste0(GENERATED_BASE_DIR, "abl.rd"))

l <- list.files(paste0(GENERATED_BASE_DIR, "bocgs-proc"), pattern="BOCG-D-[0-9]+.rd")

procesar_elemento <- function(lcont, k) {
	presente_mongo = FALSE
	if( is.null(lcont[[k]]$numenmienda) ) {
		q <- mongo.bson.from.JSON(paste0('{ "bol": "', lcont[[k]]$bol, '", "ref":"', lcont[[k]]$ref, '" }'))
		a <- mongo.find(mongo, mongo_collection("referencias"), q)
		presente_mongo <- mongo.cursor.next(a)
	} else {
		q <- mongo.bson.from.JSON(paste0('{ "autor":{"grupo":"', unique(lcont[[k]]$grupos), '"}, "bol": "', lcont[[k]]$bol, '", "ref":"', lcont[[k]]$ref, '" }'))
		a <- mongo.find(mongo, mongo_collection("referencias"), q)
		presente_mongo <- mongo.cursor.next(a)
	}
	if(!presente_mongo)
	{
		lcont2 <- list()
		lcont2[[1]] <- crearCampoAutor(lcont[[k]])
		lcont2[[1]]$url <- paste0("http://www.congreso.es", abl[num, "url"]) 
		lcontb <- lapply(lcont2, function(x) {
							 #campos que no interesa enviar
							 x$ndx <- NULL
							 x$cnt <- NULL
							 #TODO. quitar algunos más.
							 x$gopag <- NULL
							 return(mongo.bson.from.list(x))
	})
		mongo.insert.batch(mongo, mongo_collection("referencias"), lcontb)

	} else {
		cat("ya introducido en mongo!\n")
	}
}

# bucle
for(i in 1:length(l)){ #i=630

	filename <- l[[i]]
	filepath <- paste0(dir, "/", filename)
	num <- str_match(filename, "BOCG-D-([0-9]+).rd")[2]
	load(filepath) #esto carga lines
	#
	# Procesar contenido
	resul <- try(proc_boletin(lines, num))
	if(class(resul) == "try-error"){
		lcont <- vector("list")
		lcont$bol <- "num"
		#Añadir url
		lcont$url <- paste0("http://www.congreso.es", abl[num, "url"]) 
		print(paste("falla el boletin:", num))
		write_error_log("serieD", num, "procesamiento erróneo")
		next()
	} else {
		lcont <- resul
	}

	#enviar a bbdd

	if (length(lcont) > 0 & is.null(lcont$special)) {
		#Crear campo autor con formato adecuado.
		#Añadir url.
		for(k in 1:length(lcont)){#k=1
			resul <- try(procesar_elemento(lcont, k))
			if( class(resul) == "try-error" ) {
				write_error_log("serieD_procesamiento", filename, "falló subelemento")
			}
		}
	}
}


