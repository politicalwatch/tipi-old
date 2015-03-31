# funciones para descargar boletines de la web

#+++++++++++++++++++++++++++++++++++++++
#  Funciones para crear directorios    #
#++++++++++++++++++++++++++++++++++++++#

#### Función que construye el directorio para toda la Serie B
##Parámetros: 
#             f1 objeto tipo "XMLNodeSet"
#                que recoge info URL que contiene Indice de publicaciones de la serie B
#                URL fija:
#                url-->http://www.congreso.es/portal/page/portal/Congreso/Congreso/Publicaciones/IndPub?_piref73_1340068_73_1340059_1340059.next_page=/wc/indicePublicaciones&letra=b
#             proy_listA lista final que contendra campos (hay que tenerla creada).REVISAR ESTO.

construir_dir_serieB <- function(doc, proy_listB=list()){ 
        proy_listB <- list()
        #paths paraa escrapeo
        f1 <- getNodeSet(doc, '//*[@class="resultados_encontrados"]')  #para sacar el codigo
        p <- "//*[@id='RESULTADOS_BUSQUEDA']/div[@class='resultados']/div[@class='resultados_encontrados']/p[@class='titulo_iniciativa']/a[1]"
        f11 <- getNodeSet(doc, path = p) #para sacar el link
        # length(bol_listB) <- length(f2)
        for(i in 1:length(f1)){#i=1 #i in 1:2
                x <- xmlValue(f1[[i]], trim = TRUE)
                ##Extraer codigo Proposición de ley: B-x
                if(!is.na(s <- str_extract(string = x, pattern = '(B-[0-9]{1,3})'))) { codigo <- s }
                ##Construir secURL que nos lleva al PL
                nodo <- f11[[i]]
                if(!is.null(codigo)){ 
                        secURL <- xmlAttrs(nodo)["href"]
                        names(secURL) <- NULL
                } else { 
                        stop("No existe un código en el texto") 
                        break 
                } 
                #Almacenar proposición de ley en el directorio
                #y guardar campos: referencia, titulo, numero documentos, url
                tmp <- list()
                tmp$titulo <- x
                tmp$codigo <- codigo
                tmp$url <- secURL
                proy_listB <- append(proy_listB, list(tmp))
        }
        return(proy_listB)
}


#### Función que construye el directorio para un boletín de la Serie A (ej A-X).
##Parámetros: 
#             f2 objeto tipo "XMLNodeSet"
#                que recoge info URL que contiene Indice del boletin en cuestion
#                ejemplo de URL:
#                url-->http://www.congreso.es/portal/page/portal/Congreso/Congreso/Publicaciones/IndPub?_piref73_1340068_73_1340059_1340059.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IP10&FMT=INPTXLTS.fmt&DOCS=1-200&DOCORDER=FIFO&OPDEF=Y&DES1=Proyectos+de+Ley&DES2=A&DES3=a&NUM1=1&QUERY=%28121%2F000001%2F0000.NDOC.+O+%28congreso.SECC.+Y+A.SERI.+Y+1.NDIA.%29%29
#             guardarlocal = TRUE o FALSE, si queremos que guarde fichero local en el directorio actual
construir_dir_bolB <- function(doc2, guardarlocal = FALSE, bol_list=list()){ 
        bol_listB <- list()
        f2 <- getNodeSet(doc2, '//*[@class="resultados_encontrados"]')
        #Path para escrapear urls
        p <- "//*[@id='RESULTADOS_BUSQUEDA']/div[@class='resultados']/div[@class='resultados_encontrados']/p[@class='subtitulo_iniciativa']/a[1]"
        f22 <- getNodeSet(doc2, path = p) #para extraer la url
        # length(bol_listA) <- length(f2)
        for(i in 1:length(f2)){#i=1 #i in 1:length(f2)
                x1 <- xmlValue(f2[[i]], trim = TRUE)

                ##De momento descargamos los Diarios de sesiones, se procesaran aparte.
                if(str_detect(string = str_trim(x1), pattern = '^DS')){ break }
                
                ## Extraer número boletin
                if(!is.na(s <- str_extract(string = x1, pattern = 'núm.(.*?)[0-9]{1,3}-[0-9]{1,3}'))) { codigo <- s }
                #admite numeros 1-2, 1-21, 1-211....
                #Transformamos para que se parezca a B-X-X
                if(!is.null(codigo)){ codigo1 <- gsub(pattern = "n[úu]m. ", replacement = "B-", codigo) }
                
                ### Extraer fecha
                f1 <- str_extract(string = x1, pattern = '([0-9]{2})/([0-9]{2})/([0-9]{4})')
                
                ### Extraer url
                nodo <- f22[[i]]
                url <- paste0("http://www.congreso.es",xmlAttrs(nodo)["href"])

                #descargar documento
                # obtener las lineas del texto
                tst <- getBOCG(url = url, browse = FALSE)
                tst   <- flattenXML(tst) #aplicamos getBOCG manualmente hasta adaptar a serie A
                lines <- unlist(lapply(tst, function(x) str_trim(xmlValue(x))))
                
                #guardar en un fichero temporal
                filename <- paste0(GENERATED_BASE_DIR, "BOCG-", codigo1, ".rd")
                if(guardarlocal){ save(lines, file=filename) }
                
                #almacenar boletin en el directorio
                tmp <- list()
                #                 tmp$x <- str_trim(x1)
                tmp$x <- str_trim(cleanBN(str_replace(string = x1, pattern = '\\n', replacement = "")))
                tmp$codigo <- codigo1
                tmp$tramite <- ""
                #[CAMBIO: AMPLIAR LISTA TRAMITES] Para la serie B distinguimos una lista ampliada, tramitesBamp
                if(any(tr <- str_detect(string = tmp$x, pattern = tramitesBamp))){ tmp$tramite <- tramitesBamp[tr] }
                tmp$fecha <- f1
                tmp$url <- url
                tmp$proc <- 0 #marcado comoprocesado?
                tmp$filename <- filename
                bol_list <- append(bol_list, list(tmp))
        }
        return(bol_list)
}


#+++++++++++++++++++++++++++++++++++++++++++++++++#
#  Funciones de escrapeo adaptadas a la serie A   #
#+++++++++++++++++++++++++++++++++++++++++++++++++#

### FUNCIONES DE ESCRAPEO ADAPTADAS A LA SERIE A

fechanum <- function(f){#f='2013/01/13'
        paste0(str_split(f, "/")[[1]][3], str_split(f, "/")[[1]][2], str_split(f, "/")[[1]][1])
        #devuelve '20130113'
}

#función genérica para quitar blancos
cleanBN <- function(x) { return( gsub(" +", " ", gsub("[[:cntrl:]]", "", x)) )}

## Dada la url del boletin devuelve el árbol XML completo, uniendo distintas partes si es necesario
getBOCG <- function(url="", browse=FALSE) {
        
#         ## Capturo el documento completo
#         ## TODO: control de errores si falla getURL
#         cat("Descargando el documento \n")
#         if (url=="") {
#                 gurl <- urlhtml(num)
#         } else {
#                 gurl <- url
#         }
        ###serie A:
        gurl <- url
        doc <- htmlTreeParse(getURL(gurl), encoding="UTF-8", useInternalNodes=TRUE)
        if (browse) browseURL(gurl)
        
        ## Gestión de las partes, que puede haber, o no
        cat("Buscando partes \n")
        partesNS <- getNodeSet(doc, '//*[@id="TEXTOS_POPUP"]/p[1]/a')
        #//*[@id="TEXTOS_POPUP"]/p[1]
        #//*[@id="TEXTOS_POPUP"]/p[1]/a[1]
        lparts <- length(partesNS)
        if (!is.null(partesNS)) {
                ## Encontrar los enlaces a otras partes y unirlas en un único bloque
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
        
        ## Leo el texto de la primera parte
        cat("Procesando primera parte \n")
        tst  <- xmlChildren(getNodeSet(doc, "//*[@id='TEXTOS_POPUP']/div[3]")[[1]])   ## Primera parte
        ## otras partes //*[@id="TEXTOS_POPUP"]/div[2]
        ## Bucle para las restante partes
        if (!is.null(partesNS)) {
                print(partes)
                for (i in 1:nrow(partes)) {
                        if (!is.na(partes[i, 1])) {
                                cat("Procesando", partes[i,1], " \n")
                                cat(partes[i, 2], "\n")
                                doc2 <- htmlTreeParse(getURL(partes[i, 2]), encoding="UTF-8", useInternalNodes=TRUE)
                                ## PROBLEMA PORQUE DEVUELVE NODOS NULL QUE HAY QUE ELIMINAR ANTES DE XMLChildren
                                nodeset <- getNodeSet(doc2, "//*[@id='TEXTOS_POPUP']/div[2]")
                                if (is.null(nodeset))
                                        nodeset <- getNodeSet(doc2, "//*[@id='TEXTOS']/div[2]")
                                if (!is.null(nodeset)) {
                                        tst2 <- xmlChildren(nodeset[[1]]) ## sigiente parte
                                        ## Si el html está mal, a veces aparecen muchos nodos dentro de otro, hay que tratarlo
                                        tst <- c(tst, tst2)
                                }
                        }
                }
        }
        ## Lo siguiente no sirve, hay que convertir primero a lista de líneas
        
        # //*[@id="TEXTOS_POPUP"]/div[3]/text()[24]
        # //*[@id="TEXTOS_POPUP"]/p[1]
        ## Localizar si viene en una o varias partes
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