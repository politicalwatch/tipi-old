## Funciones auxiliares para test-proc.R, el nuevo procesador de boletines
options(stringsAsFactors=FALSE)

#+++++++++++++++++++++++++++++++++#
#     SEPARACIÓN DE CONTENIDOS    #
#+++++++++++++++++++++++++++++++++#
## Cadenas para detectar partes de las iniciativas
iniendings <- c("Dada en Madrid", "Palacio del Congreso", "Madrid,")
inivacias  <- c("La Mesa del Congreso de los Diputados",
                "Exposición de motivos", #añadida INES 19-01-2015
                #"TRIBUNAL CONSTITUCIONAL",
                #"COMPETENCIAS EN RELACIÓN CON OTROS ÓRGANOS E INSTITUCIONES",
                #"SECRETARÍA GENERAL",
                #"INICIATIVA LEGISLATIVA POPULAR",
                #"OTROS TEXTOS",
                "\\(184\\) Pregunta escrita Congreso",
                "La mesa de la cámara",
                "http://www\\.congreso\\.es Calle Floridablanca",
                "D\\. L\\.:.*CONGRESO DE LOS DIPUTADOS"
)
## cambio referencia: guardar número antiguo, número nuevo y publicación
inicambioref <- "Núm. expte.:"
fincambioref <- "Nuevo número asignado a la iniciativa tras la conversión:"
public       <- "Publicación:"

## Frases que indican secciones: (VER SI ES NECESARIO)
secciones <- c("^PREGUNTAS PARA RESPUESTA ESCRITA$",
               "^PREGUNTAS PARA RESPUESTA ESCRITA RTVE$")

## Frases separadoras enmiendas tipos 161, 162
frsepenmi <- c("^A la Mesa de la Comisión",
               "^A la Mesa de la Comisiones")

## Frases de separación de contenidos
frsep <- c(#"^ÍNDICE$", #ver bol=310, ref=005/000000
        "^COMPOSICIÓN Y ORGANIZACIÓN DE LA CÁMARA$",
        "^PERSONAL$",
        "^PROPOSICIONES NO DE LEY$",
        "^Pleno$",
        "^Control de la acción del Gobierno$",
        "^PREGUNTAS PARA RESPUESTA ESCRITA$",
        "^PREGUNTAS PARA RESPUESTA ORAL$",
        "^Preguntas$",
        "^Control Parlamentario de la Corporación RTVE y sus Sociedades$",
        "^CORPORACIÓN RTVE Y SUS SOCIEDADES$",
        "^Contestaciones$",
        "^PREGUNTAS PARA RESPUESTA ESCRITA RTVE$",
        "^TRIBUNAL CONSTITUCIONAL$",
        "^COMPETENCIAS EN RELACIÓN CON OTROS ÓRGANOS E INSTITUCIONES$",
        "^SECRETARÍA GENERAL$",
        "^INICIATIVA LEGISLATIVA POPULAR$",
        "^CONSEJO GENERAL DEL PODER JUDICIAL$",
        "^OTROS TEXTOS$",
        "^RELACIÓN DE PREGUNTAS$",
        "^INTERPELACIONES$",
        "^MOCIONES CONSECUENCIA DE INTERPELACIONES$",
        "^Urgentes$",
        "^DIPUTACIÓN PERMANENTE$",
        "^DIPUTADOS$",
        "^JUNTA DE PORTAVOCES$",
        "^PLANES Y PROGRAMAS$",
        comisiones #dado que también funcionan como separadoras
)

#+++++++++++++++++++++++++++++++++#
#     FUNCIONES AUXILIARES        #
#+++++++++++++++++++++++++++++++++#
## x: cadena del tipo "apellidos, nombre"
## devuelve una expresión regular "nombre.*apellidos", donde sólo queda el 
## primer nombre si tiene nombre compuesto
apn2nap <- function(x) {
        xs    <- strsplit(x, ", ")[[1]]     ## c(apellidos, nombre)
        nom1  <- strsplit(xs[2], " ")[[1]][1]  ## c(nombre1)
        nomap <- paste0(nom1, ".*", xs[1])  ## nombre1.*apellidos
        return(nomap)
}

## Parámetros:
# linesdfi: lista que contiene ya algunos elementos del indice: bol, bolnum, ref, texto...
# reficont: líneas de 'lines' que contienen el contenido de la iniciativa. 
#           Previamente, si no se han podido delimitar, 'reficont' vale '9999'.
## Devuelve: linesdfi con campos adicionales referentes al contenido

proc.refcontent <- function(lc){
        ## lc: lista con proceso del índice y esas cosas, se puede consultar tipo, etc.
        #Inicializar campos, por si no se calculan bien.
        lc$contentpre <- ""
        lc$contentpost <- ""
        lc$content <- lc$cnt[-1]   ## Iremos limpiando a partir de aquí, quitamos la referencia
        
        #   # Campo: Primer parrafo
        #   lc$contentpre <- lc$content[2]  #segunda línea tras limpiar ref
        # Líneas vacías, ver inivacias
        for (i in 1:length(inivacias)) {
                lc$content <- lc$content[!str_detect(lc$content, ignore.case(inivacias[i]))]
        }
        if(any(grepl("^Autor: ", lc$content))){
                lc$content <- lc$content[!str_detect(lc$content, "^Autor: ")]
        }
        # Campo: Primer parrafo. CAMBIO DE SITIO Y DE INDICE (2-->1)
        lc$contentpre <- lc$content[1]  #segunda línea tras limpiar ref
        lc$contentpre <- lc$contentpre[!is.na(lc$contentpre)]
        ## Busco diputados en contentpre
        # Si ya están no los asigno.
        if (length(lc$contentpre)>0 & is.null(lc$diputados)) { #Controla que no se machaca Diputado si ya existe.
                dipdet <- str_detect(lc$contentpre, diputados$nomapre)
                if (any(dipdet)) {
                        ##cat("\n", pres[i], "\n *", paste(diputados[dipdet, "apnom"], collapse=";"), "\n")
                        lc$diputados <- diputados[dipdet, "apnom"]
                } 
        }
        # Campo: Ultima línea si encontramos un finalizador
        enddet <- c()
        for (i in 1:length(iniendings)) {
                enddet1 <- str_detect(lc$content, paste0("^", iniendings[i]))
                enddet <- cbind(enddet, enddet1)
        }
        enddet <- apply(enddet, 1, any)
        lencon <- length(lc$content)
        endlin <- lencon
        if (any(enddet)) {
                endlin <- max((1:length(lc$content))[enddet])
                lc$contentend <- lc$content[enddet]
                lc$contentend <- lc$contentend[length(lc$contentend)]
                if (lencon>endlin) lc$contentpos <- lc$content[(endlin+1):lencon]
                lc$content <- lc$content[2:(endlin-1)]
        }
        return(lc)
}

## Extraer fecha de las cadenas finales de los contenidos
## x es una cadena que contiene una fecha en formato dd de mes de aaaa
extraer.fecha <- function(x) {
        # x frase que contiene la fecha, expresion '1-31 de Mes de Año'
        meses <- c("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre",
                   "noviembre", "diciembre")
        x     <- tolower(x)
        match <- str_match(x, "([0-9]+) de ([a-z]+) de ([0-9]+)")
        #[INES 21-01-2015] Control de casos erroneos
        # en casos como bol=122, ref="184/007587" el formato es erroneo. Devolvemos fecha vacía.
        ## "Palacio del Congreso de los Diputados, junio de 2012.-Alfred Bosch i Pascual, Diputado."
        if(any(is.na(match))) { 
                #intentamos hallar solo 'julio de 2012'
                match <- str_match(x, "([a-z]+) de ([0-9]+)")
                # si seguimos sin encontrarlo devolvemos fecha vacia.
                if(any(is.na(match))){ 
                        return("") 
                } else { #devolvemos el dia 15 del mes
                        dd    <- 15
                        if(!any(mm <- grep(match[1, 2], meses))) { mm <-  agrep(match[1, 2], meses) }
                        aaaa  <- as.integer(match[1, 3])
                }
        } else {
                dd    <- as.integer(match[1, 2])
                #[INES 15-01-2015] primero buscamos exacto; si no encuentra, empleamos fuzzy matching
                if(!any(mm <- grep(match[1, 3], meses))) { mm <-  agrep(match[1, 3], meses) }
                #mm    <- agrep(match[1, 3], meses) ## fuzzy matching para esquivar algún error tipográfico
                aaaa  <- as.integer(match[1, 4])
        }
        return(as.POSIXct(paste(aaaa, mm, dd, sep="-"), tz="CET"))
}


## Expandir series de referencias del tipo "184/061759 a 184/061762"
expandrefs <- function(mrefs) {
        result <- c()
        for (i in 1:length(mrefs)) {
                mexpand <- str_match(mrefs[i], "([[:digit:]]{3})/([[:digit:]]{6}) a ([[:digit:]]{3})/([[:digit:]]{6})")
                tipo <- mexpand[1, 2]
                a <- as.integer(mexpand[1, 3])
                b <- as.integer(mexpand[1, 5])
                result <- c(result, paste0(tipo, "/", sprintf("%06d", seq(a,b))) )
        }
        return(result)
}

## endings.table devuelve una tabla con los finales de los contenidos para verificar que siempre terminan
## con frases tipo. Si no es así, habría que depurar.
## lc es una lista preprocesada con el campo cnt (aunque puede no estar en algunos)
endings.table <- function(lc) {
        endings <- lapply(lc, 
                          function(x) {
                                  ssplit <- str_split(x$cnt[length(x$cnt)], " ")   ## Última línea partida en espacios
                                  if (length(ssplit) > 0) last <- ssplit[[1]][1]   ## Primera palabra de la última línea
                                  else last <- NULL                                ## o nula si no hay contenido
                                  return(last)
                          })
        return(table(unlist(endings)))
}

## sample.size
sample.size <- function(N, P=0.5, em=0.05, alpha=0.05) {
        lambda <- qnorm(1-(alpha/2))
        l2p1p  <- (lambda^2)*P*(1-P) 
        n <- (l2p1p*N)/( (N-1)*em^2 + l2p1p )
        return(n)
}
## sample.ini devuelve una muestra de iniciativas procesasas, para chequear
sample.iniciativas <- function(lc, n=10) {
        N <- length(lc)
        if (n==0) n <- sample.size(N)
        ## Muestreo
        if (N>n) return(lc[sample.int(N, n)]) else return(lc)
}

### Limpieza de blancos en cadenas
cleanBN <- function(x) { return( gsub(" +", " ", gsub("[[:cntrl:]]", "", x)) )}

#++++++++++++++++++++++++++++++++++#
#     FUNCIONES PRINCIPALES        #
#++++++++++++++++++++++++++++++++++#
###---- Procesamiento de un boletin concreto ---###
# Dado un número de boletin cargamos objeto lines con las líneas del documento
# y se lo pasamos a la funcion
## Parámetros:
# lines: texto del boletin organizado porlineas
# num: código de boletin

proc_boletin <- function(lines, num){
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
        
        #Almacenar localizacion de frases separadoras
        separa_list <- list()
        # generamos una lista que contiene vectores lógicos T/F para cada separador
        for(s in frsep){
                separa_list[[s]] <- str_detect(string = lines, pattern = ignore.case(s))
        }
        #Almacenar localizacion de secciones (NO NECESARIO: VALORAR.)
        sec_list <- list()
        # generamos una lista que contiene vectores lógicos T/F para cada sección
        for(ss in secciones){
                sec_list[[ss]] <- str_detect(string = lines, pattern = ignore.case(ss))
        }
        #Almacenar secciones y referencias dentro de cada una
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
        #
        #Lo mismo con las Comisiones.
        com_list <- list() # lista que almacenará posiciones de cada comisión
        for(cc in comisiones){
                com_list[[cc]] <- str_detect(string = lines, pattern = ignore.case(cc))
        }
        #
        ## Vamos añadiendo a una lista, por un lado las líneas de índice y por otro contenido
        #
        lcont <- list()
        count <- 0
        nref <- c(nref, cntend)
        if (length(nref)>1) {    
                for (i in 1:(length(nref)-1)) { ## nref contiene las líneas donde hay una referencia, el problema es si no aparecen referencias
                        #                                 browser()
                        count <- count + 1    ## para ir guardando en la lista
                        if (!is.na(ndxend) & nref[i] <= ndxend) {
                                tmp <- list()
                                tmp$bol  <- sprintf("%03d", as.numeric(num))
                                #Origen
                                tmp$origen <- "serieD"
                                tmp$ref  <- str_extract(lines[nref[i]], "^[0-9]{3}\\/[0-9]{5,6}")
                                tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
                                if(tmp$tipo %in% noprocesar){ 
                                        break 
                                }else
                                tmp$tipotexto <- ""        
                                tipodet <- str_detect(string = tmp$tipo, pattern = as.character(tipostexto$tipo))
                                if (any(tipodet)) {
                                        #cogemos el primero, el segundo corresponde con enmiendas
                                        tmp$tipotexto <- as.character(tipostexto[tipodet, "textoabrev"][1])
                                } 
                                #indice.        
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
                                ## Antes se buscaba el autor a lo bestia. ahora distinguimos siempre grupos/diputados
#                                 tmpaut <- str_detect(tmp$ndx, "Autor:")
#                                 if (any(tmpaut)){
#                                         tmp$autor <- str_trim(str_match(tmp$ndx[tmpaut], "Autor:(.*)")[, 2])
#                                         tmp$ndx <- tmp$ndx[!tmpaut]
#                                 }
                                #Búsqueda de Grupo Parlamentario.
                                #Por defecto pondremos "otro" si se trata de Enmiendas (161, 162, 173, 043)
                                #Para poder tratar casos donde no se asigna el Grupo.
#                                 if(tmp$tipo %in% c("161", "162", "173", "043")){
#                                         tmp$grupos <- "Sin Determinar"
#                                 }
                                #Si se caza el Grupo, lo sobreescribimos.
                                if(length(tmp$ndx)>0){
                                        detgrupo <- str_detect(tmp$ndx, '[Gg]rupo(s)? [Pp]arlamentario(s)?')
                                        if(any(detgrupo)){
                                                lingrupo <- tmp$ndx[detgrupo] #por si hay mas de una linea en indice.
                                                gpdet <- str_detect(string = lingrupo[1], pattern = as.character(gparlam$gparlams))
                                                if(any(gpdet)){
                                                        tmp$grupos <- unique(gparlam[gpdet, "gparlamab"])
                                                }
                                        }
                                }
                                #Búsqueda de Diputados. 
                                #Al contrario que Grupo, Diputado no existe por defecto.
                                #TODO. verificar si en algun caso el Diputado aparece en el índice.
                                if(length(tmp$ndx)>0){
                                        detdiputado <- str_detect(tmp$ndx, ignore.case("Diputado|Diputados|Diputada|Diputadas"))
                                        if(any(detdiputado)){
                                                lindiputado <- tmp$ndx[detdiputado]
                                                dipdet <- str_detect(lindiputado[1], pattern = as.character(diputados$nomapre))
                                                if(any(dipdet)){
                                                        tmp$diputados <- unique(diputados[dipdet, "apnom"])
                                                }
                                        }
                                }
                        }
#                         #Buscamos grupo en la primera linea del titulo.
#                         tmpgparl <- str_detect(tmp$ndx, ignore.case("grupo[s]? parlamentario"))
#                         if (any(tmpgparl)) {
#                                 detgrup    <- str_detect(tmp$ndx[tmpgparl][1], gparlam$gparlams)
#                                 if(any(detgrup)){
#                                         tmp$grupos <- gparlam[detgrup, "gparlamab"] ## guardo abreviado  
#                                 }
#                         }
                        ## El título son las líneas que quedan en el índice excepto la última si
                        ## hay más de una, pero es distinto para las 184 que para el resto
                        tmp$titulo <- ""  #por si no se caza
                        tmp$titulo <- tmp$ndx[1]
                        tmp$titulo <- str_replace_all(tmp$titulo, " +", " ") ## Quito espacios duplicados
                        tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
                        
                        ## Autor en el título: Respuestas a preguntas orales (184)
                        ##Preguntas: 184.
                        if(tmp$tipo == "184"){
                                #Reasignamos la segunda línea del índice, si es que la hay.
                                if(length(tmp$ndx)>1){
                                        tmp$titulo <- tmp$ndx[2]
                                }
                                #Buscamos autor en la primera linea del indice.
                                if(length(tmp$ndx[1])>0){
                                        ## Si es Gobierno:
                                        if(str_detect(string = tmp$ndx[1], pattern = "^Autor: Gobierno")){
                                        tmp$autor <- "Gobierno"}
                                        ## Resto de diputados.
                                        lindiputado <- tmp$ndx[1]
                                        if(str_detect(string = lindiputado, pattern = "^Autor")){
                                                #eliminamos 'Autor' y buscamos
                                                lindiputado <- str_replace(string = lindiputado, pattern = "Autor", replacement = "")
                                                lindiputado <- str_replace(string=lindiputado, pattern = ':', replacement = "")
                                                lindiputado <- str_trim(string = lindiputado)
                                                dipdet <- str_detect(lindiputado, pattern = as.character(diputados$apnom))
                                                if(any(dipdet)){
                                                        tmp$diputados <- unique(diputados[dipdet, "apnom"])
                                                }
                                        }
                                }
                        }
                        
                        ## Trámite: Del titulo para tipos 161, 162 (proyectos no de ley)
                        if(tmp$tipo %in% c("161", "162")){
                                if(any(dettram <- str_detect(tmp$titulo, pattern=tramitesDPNL))){
                                        tmp$tramite <- tramitesDPNL[dettram][1]
                                }
                        }
                        ## Lugar 'Pleno' para las referencias tipo 162.
                        if(tmp$tipo == "162"){
                                tmp$lugar = "Pleno"
                        }
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
                                #ultima referencia
                                secondrefn <- nref[nref>secondref][1]-1 #Fin del contenido: **a veces mal**
                                if( grepl(tmp$ref, lines[nref[length(nref)-1]]) ) { secondrefn <- secondrefn + 1 }
                                tmp$cnt    <- lines[secondref:secondrefn] #Esto puede incluir líneas que no son. Ej bol=307, ref='184/024404'
                                
                                #Eliminar lineas con frases separadoras, y hasta el final
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
                                        #Nota. Función controla que si diputado ya existe no se machaca
                                        tmp$diputados  <- tmp1$diputados
                                        tmp$content    <- tmp1$content
                                        tmp$contentpre <- tmp1$contentpre
                                        tmp$contentpos <- tmp1$contentpos
                                        tmp$contentend <- tmp1$contentend
                                }
                                # Priorizar fecha de contentend, si hay texto con fecha
                                if(!is.null(tmp$contentend)){
                                        if(tmp$contentend != ""){
                                                fecha2 <- try(extraer.fecha(tmp$contentend))
                                                if (any(class(fecha2) == "try-error")) fecha2 <- NULL
                                        }
                                        if(!is.null(fecha2)) { tmp$fecha <- fecha2 }
                                }
                                
                                ## Buscamos Grupo parlamentario en contentpre, si aún no existe.
                                if(is.null(tmp$grupos)){ #Buscamos en contentpre si aún no existe.
                                        tmpgparlcnt <- str_detect(tmp$contentpre, ignore.case("grupo[s]* parlamentario"))
                                        if (any(tmpgparlcnt)) {
                                                detgrup    <- str_detect(tmp$contentpre[tmpgparlcnt], gparlam$gparlams)
                                                tmp$grupos <- unique(c(tmp$grupos, gparlam[detgrup, "gparlamab"]))  ## guardo abreviado
                                                #                 s <- unlist(str_extract_all(tmp$ndx[tmpgparl], grupos.re))
                                                #                                     tmp$grupos <- c(tmp$grupos, gparlam[detgrup, "gparlamab"])  ## guardo abreviado
                                        }
                                }
                                ## Buscamos Comisión inmediatamente anterior en el boletín
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
                                        tmp$lugar <- lines[vc]
                                }
                                rm(vc, vc1)
                        }
                        #Añadir fecha de creación
#                         tmp$created <- as.POSIXct(Sys.time(), tz="CET")
                        #Boletines con enmiendas: Varios documentos por referencia.
                        lenmiendas <- list()
                        if(tmp$tipo %in% c('161', '162', '173', '043')){
                                #Ejemplos 173: bol=163, ref=173/000045
                                if(any(str_detect(string = tmp$content, pattern = "^Enmienda"))){ 
                                        if(tmp$tipo %in% c('161', '162')){
                                                tmp$tramite <- "Enmiendas a Proposición no de Ley"
                                        }
                                        if(tmp$tipo %in% c('173')){
                                                tmp$tramite <- "Enmiendas a Moción"
                                        }
                                        if(tmp$tipo %in% c('043')){
                                                tmp$tramite <- "Enmiendas a Planes, programas y dictámenes/Propuestas de resolución"
                                        }
                                        lenmiendas <- proc_serieD_enmiendas(tmp)
                                        #CAMBIO UNIR ENMIENDAS AQUI.
                                        lenmiendas <- unirEnmiendas(lcont = lenmiendas)
                                }
                                #añadimos a tmp campos adicionales enmineda 
                                #sobreescribimos también algunos de los campos
                                #alimentamos lcont tantas veces como numenmienda.
                                #adaptando el indice i para tal efecto.
                        }
                        #añadir, si hay, las enmiendas como elementos adicionales
                        numenmi <- length(lenmiendas) #docs adicionales por añadir: 0 si no hay Enmiendas.
                        l <- length(lcont) #para ver por dònde vamos
                        if(numenmi == 0){ lcont[[(l+1)]] <- tmp }
                        if(numenmi > 0){
                                for(p in 1:numenmi){
                                        lcont[[(l+p)]] <- lenmiendas[[p]]
                                }
                        }
                }             
        } else {
                lcont$bol <- sprintf("%03d", as.numeric(num))
                lcont$special <- TRUE
                lcont$created <- as.POSIXct(Sys.time(), tz="CET")
                lcont[[1]]  <- lines    
        }
        return(lcont)
}


#afecta solo tipos 161, 162
#TODO. A incluir tambien: 173 (Mociones), 043 (Dictámenes)
#Parámetros: lista tmp, a separar por enmiendas
#Devuelve: lista de documentos tmpenmi a enviar a Mongo, a añadir a lcont.
proc_serieD_enmiendas <- function(tmp){
        
        content <- c(tmp$content, tmp$contentend) #para cazar el último 'Palacio de...'
        
        # Inicializar listado que contendrá enmiendas, y con el que ampliaremos lcont
        lenmiendas <- list()
        
        # Contenido vacío, nos salimos
        if(length(content)==1){ break() }
        
        # NO hay enmiendas, devolvemos lo que teníamos tmp
        if(!any(detenmi <- str_detect(string=content, pattern="^Enmienda"))){#no hay enmiendas
                enmiendas <- tmp #devuelve lo que teníamos
        }
        
        # Caso normal, hay enmiendas.
        linenmi<- c(1:length(content))[detenmi] #id de lineas de content con enmiendas
        numenmi <- length(linenmi)
        
        # Separacion de enmiendas: frases separadoras
        detsepenmi <- vector()
        for(c in 1:length(content)){#c=1
                if(any(str_detect(string=content[c], pattern=frsepenmi))) detsepenmi <- c(detsepenmi, c)
        }        
        #Si no hay tales frases separadaras las separamos con 'Enmienda'
        if(length(detsepenmi)==0){ #no se separan por 'A la Mesa de...'
                for(c in 1:length(content)){#c=1
                        if(any(str_detect(string=content[c], pattern='^Enmienda'))) detsepenmi <- c(detsepenmi, c)
                }
        }
        linsepenmi <- c(1:length(content))[detsepenmi]
        
        #lineas finalizadoras: 'Palacio del Congreso...'
        detendings <- str_detect(string=content, pattern = '^[Pp]alacio del [Cc]ongreso ')
        linendings <- c(1:length(content))[detendings]
        
        # ahora recorremos estas lineas linsepenmi, marcan comienzo y final de las enmiendas
        for(k in 1:length(linsepenmi)){#k=1
                
                # Inicializar lista a devolver
                tmpenmi <- tmp
                
                #número de enmienda
                tmpenmi$numenmienda <- k
                
                enmipre <- content[linsepenmi[k]+1]
                
                #                 if(k != length(linsepenmi)){
                #                         enmifin <- linsepenmi[k+1]
                #                 }else{ enmifin <- length(content) }
                
                #siguiente linea con 'Palacio...'
                enmifin <- linendings[which(linendings > linsepenmi[k])][1]
                
                #contentpre de la enmienda
                if(k != length(linsepenmi)){
                        enmiend <- content[enmifin]
                }else{ enmiend <- content[length(content)] }
                tmpenmi$contentend <- enmiend
                #extraer diputados de enmiend (el 'contentend' de la enmienda)
                #                 dipdet <- str_detect(enmiend, ignore.case(diputados$nomapre))
                #                 if (any(dipdet)) {
                #                         tmpenmi$diputados <- diputados[dipdet, "apnom"]
                #                 } 
                # browser()
                if (enmiend != "") {
                        dipdet <- str_detect(enmiend, diputados$nomapre)
                        #                         if (!is.na(dipdet) & any(dipdet)) {
                        #                                 ##cat("\n", pres[i], "\n *", paste(diputados[dipdet, "apnom"], collapse=";"), "\n")
                        #                                 tmpenmi$diputados <- diputados[dipdet, "apnom"]
                        #                         } 
                        if(!is.null(dipdet)){
                                if(any(dipdet)) {  tmpenmi$diputados <- diputados[dipdet, "apnom"] }
                        }
                }
                #extraer grupos parlamentarios.
                gparldet <- str_detect(enmiend, gparlam$gparlams)
                if(any(gparldet)) {
                        tmpenmi$grupos <- unique(gparlam[gparldet, "gparlamab"])
                }
                #extraer texto de la enmienda: sobreescribimos content.
                #desde 'Enmienda' hasta el fin.
                tmpenmi$content <- ""
                if(length(linenmi)==length(linsepenmi)){
                        tmpenmi$content <- content[(linsepenmi[k]+2):(enmifin-1)]
                }
                #extraer fecha de la enmienda
                resulfec <- try(extraer.fecha(x = enmiend)) 
                if(any(class(resulfec) %in% c("POSIXct","POSIXt"))){ tmpenmi$fecha <- resulfec }
                
                #fecha de creacion
                tmpenmi$created <- as.POSIXct(Sys.time(), tz="CET")
                
                lenmiendas[[k]] <- tmpenmi
        }
        return(lenmiendas)
}




