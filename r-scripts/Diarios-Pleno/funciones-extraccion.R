### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Funciones propias para descargar Diarios de Sesiones      #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

# Dado un número de boletin devuelve un URL que contiene un índice de boletines comenzando en el número dado.       
urlPage <- function(num) {
#         urlpre <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&FMT=PUWTXLTS.fmt&DOCS="
        urlpre <- "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&FMT=PUWTXLTS.fmt&DOCS="
        # Enmedio números de boletín, de 25 en 25 26-50: pag - pag+25-1, excepto el último
#         urlpost <- "&DOCORDER=FIFO&OPDEF=Y&QUERY=%28B%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28D%29.ORSE."     
        urlpost <- "&DOCORDER=FIFO&OPDEF=Y&QUERY=%28D%29.PUBL.+%26+%28CONGRESO%29.SECC.+%26+%28PLENO-Y-DIPUTACI%C3%B3N-PERMANENTE%29.ORSE."
        end <- as.integer(num+25-1)
        med <- paste0(num, "-", ifelse(end>npubs, npubs, end))
        return(paste0(urlpre, med, urlpost))
}

# Devuelve la URL de un número del BOCG de serie D, num es una cadena
urlhtml <- function(num) {
        return(sprintf("http://www.congreso.es/portal/page/portal/Congreso/PopUpCGI?CMD=VERLST&CONF=BRSPUB.cnf&BASE=PU10&PIECE=PUWC&DOCS=1-1&FMT=PUWTXDTS.fmt&OPDEF=Y&QUERY=BOCG-10-D-%s.CODI.", num))
}

cleanBN <- function(x) { return( gsub(" +", " ", gsub("[[:cntrl:]]", "", x)) )}

# Dado un nodo, Extrae los enlaces a los boletines
extractlink <- function(nodo) {#nodo=bollinks[[1]]
        info <- list()
        info$url   <- xmlAttrs(nodo)["href"]
        info$texto <- str_trim(cleanBN(xmlValue(nodo)))
        match <- str_match(info$texto,
                          "núm\\. ([0-9]{1,4}),.* ([0-9]{2}/[0-9]{2}/[0-9]{4})")
        info$num   <- match[, 2]
        info$datestr <- match[, 3]
        info$date   <- as.Date(info$datestr, "%d/%m/%Y")
        
        return(info)
}

# Dada la url del boletin devuelve el árbol XML completo, uniendo distintas partes si es necesario
getBOCG <- function(num, url="", browse=FALSE) {
        
        # Capturo el documento completo
        # TODO: control de errores si falla getURL
        cat("Descargando el documento \n")
        if (url=="") {
                gurl <- urlhtml(num)
        } else {
                gurl <- url
        }
        
        doc <- htmlTreeParse(getURL(gurl), encoding="UTF-8", useInternalNodes=TRUE)
        if (browse) browseURL(gurl)
        
        # Gestión de las partes, que puede haber, o no
        cat("Buscando partes \n")
        partesNS <- getNodeSet(doc, '//*[@id="TEXTOS_POPUP"]/p[1]/a')
        #//*[@id="TEXTOS_POPUP"]/p[1]
        #//*[@id="TEXTOS_POPUP"]/p[1]/a[1]
        lparts <- length(partesNS)
        if (!is.null(partesNS)) {
                # Encontrar los enlaces a otras partes y unirlas en un único bloque
                partes <- xmlApply(partesNS, function(x) {
                        m <- str_match(xmlValue(x), "parte.+([[:digit:]]+)")
                        print(m)
                        if (!is.na(m[1])) {
                                url <- paste0("http://www.congreso.es", xmlAttrs(x)["href"])
                                return( c(m[1], url) )
                        } else {
                                return( c(NA, NA) )
                        }
                })
                partes <- do.call(rbind, partes)
                cat("Hay ", nrow(partes), "partes \n")    
        }
        
        # Leo el texto de la primera parte
        cat("Procesando primera parte \n")
        tst  <- xmlChildren(getNodeSet(doc, "//*[@id='TEXTOS_POPUP']/div[3]")[[1]])   # Primera parte
        # otras partes //*[@id="TEXTOS_POPUP"]/div[2]
        # Bucle para las restante partes
        if (!is.null(partesNS)) {
                print(partes)
                for (i in 1:nrow(partes)) {
                        if (!is.na(partes[i, 1])) {
                                cat("Procesando", partes[i,1], " \n")
                                cat(partes[i, 2], "\n")
                                doc2 <- htmlTreeParse(getURL(partes[i, 2]), encoding="UTF-8", useInternalNodes=TRUE)
                                # PROBLEMA PORQUE DEVUELVE NODOS NULL QUE HAY QUE ELIMINAR ANTES DE XMLChildren
                                nodeset <- getNodeSet(doc2, "//*[@id='TEXTOS_POPUP']/div[2]")
                                if (is.null(nodeset))
                                        nodeset <- getNodeSet(doc2, "//*[@id='TEXTOS']/div[2]")
                                if (!is.null(nodeset)) {
                                        tst2 <- xmlChildren(nodeset[[1]]) # sigiente parte
                                        # Si el html está mal, a veces aparecen muchos nodos dentro de otro, hay que tratarlo
                                        tst <- c(tst, tst2)
                                }
                        }
                }
        }
        # Lo siguiente no sirve, hay que convertir primero a lista de líneas
        
        # //*[@id="TEXTOS_POPUP"]/div[3]/text()[24]
        # //*[@id="TEXTOS_POPUP"]/p[1]
        # Localizar si viene en una o varias partes
        #//*[@id="TEXTOS_POPUP"]/p[1]
        #//*[@id="TEXTOS_POPUP"]/p[1]/a[1]
        #//*[@id="TEXTOS_POPUP"]/div[2]
        
        #length(tst)
        
        return(tst)
}

# Dado nodelist (resultado de la función getBOCG) devuelve las líneas del boletín
flattenXML <- function(nodelist, minsize=2) {
        print(table(sapply(nodelist, xmlSize)))
        maxsize <- max(sapply(nodelist, xmlSize))
        pass <- 1
        while (maxsize > minsize) {
                cat("\n\nPasada ", pass, "\n")
                tstn <- list()
                for (i in 1:length(nodelist)) {
                        nsize <- xmlSize(nodelist[[i]]) 
                        if (nsize <= minsize) {
                                tstn <- c(tstn, nodelist[[i]])
                        } else {
                                cat(i, "\n")
                                if (class(nodelist[[i]])=="NULL") warning("class NULL")
                                if (is.null(nodelist[[i]])) warning("Aquí hay un nodo vacío")
                                child <- xmlChildren(nodelist[[i]])
                                for (j in 1:length(child)) {
                                        if (is.null(child[[j]])) warning("Hijo NULL")
                                        tstn <- c(tstn, child[[j]])
                                }
                        }
                }
                nodelist <- tstn
                maxsize <- max(sapply(nodelist, xmlSize))
                pass <- pass+1
        }
        print(table(sapply(nodelist, xmlSize)))
        return(nodelist)
}
