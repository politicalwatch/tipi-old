### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Entrada: ninguna
# Salida: 3 tipos de fichero
## 1) allbollinks.rd --> directorio de urls de boletines serie D con algunos datos adicionales (serie, fecha...)
## 2) abl.rd --> directorio de urls de boletines serie D **pendientes** de descarga
## 3) bocgs-proc/ZZZZZ.rd : 
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#


### Diarios de Sesiones - Comisiones

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
source("../common-funciones-diarios.R")

#################################
# Parte 1: Descarga desde la web
#################################

#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Crear un indice con todos los Diarios-Comisiones pendientes a la fecha de descarga #
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

#Abrir url con todos los boletines publicados de la serie D
firstURL <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&FMT=PUWTXLTS.fmt&DOCS=1-25&DOCORDER=FIFO&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28COMISIONES%29.ORSE."
# browseURL(firstURL)

doc  <- htmlTreeParse(getURL(firstURL), encoding="UTF-8", useInternalNodes=TRUE)

#número de diarios publicados
npubs <- as.integer(xmlValue(getNodeSet(doc, '//*[@id="RESULTADOS_BUSQUEDA"]/div[2]/span')[[1]]))
cat("Se han encontrado ", npubs, " diarios")
pags <- seq(1, npubs, by=25)

## Descarga las URLs de todos los boletines
allbollinks_c <- list()
comisiones_c <- vector()

# Tenemos pags que nos da la secuencia desde el primero al último
for (pag in pags) {#pag=1 #pag in pags
        cat("Procesando página", pag, "\n")
        urlpag <- urlPage_c(pag)
        html <- try(getURL(urlpag))
        if (class(html) == "try-error" || str_detect(html, "An error")) {
                warning("No se ha podido descargar página ", ceiling(pag/25), "\n")
        } else {
                doc      <- htmlTreeParse(html, encoding="UTF-8", useInternalNodes=TRUE)
                bollinks <- getNodeSet(doc, '//*[@id="RESULTADOS_BUSQUEDA"]/div[@class="resultados"]/div[@class="resultados_encontrados"]/p[@class="titulo_iniciativa"]/a')
                allbollinks_c <- c(allbollinks_c, lapply(bollinks, extractlink))
                #Obtención de la comisión: se hace con otro path.
                bollinks <- getNodeSet(doc, '//*[@id="RESULTADOS_BUSQUEDA"]/div[@class="resultados"]/div[@class="resultados_encontrados"]/p')
                #quedarnos con los pares
                for(i in seq(from = 2, to = length(bollinks), 2)){#i=2
                        texto <- xmlValue(bollinks[[i]], trim = TRUE)
                        comis <- extractComision(texto)
                        comisiones_c <- c(comisiones_c, comis)
                }
                #Unir las dos listas
                for(k in 1:length(allbollinks_c)){#k=1
                        tmp <- allbollinks_c[[k]]
                        tmp$comision <- comisiones_c[k]
                        allbollinks_c[[k]] <- tmp
                }
        }
        # Por si se corta a medias, saber por dónde vamos
         save(allbollinks_c, file=paste0(GENERATED_BASE_DIR, "allbollinks_c.rd"))
}

load(paste0(GENERATED_BASE_DIR, "allbollinks_c.rd"))
#info [1] "url"     "texto"  "num"     "datestr" "date"  "comision"

#++++++++++++++++++++++++++++++++++++++++++++++++#
# Obtención de Diarios pendientes de descargar #
#++++++++++++++++++++++++++++++++++++++++++++++++#
# Si ya tenemos un diario descargado se marca en allbollinks
# Nota: se sobreescribe allbollinks.rd
for (i in 1:length(allbollinks_c)) {
        fname <- paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-C-", allbollinks_c[[i]]$num, ".rd")
        allbollinks_c[[i]]$filexists <- file.exists(fname)
}
save(allbollinks_c, file=paste0(GENERATED_BASE_DIR, "allbollinks_c.rd")) 

# Creamos una estructura de data frame con todos pendientes y la guardamos.
abl_c <- ldply(allbollinks_c, data.frame)

# Filtrar las pendientes de descarga y guardar.
save(abl_c, file=paste0(GENERATED_BASE_DIR, "abl_c.rd"))  ## Fichero con los boletines pendientes de descargar/procesar

str(abl_c) #tantas filas como boletines pendientes de descargar y 7 campos.


#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Bucle para descargar todos los Diarios 'nuevos' a una fecha #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Para cada boletin pendiente generamos un fichero bocgs-proc/BOCG-D-num.rd : siendo num el número de boletín

load(paste0(GENERATED_BASE_DIR, "abl_c.rd"))

for(num in 1:nrow(abl_c)){#num=1 #num in 1:nrow(abl_c)
		nn <- abl_c[num, "num"]
        if (file.exists(paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-C-", nn, ".rd"))) {
                load(paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-C-", nn, ".rd"))
        } else {
                url <- paste0("http://www.congreso.es", abl_c[num, "url"])
                tst   <- flattenXML(getBOCG(nn, url, browse=FALSE), 0)
                lines <- unlist(lapply(tst, function(x) str_trim(xmlValue(x))))
                save(lines, file=paste0(GENERATED_BASE_DIR, "bocgs-proc/Diario-C-", nn, ".rd"))
        }
}


