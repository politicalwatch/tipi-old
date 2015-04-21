### Acerca de este script
#++++++++++++++++++++++++++++++++++++++++++++++++++#
# Procesamiento masivo textos Diarios de Sesiones  #
#++++++++++++++++++++++++++++++++++++++++++++++++++#

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

source("~/Documents/mapacino/repos/tipi/r-scripts/common.R")
#listas comunes a todas las series
source("~/Documents/mapacino/repos/tipi/r-scripts/common-lists.R")

source("funciones-procesamiento.R")

#EJEMPLO CONCRETO
#DS NUMERO 200
# DSCD-10-PL-200
#LINK: http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERDOC&CONF=BRSPUB.cnf&BASE=PU10&PIECE=PUWD&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28PLENO-Y-DIPUTACION-PERMANENTE%29.ORSE.+Y+DSCD-10-PL-200.CODI.#1
# DS NUMERO 11
#LINK: url <- "http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERDOC&CONF=BRSPUB.cnf&BASE=PU10&PIECE=PUWD&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28PLENO-Y-DIPUTACION-PERMANENTE%29.ORSE.+Y+CDP201202160011.CODI.#1"
source("funciones-extraccion.R")
### LLEVA A LA PAG 2 dado url <- "http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERDOC&CONF=BRSPUB.cnf&BASE=PU10&PIECE=PUWD&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28COMISIONES%29.ORSE.+Y+CDC201201170011.CODI.#1"
tst <- getBOCG(url = url, browse = FALSE)
tst   <- flattenXML(tst) #aplicamos getBOCG manualmente hasta adaptar a serie A
lines <- unlist(lapply(tst, function(x) str_trim(xmlValue(x))))
save(lines, file="DS-11.rd")

load("DS-11.rd")
load("DS-200.rd")

num <- "200"

lcont <- proc_DS(lines, num)

