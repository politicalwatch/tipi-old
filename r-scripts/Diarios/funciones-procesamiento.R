### PROCESAMIENTO Diarios de Sesiones.

proc_DS <- function(lines, num){
        #Limpieza
        lines <- lines[lines!=""]
        lp  <- grep("^Página", lines)
        ##lpp <- grep("^\\(Página", lines)
        if(length(lp)>1){ lines <- lines[-c(lp)] }
        lines <- cleanBN(lines)
        names(lines) <- NULL
        
        #Identificar lineas separadoras
        exprclave <- '^(Se reanuda|^Comienza|^Se abre) la sesión a las(.*)de la mañana' 
        
        # pr <- 'Comienza la  sesión a las nueve de la mañana.'
        # grep(exprclave, pr, ignore.case = TRUE)
        
        linorden <- grep(pattern = '^Orden.*', x = lines, ignore.case = TRUE)
        linsumario <- grep(pattern = '^Sumario.*', x = lines, ignore.case = TRUE)
        linexpr <- grep(pattern = exprclave, x = lines, ignore.case = TRUE)
        
        if(length(linorden)==0){ #Buscar directamente los números de expediente.ALBA. ¿Y SI NOS SALTAMOS TODO??
                #Líneas con número expediente
                linnumexp <- grep(pattern = '(Número de expediente [0-9]{3}\\/[0-9]{5,6})', lines)
                length(linnumexp) #expedientes a recorrer
                #aquí el bucle.
                lcont <- list()        
                for(i in 1:length(linnumexp)){#i=1
                        tmp <- list()
                        tmp$bol <- num
                        #Origen
                        tmp$origen <- "DS"
                        #
                        ini <- linnumexp[i]
                        fin <- linnumexp[length(linnumexp)] #caso del ultimo
                        if(i != length(linnumexp)){
                                fin <- linnumexp[(i+1)]-1
                        }
                        #primera linea
                        linfirst <- lines[ini]
                        tmp$titulo <- linfirst
                        #Limpiar titulo
                        tmp$titulo <- str_replace(tmp$titulo, "- ", "") ## Quito espacios duplicados
                        tmp$titulo <- str_replace(tmp$titulo, '\\(Número de expediente [0-9]{3}\\/[0-9]{5,6}\\)', "")
                        tmp$titulo <- str_replace(tmp$titulo, "\\.", "") #quitar el punto
                        tmp$titulo <- tolower(tmp$titulo)
                        tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
                        #
                        #Origen
                        tmp$origen <- "DS"
                        #Referencia
                        tmp$ref <- ""
                        if(any(str_detect(string = linfirst, pattern = '[0-9]{3}\\/[0-9]{5,6}'))){
                                tmp$ref <- str_extract(string = linfirst, pattern = '[0-9]{3}\\/[0-9]{5,6}')
                        }
                        tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
                        ## FILTRO por tipos. Si no es de los tipos a considerar pasar al siguiente.
                        if(!tmp$tipo %in% c("130", "132", "154", "155", "156", "158", "180", "181", "210", "211", "212", "213", "214")) { next }
                }
        }else{
                #Linea desde donde empezar a buscar iniciativas
                #Saltamos la linea seguida de linsumario
                lincomen <- length(lines) #si no detectamos comienzo vamos hasta el final
                
                if(any((linsumario + 1) == linexpr)) { linexpr <- linexpr[-which((linsumario + 1) == linexpr)] }
                
                #Marcamos comienzo búsqueda
                if(any(linexpr)){ lincomen <- linexpr[1] }
                if(lincomen != length(lines)){ lincomen <- lincomen + 1 }
                
                #Texto a buscar
                linbusq <- lines[lincomen:length(lines)]
                
                #Líneas con número expediente
                linnumexp <- grep(pattern = '(Número de expediente [0-9]{3}\\/[0-9]{5,6})', linbusq)
                length(linnumexp) #expedientes a recorrer
                
                lcont <- list()
                for(i in 1:length(linnumexp)){#i=1
                        ini <- linnumexp[i]
                        fin <- linnumexp[length(linnumexp)] #caso del ultimo
                        if(i != length(linnumexp)){
                                fin <- linnumexp[(i+1)]-1
                        }
                        #primera linea
                        linfirst <- linbusq[ini]
                        #Añadimos campos.
                        tmp <- list()
                        #Boletin: DECIDIR TIPO DE CODIGO. Depende del escrapeo.
                        tmp$bol <- num
                        #Origen
                        tmp$origen <- "DS"
                        
                        #Referencia: se extrae de (Número de expediente)...en la primera linea
                        tmp$ref <- ""
                        if(any(str_detect(string = linfirst, pattern = '[0-9]{3}\\/[0-9]{5,6}'))){
                                tmp$ref <- str_extract(string = linfirst, pattern = '[0-9]{3}\\/[0-9]{5,6}')
                        }
                        tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
                        ## FILTRO por tipos. Si no es de los tipos a considerar pasar al siguiente.
                        #                 if(!tmp$tipo %in% c("130", "132", "154", "155", "156", "158", "180", "181", "210", "211", "212", "213", "214")) { next }
                        if(tmp$tipo %in% noprocesarDS) { next }
                        tmp$tipotexto <- ""        
                        tipodet <- str_detect(string = tmp$tipo, pattern = as.character(tipostexto$tipo))
                        if (any(tipodet)) {
                                #cogemos el primero, el segundo corresponde con enmiendas
                                tmp$tipotexto <- as.character(tipostexto[tipodet, "textoabrev"][1])
                        } 
                        #         tmp$comisiones <- ##PENDIENTE DE COGER DEL ESCRAPEO
                        tmp$titulo <- linfirst
                        #Limpiar titulo
                        tmp$titulo <- str_replace(tmp$titulo, "- ", "") ## Quito espacios duplicados
                        tmp$titulo <- str_replace(tmp$titulo, '\\(Número de expediente [0-9]{3}\\/[0-9]{5,6}.*\\)', "")
                        tmp$titulo <- str_replace(tmp$titulo, "\\.", "") #quitar el punto
                        #                 tmp$titulo <- tolower(tmp$titulo)
                        tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
                        #
                        # Extraer Grupos parlamentarios.
                        #Buscamos en el titulo
                        tmpgparl <- str_detect(tmp$titulo, ignore.case("grupo[s]? parlamentario"))
                        if (any(tmpgparl)) {
                                detgrup    <- str_detect(tmp$titulo[tmpgparl][1], gparlam$gparlams)
                                if(any(detgrup)){
                                        tmp$grupos <- gparlam[detgrup, "gparlamab"] ## guardo abreviado  
                                }
                        }
                        #Buscamos los diputados
                        tmpdip <- str_detect(tmp$titulo, ignore.case("diputado|diputada"))
                        if(any(tmpdip)){#hay diputado, lo buscamos
                                if (length(tmp$titulo)>0) {
                                        dipdet <- str_detect(tmp$titulo, diputados$nomapre)
                                        if (any(dipdet)) {
                                                ##cat("\n", pres[i], "\n *", paste(diputados[dipdet, "apnom"], collapse=";"), "\n")
                                                tmp$diputados <- diputados[dipdet, "apnom"]
                                        } 
                                }
                        }
                        #Contenido
                        tmp$content <- ""
                        if(fin>(ini+1)){ tmp$content <- linbusq[(ini+1):fin] }  
                }
                
                lcont[[i]] <- tmp
                
        }
        #Eliminar elementos nulos
        lcont <- lcont[!sapply(lcont, is.null)]
        return(lcont)
}



