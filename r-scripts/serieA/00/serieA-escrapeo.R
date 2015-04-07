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
library("data.table")
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

#-------------------------------#
#     Primera (y única) vez     #
#-------------------------------#
## Crear un directorio de proyectos*URLS
doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)

## Llamamos a la función propia para el directorio de la serie, construir_dir_serieA
proy_listA <- construir_dir_serieA(doc = doc, proy_listA = proy_listA)

#Guardar el directorio
save(proy_listA, file = paste0(GENERATED_BASE_DIR, "dir-serieA.rd"))

proy_listA[[1]] #ej. primer proyecto de ley de la lista

#----------------------------#
#         Siguientes         #
#----------------------------#
#Cargamos el directorio con toda la serie hasta la fecha
load(paste0(GENERATED_BASE_DIR, "dir-serieA.rd"))

#creamos directorio actualizado, y contrastamos
proy_listA_updated <- construir_dir_serieA(doc = doc, proy_listA = proy_listA)

proy_listA_pdte <- setdiff(x = proy_listA_updated, y = proy_listA)

#guardamos pendientes
save(proy_listA_pdte, file=paste0(GENERATED_BASE_DIR, "abl.rd"))
#actualizamos directorio completo
rm(proy_listA)
proy_listA <- proy_listA_updated
save(proy_listA, file = paste0(GENERATED_BASE_DIR, "dir-serieA.rd"))
rm(proy_listA_updated)

#######################################################################
# Paso 2) Escrapeo secURL (='directorio' de cada boletin de la Serie A)
#######################################################################

### Bucle FOR para descargar todos los boletines para as Proposiciones de ley dadas

#-------------------------------#
#     Primera (y única) vez     #
#-------------------------------#
length(proy_listA) #141 proyectos de ley en total
for(i in 1:length(proy_listA)){#i=90 para descargar uno de ellos; for(i in 1:length(proy_listA)) para descargar todos
        secURL <- proy_listA[[i]]$url
        #   browseURL(secURL) #para comprobar
        #escrapeamos
        doc2  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
#         f2 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
        
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
}

#----------------------------#
#         Siguientes         #
#----------------------------#
# Cargar la lista de boletines pendientes
load(paste0(GENERATED_BASE_DIR, "abl.rd")) # se carga la lista proy_listA_pdte
length(proy_listA_pdte) #pendientes de descarga
for(i in 1:length(proy_listA_pdte)){#i=90 para descargar uno de ellos; for(i in 1:length(proy_listA)) para descargar todos
        secURL <- proy_listA_pdte[[i]]$url
        #   browseURL(secURL) #para comprobar
        #escrapeamos
        doc2  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
        
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
}


### ACLARACIONES.
### Por cada Proyecto de Ley (A-X) se crea una lista con campos:
# x: titulo
# codigo: A-X-X 
# fecha: dd/mm/aaaa
# url: que da acceso a un tramite del Proyecto de Ley en cuestión
# proc: Indicador procesado 0/1 (inicialmente 0)
# filename: nombre del fichero local, si se almacena.

#### ejemplo.
# ..$ x       : chr "BOCG. Congreso de los Diputados, serie A, núm. 1-1, de 13/01/2012 Proyecto de Ley Ver boletín completo: texto íntegro    PDF"
# ..$ codigo  : chr "A-1-1"
# ..$ tramite : chr "Proyecto de Ley"
# ..$ fecha   : chr "13/01/2012"
# ..$ url     : chr "http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDE"| __truncated__
# ..$ proc    : num 0
# ..$ filename: chr "BOCG-A-1-1.rd"