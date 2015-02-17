### Acerca de este script
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
# Contiene funcion 'proc_boletin()'.
# Entrada: 
## informacion de mongoDB??
## fichero bocgs-proc/BOCG-D-num.rd : siendo num un parámetro (número de boletín)
# Salida: ninguna; se alimenta bbdd mongo
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

## Boletines del congreso serie D

### Cargar paquetes
library("XML")
library("RCurl")
library("plyr")
library("stringr")
library("data.table")
library("RSQLite")
library("rmongodb")

### Cargar funciones propias
source("funciones-procesamiento.R")

######################################
# Parte 2: Procesamiento del contenido
######################################

###---- Procesamiento de un boletin concreto ---###
# Dado un número de boletin cargamos objeto lines con las líneas del documento
# y se lo pasamos a la funcion

proc_boletin <- function(lines){
        ## Limpieza inicial
        lines <- lines[lines!=""]
        lp  <- grep("^Página", lines)
        ##lpp <- grep("^\\(Página", lines)
        lines <- lines[-c(lp)]
        lines <- cleanBN(lines)
        
        ## T/F si la línea empieza por una referencia
        iref <- str_detect(lines, "^[0-9]{3}\\/[0-9]{5,6}")
        # if (!any(iref)) next ## para el superbucle
        nref <- c(1:length(lines))[iref]
        ## La primera referencia
        firstref <- str_extract(lines[iref][1], "^[0-9]{3}\\/[0-9]{5,6}")
        
        ## Busco las líneas donde aparece, la segunda será el inicio del contenido
        firstreflin <- grep(paste0("^", firstref), lines)
        
        ndxini <- firstreflin[1]
        ndxend <- firstreflin[2]-1
        cntini <- firstreflin[2]
        cntend <- length(lines)
        
        ## [INES] Almacenar localizacion de frases separadoras
        separa_list <- list()
        # generamos una lista que contiene vectores lógicos T/F para cada separador
        for(s in frsep){
                separa_list[[s]] <- str_detect(string = lines, pattern = ignore.case(s))
        }
        
        # [INES] Almacenar localizacion de secciones (NO NECESARIO: VALORAR.)
        sec_list <- list()
        # generamos una lista que contiene vectores lógicos T/F para cada sección
        for(ss in secciones){
                sec_list[[ss]] <- str_detect(string = lines, pattern = ignore.case(ss))
        }
        
        ## [INES] Almacenar secciones y referencias dentro de cada una
        sec_list_refs <- list()        
        for(ss in 1:length(secciones)){
                if(ss < length(secciones)){
                        sec_list_refs[[ss]] <- lines[nref[(nref >= c(1:length(lines))[sec_list[[ss]]][2]) & (nref < c(1:length(lines))[sec_list[[ss+1]]][2])]]
                } else {
                        sec_list_refs[[ss]] <- lines[nref[nref >= c(1:length(lines))[sec_list[[ss]]][2]]]        
                } 
        }
        # finalmente mergear listas (re-utilizar sec_list_refs)
        sec_list_refs <- mapply(c, secciones, sec_list_refs, USE.NAMES = FALSE)
        
        ## [NOTA] La idea es implementar lo mismo con las Comisiones.
        com_list <- list() # lista que almacenará posiciones de cada comisión
        for(cc in comisiones){
                com_list[[cc]] <- str_detect(string = lines, pattern = ignore.case(cc))
        }
        
        ## Vamos añadiendo a una lista, por un lado las líneas de índice y por otro contenido
        
        lcont <- list()
        count <- 0
        nref <- c(nref, cntend)
        if (length(nref)>1) {    
                for (i in 1:(length(nref)-1)) { ## nref contiene las líneas donde hay una referencia, el problema es si no aparecen referencias
                        #                                 browser()
                        count <- count + 1    ## para ir guardando en la lista
                        if (!is.na(ndxend) & nref[i] <= ndxend) {
                                tmp <- list()
                                tmp$bol  <- sprintf("%03d", as.numeric(bol))
                                tmp$ref  <- str_extract(lines[nref[i]], "^[0-9]{3}\\/[0-9]{5,6}")
                                tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
                                tmp$ndx  <- lines[nref[i]:(nref[i+1]-1)] #Contenido del índice.
                                tmp$ndx <- str_replace_all(tmp$ndx, "^[0-9]{3}\\/[0-9]{5,6}", "")
                                tmp$ndx <- str_trim(tmp$ndx)
                                tmp$ndx <- tmp$ndx[tmp$ndx != ""]
                                ## Búsqueda del número de página
                                tmppag <- str_detect(tmp$ndx, "\\(Página.*([0-9]+)\\)")
                                if (any(tmppag)) {
                                        tmp$gopag <-  as.integer(str_match(tmp$ndx[tmppag], "\\(Página([[:digit:]]+)\\)")[, 2])
                                        tmp$ndx <- tmp$ndx[!tmppag]
                                }
                                ## Búsqueda del número de registro
                                tmpreg <- str_detect(tmp$ndx, "\\(núm. reg. [[:digit:]]+\\)")
                                if (any(tmpreg)) {
                                        tmp$numreg <-  as.integer(str_match(tmp$ndx[tmpreg], "\\(núm. reg. ([[:digit:]]+)\\)")[, 2])
                                        tmp$ndx[tmpreg] <- str_replace(tmp$ndx[tmpreg], "\\(núm. reg. [[:digit:]]+\\)", "")
                                }
                                ## Búsqueda del autor en el índice (sólo existe en ciertos tipos)
                                tmpaut <- str_detect(tmp$ndx, "Autor:")
                                if (any(tmpaut)) {
                                        tmp$autor <- str_trim(str_match(tmp$ndx[tmpaut], "Autor:(.*)")[, 2])
                                        tmp$ndx <- tmp$ndx[!tmpaut]
                                }
                                
                                ##[INES 22-12-2014] Búsqueda de grupos parlamentarios en el índice
                                #                                         tmpgparl <- str_detect(tmp$ndx, ignore.case("grupo[s]? parlamentario"))
                                #                                         if (any(tmpgparl)) {
                                #                                                 detgrup    <- str_detect(tmp$ndx[tmpgparl], gparlam$gparlams)
                                #                                                 if(!any(detgrup)){
                                #                                                         tmp$grupos <- gparlam[detgrup, "gparlamab"] ## guardo abreviado  
                                #                                                 }
                                #                                         }
                                ##[INES 19-01-2015]
                                #Buscamos grupo en la primera linea del titulo.
                                tmpgparl <- str_detect(tmp$ndx, ignore.case("grupo[s]? parlamentario"))
                                if (any(tmpgparl)) {
                                        detgrup    <- str_detect(tmp$ndx[tmpgparl][1], gparlam$gparlams)
                                        if(any(detgrup)){
                                                tmp$grupos <- gparlam[detgrup, "gparlamab"] ## guardo abreviado  
                                        }
                                }
                                
                                ##[INES 22-12-2014] TODO: Búsqueda de comisiones en el índice.
                                ##[INES 16-01-2015] Cambio lógica: no se busca en el índice sino el inmediatamente anterior, y solo para algunos tipos
                                #                                 tmpcomis <- str_detect(tmp$ndx, "(Comisi[óo]n)|(Comisiones)")
                                #                                 if (any(tmpcomis)) {
                                #                                         #       tmp$ndx[tmpcomis]
                                #                                         #de momento cogemos sólo una comisión
                                #                                         tmp$comisiones <- str_extract(tmp$ndx[tmpcomis], "Comisión de +([a-zA-Z]+){1,1}")
                                #                                 }        
                                
                                ## El título son las líneas que quedan en el índice excepto la última si
                                ## hay más de una, pero es distinto para las 184 que para el resto
                                tmp$titulo <- tmp$ndx[1]
                                
                                tmp$titulo <- str_replace_all(tmp$titulo, " +", " ") ## Quito espacios duplicados
                                tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
                                
                                ## Esto debe marcar el comienzo del contenido de la referencia que encotramos en el índice
                                secondref  <- grep(paste0("^", tmp$ref), lines)[2]
                                if (!is.na(secondref)) { ## Sólo ataco contenido si aparece la referencia una segunda vez
                                        ## La segunda referencia puede ser múltiple y hay que partirla, p. ej.
                                        ## "184/061753, 184/061756 y 184/061757, 184/061759 a 184/061762"
                                        linsecond <- lines[secondref]
                                        if (str_count(linsecond, "[0-9]{3}/[0-9]{6}") > 1) { #Referencia múltiple
                                                lsv    <- str_split(str_replace_all(linsecond, " y ", ", "), ", ")[[1]]
                                                lsvint <- str_detect(lsv, "([[:digit:]]{3})/([[:digit:]]{6}) a ([[:digit:]]{3})/([[:digit:]]{6})")
                                                if (any(lsvint)) {
                                                        mrefs  <- expandrefs(lsv[lsvint])
                                                        lsv    <- lsv[!lsvint]                  ## Elimino las líneas con intervalo
                                                        lsv    <- sort(unique(c(lsv, mrefs)))   ## Añado la expasión y ordeno
                                                }
                                                tmp$mref <- lsv 
                                        }
                                        #[INES 17-01-2015]
                                        #ultima referencia
                                        secondrefn <- nref[nref>secondref][1]-1 #Fin del contenido: **a veces mal**
                                        if( grepl(tmp$ref, lines[nref[length(nref)-1]]) ) { secondrefn <- secondrefn + 1 }
                                        tmp$cnt    <- lines[secondref:secondrefn] #Esto puede incluir líneas que no son. Ej bol=307, ref='184/024404'
                                        ##tmp$cnt    <- tmp$cnt[tmp$cnt != ""]  ## No hace falta, se ha limpiado antes
                                        
                                        ### [INES 2015-01-15] Eliminar lineas con frases separadoras, y hasta el final
                                        v <- vector()
                                        for(ss in frsep){
                                                if(any(g <- grep(pattern = ss, tmp$cnt, ignore.case = TRUE))){
                                                        #                                                         print(ss)
                                                        v <- c(v, g)
                                                }
                                        }
                                        # Quitar ultimas líneas contenido, si es que se ha encontrado frase separadora
                                        if(length(v)>0){ tmp$cnt <- tmp$cnt[1:(min(v)-1)] }
                                        rm(v)
                                        
                                        detfecha <- str_detect(tmp$cnt, "([0-9]+) de ([a-z]+) de ([0-9]+)")
                                        if (any(detfecha)) {
                                                linesfecha <- tmp$cnt[detfecha]
                                                tmp$fecha <- try(extraer.fecha(linesfecha[length(linesfecha)]))
                                                if (any(class(tmp$fecha) == "try-error")) tmp$fecha <- NULL
                                        }
                                        if (length(tmp$cnt)>0) {
                                                tmp1 <- proc.refcontent(tmp)
                                                tmp$diputados  <- tmp1$diputados
                                                tmp$content    <- tmp1$content
                                                tmp$contentpre <- tmp1$contentpre
                                                tmp$contentpos <- tmp1$contentpos
                                                tmp$contentend <- tmp1$contentend
                                        }
                                        ##[17-01-2015] Priorizar fecha de contentend, si hay texto con fecha
                                        if(!is.null(tmp$contentend)){
                                                if(tmp$contentend != ""){
                                                        fecha2 <- try(extraer.fecha(tmp$contentend))
                                                        if (any(class(fecha2) == "try-error")) fecha2 <- NULL
                                                }
                                                if(!is.null(fecha2)) { tmp$fecha <- fecha2 }
                                        }
                                        
                                        ## Añadir procesamiento de contenido: autor, grupo parlamentario, etc.
                                        ##[INES 22-12-2014]
                                        tmpgparlcnt <- str_detect(tmp$contentpre, ignore.case("grupo[s]* parlamentario"))
                                        if (any(tmpgparlcnt)) {
                                                detgrup    <- str_detect(tmp$contentpre[tmpgparlcnt], gparlam$gparlams)
                                                tmp$grupos <- unique(c(tmp$grupos, gparlam[detgrup, "gparlamab"]))  ## guardo abreviado
                                                #                 s <- unlist(str_extract_all(tmp$ndx[tmpgparl], grupos.re))
                                                #                                     tmp$grupos <- c(tmp$grupos, gparlam[detgrup, "gparlamab"])  ## guardo abreviado
                                        }
                                        ## Buscamos comisión inmediatamente anterior en el boletín
                                        vc <- vector(mode = "numeric")
                                        vc1 <- vector(mode = "numeric")
                                        for(cc in 1:length(comisiones)){
                                                if(any(com_list[[cc]][1:secondref])){
                                                        vc1 <- which(com_list[[cc]][1:secondref] == "TRUE")
                                                }
                                                if(length(vc1)>0) { vc <- c(vc, vc1) }
                                        }        
                                        if(length(vc1)>0) { vc <- max(vc) }# Línea en lines que contiene la comisión inmediatamente anterior
                                        # Asignaremos Comisión sólo para algunos tipos.
                                        if( tmp$tipo %in% c('161','181','184') & length(vc)>0 ){
                                                tmp$comisiones <- lines[vc]
                                        }
                                        rm(vc, vc1)
                                }
                                
                                tmp$created <- as.POSIXct(Sys.time(), tz="CET")
                                lcont[[i]] <- tmp
                        }             
                }
        } else {
                tmp$bol <- bol
                tmp$special <- TRUE
                tmp$created <- as.POSIXct(Sys.time(), tz="CET")
                lcont[[1]]  <- lines    
        }
        return(lcont)
}


