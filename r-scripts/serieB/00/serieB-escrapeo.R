### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Entrada: 
## URL fija congreso + funciones propias
## Salida: 
# ----- ficheros locales que contienen directorios: dir general dir-serieB.rd + un dir por proyecto de ley dir-B-X.rd
# ----- ficheros locales (opcional) con el texto a procesar para cada boletin (B-X-X.rd) en cada proyecto de ley (B-X)
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#


#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#      Escrapeo Boletines Serie B: Proposiciones de Ley      #
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

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

########################################################
#   URL fija Congreso - Serie B: Proposiciones de ley  #
########################################################

# firstURL: es fija
firstURL <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Publicaciones/IndPub?_piref73_1340068_73_1340059_1340059.next_page=/wc/indicePublicaciones&letra=b"
# browseURL(firstURL)

###################################################
# Paso 1) Escrapeo firstURL (='directorio' Serie B)
###################################################

#-------------------------------#
#     Primera (y única) vez     #
#-------------------------------#
## Crear un directorio de proyectos*URLS
doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)
# f1 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
# length(f1) #222 documentos)

#llamamos a la función propia construir_dir_serieB
proy_listB <- construir_dir_serieB(doc = doc, proy_listB = proy_listB)
#NOTA. hasta que mejoremos el escrapeo esto es inestable, algunas URLS no son correctas.

#Guardar el directorio
save(proy_listB, file = paste0(GENERATED_BASE_DIR, "dir-serieB.rd"))

proy_listB[[1]] #ej. primer proyecto de ley de la lista

#----------------------------#
#         Siguientes         #
#----------------------------#
#Cargamos el directorio con toda la serie hasta la fecha
load(paste0(GENERATED_BASE_DIR, "dir-serieB.rd"))

#escrapeamos para ver los nuevos
doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)

#creamos directorio actualizado, y contrastamos
proy_listB_updated <- construir_dir_serieB(doc = doc, proy_listB = proy_listB)

proy_listB_pdte <- setdiff(x = proy_listB_updated, y = proy_listB)

#guardamos pendientes
save(proy_listB_pdte, file="abl.rd")
#actualizamos directorio completo
rm(proy_listB)
proy_listB <- proy_listB_updated
save(proy_listB, file = "dir-serieB.rd")
rm(proy_listB_updated)

#######################################################################
# Paso 2) Escrapeo secURL (='directorio' de cada boletin de la Serie A)
#######################################################################

### Bucle FOR para descargar todos los boletines para as Proposiciones de ley dadas

#-------------------------------#
#     Primera (y única) vez     #
#-------------------------------#
length(proy_listB) #222 proposiciones en total
for(i in 1:length(proy_listB)){#i=90 para descargar uno de ellos; for(i in 1:length(proy_listB)) para descargar todos
        secURL <- proy_listB[[i]]$url
        #   browseURL(secURL) #para comprobar
        #escrapeamos
        doc2  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
#         f2 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
        
        ## almacenar todos los boletines del Proyecto de Ley en cuestión
        #va guardando ficheros locales, si no se desea guardar fichero local ponemos guardarlocal=FALSE.
        #         length(f2) #19 documentos
        
        #llamamos a la función propia construir_dir_bolB
        #inicializamos la lista
        bol_listB <- list()
        #NOTA. Si guardarlocal = TRUE genera un fichero local que después se procesará.
        bol_listB <- construir_dir_bolB(doc2, guardarlocal = TRUE, bol_list = bol_listB)
        #guardamos bol_listA para mantener un recuento
        if( length(bol_listB)>0 & length(bol_listB[[1]]$codigo)>0 ){
                e <- str_extract(string = bol_listB[[1]]$codigo, pattern = "B-.*-")
                filename <- paste0(GENERATED_BASE_DIR, "dir-",substr(e, start=0,stop=nchar(e)-1),".rd")
                if(!file.exists(filename)){ save(bol_listB, file=filename) }
        }
}

#----------------------------#
#         Siguientes         #
#----------------------------#
# Cargar la lista de boletines pendientes
load("abl.rd") # se carga la lista proy_listB_pdte
length(proy_listB_pdte) #pendientes de descarga
for(i in 1:length(proy_listB_pdte)){#i=90 para descargar uno de ellos; for(i in 1:length(proy_listB)) para descargar todos
        secURL <- proy_listB_pdte[[i]]$url
        #   browseURL(secURL) #para comprobar
        #escrapeamos
        doc2  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
#         f2 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
        
        ## almacenar todos los boletines del Proyecto de Ley en cuestión
        #va guardando ficheros locales, si no se desea guardar fichero local ponemos guardarlocal=FALSE.
        #         length(f2) #19 documentos
        
        #llamamos a la función propia construir_dir_bolA
        #inicializamos la lista
        bol_listB <- list()
        #NOTA. Si guardarlocal = TRUE genera un fichero local que después se procesará.
        bol_listB <- construir_dir_bolB(doc2, guardarlocal = TRUE, bol_list = bol_listB)
        #guardamos bol_listA para mantener un recuento
        if( length(bol_listB)>0 & length(bol_listB[[1]]$codigo)>0 ){
                e <- str_extract(string = bol_listB[[1]]$codigo, pattern = "B-.*-")
                filename <- paste0(GENERATED_BASE_DIR, "dir-",substr(e, start=0,stop=nchar(e)-1),".rd")
                if(!file.exists(filename)){ save(bol_listB, file=filename) }
        }
}


### ACLARACIONES.
### Por cada Proposición de Ley (B-X) se crea una lista con campos:
# x: titulo
# codigo: B-X-X 
# fecha: dd/mm/aaaa
# url: que da acceso a un tramite de la Proposición de Ley en cuestión
# proc: Indicador procesado 0/1 (inicialmente 0)
# filename: nombre del fichero local, si se almacena.

#### ejemplo.
# ..$ x       : chr "BOCG. Congreso de los Diputados, serie B, núm. 1-1, ..."
# ..$ codigo  : chr "B-1-1"
# ..$ tramite : chr "proposición de Ley"
# ..$ fecha   : chr "13/01/2012"
# ..$ url     : chr "http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDE"| __truncated__
# ..$ proc    : num 0
# ..$ filename: chr "BOCG-B-1-1.rd"