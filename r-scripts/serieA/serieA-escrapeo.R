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
source("funciones-escrapeo.R")
source("funciones-procesamiento.R")

###################################################
#   URL fija Congreso - Serie A: Proyectos de ley  #
###################################################

# firstURL: es fija
firstURL <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Publicaciones/IndPub?_piref73_1340068_73_1340059_1340059.next_page=/wc/indicePublicaciones&letra=a"
browseURL(firstURL)

###################################################
# Paso 1) Escrapeo firstURL (='directorio' Serie A)
###################################################

## Crear un directorio de proyectos*URLS
doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)
f1 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
length(f1) #134 documentos

#llamamos a la función propia construir_dir_serieA
proy_listA <- construir_dir_serieA(f1 = f1, proy_listA = proy_listA)

#Guardar el directorio
save(proy_listA, file = "dir-serieA.rd")
# load("dir-serieA.rd") #para cargarlo

proy_listA[[1]] #ej. primer proyecto de ley de la lista

#######################################################################
# Paso 2) Escrapeo secURL (='directorio' de cada boletin de la Serie A)
#######################################################################

### Bucle FOR para descargar todos los boletines para los Proyectos de ley dados.

### para probar solo descargamos los dos primeros

length(proy_listA) #134 Proyectos
for(i in 9:20){#i=90 para descargar uno de ellos; for(i in 1:length(proy_listA)) para descargar todos
        secURL <- proy_listA[[i]]$url
        browseURL(secURL) #para comprobar
        #escrapeamos
        doc  <- htmlTreeParse(getURL(secURL), encoding="UTF-8", useInternalNodes=TRUE)
        f2 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')
        
        ## almacenar todos los boletines del Proyecto de Ley en cuestión
        #va guardando ficheros locales, si no se desea guardar fichero local ponemos guardarlocal=FALSE.
        #         length(f2) #19 documentos
        
        #llamamos a la función propia construir_dir_bolA
        #inicializamos la lista
        bol_listA <- list()
        #NOTA. Si guardarlocal = TRUE genera un fichero local que después se procesará.
        bol_listA <- construir_dir_bolA(f2 = f2, guardarlocal = TRUE, bol_list = bol_listA)
        #guardamos bol_listA para mantener un recuento
        if(length(bol_listA)>1 & length(bol_listA[[1]]$codigo)>0){
                e <- str_extract(string = bol_listA[[1]]$codigo, pattern = "A-.*-")
                filename <- paste0("dir-",substr(e, start=0,stop=nchar(e)-1),".rd")
                save(bol_listA, file=filename)
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


