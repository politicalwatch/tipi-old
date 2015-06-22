### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Entrada: ninguna
# Salida: 3 tipos de fichero
## 1) allbollinks.rd --> directorio de urls de boletines serie D con algunos datos adicionales (serie, fecha...)
## 2) abl.rd --> directorio de urls de boletines serie D **pendientes** de descarga
## 3) bocgs-proc/ZZZZZ.rd : 
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#


### Diarios de Sesiones - Pleno y Diputación Permanente

### Cargar paquetes
library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("RSQLite")
library("rmongodb")

### Cargar funciones propias
source("../common.R")
#listas comunes a todas las series
source("../common-lists.R")
# source("funciones-extraccion.R")
source("../common-funciones-diarios.R")

#################################
# Parte 1: Descarga desde la web
#################################

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Crear un indice con todos los Diarios-Pleno y Diputación Permanente pendientes a la fecha de descarga #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

#Abrir url con todos los boletines publicados de la serie D
firstURL <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&FMT=PUWTXLTS.fmt&DOCS=1-25&DOCORDER=FIFO&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28PLENO-Y-DIPUTACI%C3%B3N-PERMANENTE%29.ORSE."
browseURL(firstURL)

doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)

#número de diarios publicados
npubs <- as.integer(xmlValue(getNodeSet(doc, '//*[@id="RESULTADOS_BUSQUEDA"]/div[2]/span')[[1]]))
cat("Se han encontrado ", npubs, " diarios")
pags <- seq(1, npubs, by=25)

## Descarga las URLs de todos los boletines
allbollinks <- list()

# Tenemos pags que nos da la secuencia desde el primero al último
for (pag in pags) {#pag=1
        cat("Procesando página", pag, "\n")
        urlpag <- urlPage(pag)
        html <- try(getURL(urlpag))
        if (class(html) == "try-error" || str_detect(html, "An error")) {
                warning("No se ha podido descargar página ", ceiling(pag/25), "\n")
        } else {
                doc      <- htmlTreeParse(html, encoding="UTF-8", useInternalNodes=TRUE)
                bollinks <- getNodeSet(doc, '//*[@id="RESULTADOS_BUSQUEDA"]/div[@class="resultados"]/div[@class="resultados_encontrados"]/p[@class="titulo_iniciativa"]/a')
                allbollinks <- c(allbollinks, lapply(bollinks, extractlink))
        }
        # Por si se corta a medias, saber por dónde vamos
         save(allbollinks, file=paste0(GENERATED_BASE_DIR, "allbollinks.rd"))
        cat("end pag", pag, "\n")
}
cat("end ALL PAGS!!\n")

load(paste0(GENERATED_BASE_DIR, "allbollinks.rd"))
#info [1] "url"     "texto"  "num"     "datestr" "date"   

#++++++++++++++++++++++++++++++++++++++++++++++++#
# Obtención de Diarios pendientes de descargar #
#++++++++++++++++++++++++++++++++++++++++++++++++#
# Si ya tenemos un diario descargado se marca en allbollinks
# Nota: se sobreescribe allbollinks.rd
for (i in 1:length(allbollinks)) {
        fname <- paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-PD-", allbollinks[[i]]$num, ".rd")
        allbollinks[[i]]$filexists <- file.exists(fname)
}
save(allbollinks, file=paste0(GENERATED_BASE_DIR, "allbollinks.rd")) 

# Creamos una estructura de data frame con todos pendientes y la guardamos.
abl <- ldply(allbollinks, data.frame)

# Filtrar las pendientes de descarga y guardar.
save(abl, file=paste0(GENERATED_BASE_DIR, "abl.rd"))  ## Fichero con los boletines pendientes de descargar/procesar

str(abl) #tantas filas como boletines pendientes de descargar y 7 campos.


#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Bucle para descargar todos los boletines 'nuevos' a una fecha #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Para cada boletin pendiente generamos un fichero bocgs-proc/BOCG-D-num.rd : siendo num el número de boletín

load(paste0(GENERATED_BASE_DIR, "abl.rd"))

for(num in 1:nrow(abl)){#num=1
		cat("AMWAWIN\n")
		nn <- abl[num, "num"]
		cat("es:<", nn, ">")
		f <- paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-PD-", nn, ".rd")
		cat(f)
        if (file.exists(paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-PD-", nn, ".rd"))) {
                load(paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-PD-", nn, ".rd"))
        } else {
                url <- paste0("http://www.congreso.es", abl[num, "url"])
                tst   <- flattenXML(getBOCG(nn, url, browse=FALSE), 0)
                lines <- unlist(lapply(tst, function(x) str_trim(xmlValue(x))))
                save(lines, file=paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-PD-", nn, ".rd"))
        }
}


