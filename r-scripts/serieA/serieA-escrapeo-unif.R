### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## URL fija congreso + funciones propias
## Salida: 
# ----- ficheros locales que contienen directorios: dir general dir-serieA.rd + un dir por proyecto de ley dir-A-X.rd
# ----- ficheros locales (opcional) con el texto a procesar para cada boletin (A-X-X.rd) en cada proyecto de ley (A-X)
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#


#++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Escrapeo Boletines Serie A: Proyectos de Ley      #
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

#paquetes
library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("RSQLite")
library("rmongodb")

#funciones propias.
source("../common.R")
source("funciones-escrapeo.R")
source("funciones-procesamiento.R")

#listas comunes a todas las series
source("../common-lists.R")

###################################################
#   URL fija Congreso - Serie A: Proyectos de ley  #
###################################################

# firstURL: es fija
firstURL <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Publicaciones/IndPub?_piref73_1340068_73_1340059_1340059.next_page=/wc/indicePublicaciones&letra=a"
# browseURL(firstURL)

###################################################
# Paso 1) Escrapeo firstURL (='directorio' Serie A)
###################################################
if( file.exists(paste0(GENERATED_BASE_DIR, "dir-serieA.rd")) )
{
  load(paste0(GENERATED_BASE_DIR, "dir-serieA.rd"))
} else {
  proy_listA <- list()
}

## Crear un directorio de proyectos*URLS
doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)
# f1 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
# length(f1) #136 documentos)

all_serieA <- construir_dir_serieA(doc = doc)

for(i in 1:length(all_serieA)){#i=10 para descargar uno de ellos; for(i in 1:length(proy_listA)) para descargar todos
	secURL <- all_serieA[[i]]$url
	if( !check_in_sublists_index(list2d=proy_listA, all_serieA[[i]]$codigo) )
	{

		#   browseURL(secURL) #para comprobar
		#escrapeamos
		doc2  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
# 		f2 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')

		## almacenar todos los boletines del Proyecto de Ley en cuestión
		#va guardando ficheros locales, si no se desea guardar fichero local ponemos guardarlocal=FALSE.
		#         length(f2) #19 documentos

		#llamamos a la función propia construir_dir_bolA
        #inicializamos la lista
        bol_listA <- list()
        #NOTA. Si guardarlocal = TRUE genera un fichero local que después se procesará.
        bol_listA <- construir_dir_bolA(doc2, guardarlocal = TRUE, bol_list = bol_listA)
        #guardamos bol_listA para mantener un recuento
        if( length(bol_listA)>0 & length(bol_listA[[1]]$codigo)>0 ){
                e <- str_extract(string = bol_listA[[1]]$codigo, pattern = "A-.*-")
                filename <- paste0(GENERATED_BASE_DIR, "dir-",substr(e, start=0,stop=nchar(e)-1),".rd")
                if(!file.exists(filename)){ save(bol_listA, file=filename) }
        }
		proy_listA <- c(proy_listA, list(all_serieA[[i]]))
		save(proy_listA, file=paste0(GENERATED_BASE_DIR, "dir-serieA.rd"))
	} else {
		cat("elemento procesado previamente!")
	}
}

