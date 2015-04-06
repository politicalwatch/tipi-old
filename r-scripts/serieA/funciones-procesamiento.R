#++++++++++++++++++++++++++++++#
# Funciones propias y listados #
#++++++++++++++++++++++++++++++#

## Funciones auxiliares para test-proc.R, el nuevo procesador de boletines
options(stringsAsFactors=FALSE)

#++++++++++++++++++++++++#
# Cargar info de MongoDB #
#++++++++++++++++++++++++#

## función auxiliar para cargar diputados
## x: cadena del tipo "apellidos, nombre"
## devuelve una expresión regular "nombre.*apellidos", donde sólo queda el 
## primer nombre si tiene nombre compuesto
apn2nap <- function(x) {
        xs    <- strsplit(x, ", ")[[1]]     ## c(apellidos, nombre)
        nom1  <- strsplit(xs[2], " ")[[1]][1]  ## c(nombre1)
        nomap <- paste0(nom1, ".*", xs[1])  ## nombre1.*apellidos
        return(nomap)
}

#####
## Cargar lista actualizada de diputados

### Dado que la conexión a MongoDB ha fallado, guardamos df diputados en local
# y la cargamos cada vez que queramos probar
# save(diputados, file="diputados-mongo.rd")
load("diputados-mongo.rd")

# mg <- mongo.create(host="grserrano.net")
# # diputados
# diputadosan <- mongo.get.values(mg, "pdfs.diputados", "nombrecomp")
# mongo.disconnect(mg)
# ## Se construye la tabla para buscar diputados
# diputados <- data.frame(apnom=diputadosan, nomapre=sapply(diputadosan, apn2nap))
# rownames(diputados) <- NULL
# if (any(duplicated(diputados$diputadosnc))) stop("Cadenas no únicas en diputadosnc")


#+++++++++++++++++++++++++++++++#
#  Funciones propias - Serie A  #
#+++++++++++++++++++++++++++++++#

## Procesamiento serie A, todos los trámites excepto enmiendas
## argumentos: lines que se carga con load(fichero .rd que contiene boletin)
##             codigo: A-X-X que identifica el boletin
##             tramite: un elemento de la lista tramitesA
## devuelve: lista tmp() con los campos procesados:
# [1] "bol"     "ref"     "tipo"    "tramite" "titulo"  "content"     "fecha"   "contentpre" 
proc_serieA <- function(lines, codigo, tramite){
        #limpiar lines
        lines <- lines[lines!=""]
        lp  <- grep("^Página", lines)
        ##lpp <- grep("^\\(Página", lines)
        if(length(lp)>1){ lines <- lines[-c(lp)] }
        lines <- cleanBN(lines)
        names(lines) <- NULL
        
        ## T/F si la línea empieza por una referencia
        iref <- str_detect(lines, "^[0-9]{3}\\/[0-9]{5,6}")
        # if (!any(iref)) next ## para el superbucle
        nref <- c(1:length(lines))[iref]
        ## La  referencia
        ref <- str_extract(lines[iref][1], "^[0-9]{3}\\/[0-9]{5,6}")
        
        ## Busco las líneas donde aparece, la segunda será el inicio del contenido
        reflin <- grep(paste0("^", ref), lines)
        
        ## Separar indice y contenido.
        ndxini <- reflin[1]
        if(length(reflin) < 2){ #no hay indice
                ndxend <- cntini <- reflin + 1
        }else{
                ndxend <- reflin[2]-1
                cntini <- reflin[2]  
        }
        cntend <- length(lines)
        
        # si viene frase 'Palacio de congresos..' tras el indice extendemos ndxend hasta ese punto
        if(any(e <- str_detect(pattern = '^Palacio del Congreso', lines))){
                ndxend <- which(e == TRUE)[1] #el primer match-->corresponde al fin del indice
        }
        
        # lcont <- list() #no es necesario pues solo tenemos 1 referencia
        tmp <- list()
        ## A1-1 o algo asi...
        tmp$bol <- codigo
        #Origen
        tmp$origen <- "serieA"
        #Algunos casos en que no hay una referencia todo el texto junto. Ej A-15-5
        #y salir del bucle
        if(!any(iref)){ 
                #                 tmp$tramite <- tolower(lines[1])
                tmp$content <- lines[2:length(lines)]  
                return(tmp)
                break() 
        }
        tmp$ref  <- str_extract(lines[reflin[1]], "^[0-9]{3}\\/[0-9]{5,6}")
        tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
        tmp$tipotexto <- ""        
        tipodet <- str_detect(string = tmp$tipo, pattern = as.character(tipostexto$tipo))
        if (any(tipodet)) {
                #cogemos el primero, el segundo corresponde con enmiendas
                tmp$tipotexto <- tipostexto[tipodet, "textoabrev"][1]
        } 
        #tramite
        tmp$tramite <- tramite
        
        #lineas del indice
        # ndx  <-  lines[reflin[1]:(reflin[2]-1)] 
        ndx <- lines[ndxini:ndxend]
        ndx <- str_replace_all(ndx, "^[0-9]{3}\\/[0-9]{5,6}", "")
        ndx <- str_trim(ndx)
        
        #titulo
        tmp$titulo <- ndx[1]
        tmp$titulo <- str_replace_all(tmp$titulo, " +", " ") ## Quito espacios duplicados
        tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
        
        #autor. Si es 'proyecto de ley' es el Gobierno; si no, se deja vacio.
        #en función de la primera linea del documento.
        tmp$autor <- ""
        if(tramite == tramitesA[1]){ tmp$autor <- "Gobierno" }
        
        #lineas del contenido: seguido de indice
        # excepto si hay alguna linea que comienza en 'Informe'; entonces vamos hasta allí
        if(any(e <- str_detect(string = lines, pattern = ignore.case('^Informe')))){
                if(!is.na((1:length(lines))[e][2])){
                        if( ((c <- (1:length(lines))[e][2]) != length(lines)))
                                cntini <- c #el primer match-->corresponde al fin del indice
                }
        }
        tmp$content <- lines[cntini:cntend] #seguido de indice/comienzo del informe
        tmp$content <- str_replace_all(tmp$content, "^[0-9]{3}\\/[0-9]{5,6}", "")
        tmp$content <- str_trim(tmp$content)
        tmp$content <- tmp$content[tmp$content != ""]
        tmp$content <- str_replace_all(tmp$content, '\\"', "")
        
        # Campo fecha: se saca del indice
        detfecha <- str_detect(ndx, "([0-9]+) de ([a-z]+) de ([0-9]+)")
        if (any(detfecha)) {
                linesfecha <- ndx[detfecha]
                tmp$fecha <- try(extraer.fecha(linesfecha[length(linesfecha)]))
                if (any(class(tmp$fecha) == "try-error")) tmp$fecha <- NULL
        }
        # contentpre
        ## contenido entre indice y el Informe, si lo hay
        tmp$contentpre = ""
        if(ndxend < cntini){ tmp$contentpre <- lines[(ndxend+1):(cntini-1)] }
        
        ## Búsqueda de comisiones/comisión en contentpre
        detcomis <- str_detect(string = tmp$contentpre, pattern = ignore.case('^A la comisi[óo]n'))
        if(any(detcomis)){
                linescomis <- tmp$contentpre[detcomis]
                tmp$comision <- try(extraer.comision(linescomis))
                if (any(class(tmp$comision) == "try-error")) tmp$comision <- NULL
        }
        return(tmp)
}


## Procesamiento serie A, trámite excepto enmiendas
## argumentos: lines que se carga con load(fichero .rd que contiene boletin)
##             codigo: A-X-X que identifica el boletin
##             tramite: un elemento de la lista tramitesA
## devuelve: lista tmp() con los campos procesados:
# [1] "bol"     "ref"     "tipo"    "tramite" "titulo"  "cnt"     "fecha"   "contentpre" 
proc_serieA_enmiendas <- function(lines, codigo, tramite){
        ##### Procesamiento trámite 'Enmiendas'
        lines <- lines[lines!=""]
        lp  <- grep("^Página", lines)
        ##lpp <- grep("^\\(Página", lines)
        if(length(lp)>1){ lines <- lines[-c(lp)] }
        lines <- cleanBN(lines)
        names(lines) <- NULL
        
        ## T/F si la línea empieza por una referencia
        iref <- str_detect(lines, "^[0-9]{3}\\/[0-9]{5,6}")
        nref <- c(1:length(lines))[iref]
        ## La  referencia
        ref <- str_extract(lines[iref][1], "^[0-9]{3}\\/[0-9]{5,6}")
        ## Busco las líneas donde aparece, la segunda será el inicio del contenido
        reflin <- grep(paste0("^", ref), lines)
        
        ## T/F si la linea empieza por 'Enmienda'
        ienmi <- str_detect(lines, "^ENMIENDA N[ÚU]M")
        nenmi <- c(1:length(lines))[ienmi]
        
        # delimitar indice
        ndxini <- reflin[1]
        ndxend <- length(lines) #hasta el final, si no hay enmiendas
        if(any(ienmi)) { ndxend <- nenmi[1]-1 } #ultima antes de comenzar primera enmienda
        # extraer lineas del indice
        ndx <- lines[ndxini:ndxend] 
        ndx <- str_replace_all(ndx, "^[0-9]{3}\\/[0-9]{5,6}", "")
        ndx <- str_trim(ndx)
        
        ## Campos comunes para todas las enmiendas
        tmp <- list()
        ## A1-1 o algo asi...
        #codigo='A-1-1'
        ###para emnmienda=1
        tmp$bol <- codigo
        #Origen
        tmp$origen <- "serieA"
        #Algunos casos en que no hay una referencia todo el texto junto. Ej A-15-5
        #y salir del bucle
        if(!any(iref)){ 
                #           tmp$tramite <- tolower(lines[1])
                tmp$content <- lines[2:length(lines)]  
                return(tmp)
                break() 
        }
        tmp$ref  <- str_extract(lines[reflin[1]], "^[0-9]{3}\\/[0-9]{5,6}")
        tmp$tipo <- str_split(tmp$ref, "/")[[1]][1]
        #Tipo en formato texto
        tmp$tipotexto <- ""
        
        tipodet <- str_detect(string = tmp$tipo, pattern = as.character(tipostexto$tipo))
        if (any(tipodet)) {
                #si lo hay, cogemos el segundo, que corresponde con enmiendas
                tmp$tipotexto <- tipostexto[tipodet, "textoabrev"][2]
        } 
        #tramite
        #         tmp$tramite <- tolower(lines[1])
        tmp$tramite <- tramite
        #titulo
        tmp$titulo <- ndx[1]
        tmp$titulo <- str_replace_all(tmp$titulo, " +", " ") ## Quito espacios duplicados
        tmp$titulo <- str_trim(tmp$titulo) ## Quito espacios en los extremos
        #Extraer la PRIMERA FECHA QUE APARECE ---ACORDADO CON ALBA, 19/02/2015
        ## Campo fecha
        # se busca en el indice, en principio igual para todas las enmiendas
        detfecha <- str_detect(ndx, "([0-9]+) de ([a-z]+) de ([0-9]+)")
        if (any(detfecha)) {
                linesfecha <- ndx[detfecha][1] ## la primera
                tmp$fecha <- try(extraer.fecha(linesfecha[length(linesfecha)]))
                if (any(class(tmp$fecha) == "try-error")) tmp$fecha <- NULL
        }
        
        ## Vamos añadiendo a una lista el contenido de cada enmienda
        # y ademas los campos comunes: bol, fecha (para todas la misma), titulo...
        lcont <- list() #para almacenar las enmiendas, todas con la misma referencia y distinto numero
        
        #si no hay enmiendas se envia un unico documento
        if(!length(nenmi)>0){ #enviar lo basico: codigo, tramite, content, referencia
                lcont <- tmp
                lcont$bol <- codigo
                return(list(lcont))
                break()
        }
        #lo siguiente iria en un bucle
        count <- 0
        for(i in 1:length(nenmi)){#i=46
                #                 browser()
                count <- count + 1
                #Campos comunes. 
                #Añadimos los de cada enmienda en tmp1.
                tmp1 <- tmp
                
                #contenido de la enmienda
                inienmi <- nenmi[i]
                finenmi <- nenmi[i+1]-1
                #considerar el caso de ser la ultima
                if(i == length(nenmi)){
                        if(any(s <- str_detect( lines, "^ÍNDICE DE ENMIENDAS AL ARTICULADO"))){
                                ifin <- (1:length(lines))[s]
                                finenmi <- ifin-1
                        } else {
                                finenmi <- length(lines) #vamos al final
                        }
                }
                #número de enmienda
                if(!is.na(n <- str_split_fixed(lines[inienmi], pattern = " ", 3)[,3])){
                        tmp1$numenmienda <- n
                }
                tmp1$content <- lines[(inienmi+1):finenmi]
                tmp1$content <- str_trim(tmp1$content)
                tmp1$content <- tmp1$content[tmp1$content != ""]
                tmp1$content <- str_replace_all(tmp1$content, '\\"', "")
                
                #Diputados tras 'FIRMANTE'??? CONSULTAR ALBA; MIRAR CASOS.
                if(any(s <- str_detect(string = tmp1$content, pattern = "^FIRMANTE"))){
                        lindiputado <- tmp1$content[(1:length(tmp1$content))[s]+1]
                        ## Busco diputados en lindiputado
                        if (length(lindiputado)>0) {
                                dipdet <- str_detect(string = lindiputado[1], pattern = as.character(diputados$nomapre))
                                if (any(dipdet)) {
                                        ##cat("\n", pres[i], "\n *", paste(diputados[dipdet, "apnom"], collapse=";"), "\n")
                                        tmp1$diputados <- diputados[dipdet, "apnom"]
                                } 
                        }
                }
                
                #Grupo parlamentario: del mismo sitio
                if(any(s <- str_detect(string = tmp1$content, pattern = "^FIRMANTE"))){
                        lindiputado <- tmp1$content[(1:length(tmp1$content))[s]+1]
                        ## Busco diputados en lindiputado
                        if (length(lindiputado)>0) {
                                gpdet <- str_detect(string = lindiputado[1], pattern = as.character(gparlam$gparlams))
                                if (any(gpdet)) {
                                        ##cat("\n", pres[i], "\n *", paste(diputados[dipdet, "apnom"], collapse=";"), "\n")
                                        tmp1$grupos <- gparlam[gpdet, "gparlamab"]
                                } 
                        }
                        #actualizamos contenido para eliminar diputado
                        tmp1$content <- tmp1$content[3:length(tmp1$content)]
                }
                lcont[[i]] <- tmp1 
        }
        #i=1 primera enmienda. 
        return(lcont)
}

#+++++++++++++++++++++++++++++++#
# Diccionarios - Listas propias #
#+++++++++++++++++++++++++++++++#

#tipos de serie A
# tiposA <- c("(121) Proyecto de Ley.$",
#             "(121) Proyecto de Ley$",
#             "Ampliación del plazo de enmiendas.$",
#             "Ampliación del plazo de enmiendas$",
#             "Correcci[óo]n de error.$",
#             "Correcci[óo]n de error$",
#             "Correcci[óo]n de errores.$",
#             "Correcci[óo]n de errores$",
#             "ENMIENDAS E ÍNDICE DE ENMIENDAS AL ARTICULADO$",
#### NOTA. Comprobar con Alba.
# tramitesA <- c("Proyecto de Ley",
#             "Ampliación del plazo de enmiendas",
#             "Enmiendas e índice de enmiendas al articulado",
#             "Enmiendas",
#             "Informe de la Ponencia",
#             "Dictamen de la Comisión",
#             "Escritos de mantenimiento de enmiendas para su defensa ante el Pleno",
#             "Aprobación definitiva por el Congreso",
#             "Aprobación por el Pleno"
# )


##[INES 22-12-2014] Grupos parlamentarios, nombres alternativos
# gparlam <- data.frame( gparlam = c("Grupo Parlamentario Popular en el Congreso",
#                                    "Grupo Parlamentario Socialista",
#                                    "Grupo Parlamentario Catalán (Convergència i Unió)",
#                                    "Grupo Parlamentario de IU, ICV-EUiA, CHA: La Izquierda Plural",
#                                    "Grupo Parlamentario de la Izquierda Plural",#[INES 21-01-2015]
#                                    "Grupo Parlamentario de Unión Progreso y Democracia",
#                                    "Grupo Parlamentario Vasco (EAJ-PNV)",
#                                    "Grupo Parlamentario Mixto"),
#                        gparlams = c("Popular en el Congreso",
#                                     "Socialista",
#                                     "Catalán \\(Convergència i Unió\\)",
#                                     "IU, ICV-EUiA, CHA: La Izquierda Plural",
#                                     "Izquierda Plural",#[INES 21-01-2015]
#                                     "Unión Progreso y Democracia",
#                                     "Vasco \\(EAJ-PNV\\)",
#                                     "Mixto"),
#                        gparlamab = c("GP",
#                                      "GS",
#                                      "GC-CiU",
#                                      "GIP",
#                                      "GIP",#[INES 21-01-2015]
#                                      "GUPyD",
#                                      "GV (EAJ-PNV)", #[INES 21-01-2015 quitamos \\]
#                                      "GMx")  )


## [ines 16-01-2015] Comisiones
# comisiones <- c("^Comisión Constitucional$",
#                 "^Comisión de Asuntos Exteriores$",
#                 "^Comisión de Justicia$",
#                 "^Comisión de Interior$",
#                 "^Comisión de Defensa$",
#                 "^Comisión de Economía y Competitividad$",
#                 "^Comisión de Hacienda y Administraciones Públicas$",
#                 "^Comisión de Presupuestos$",
#                 "^Comisión de Fomento$",
#                 "^Comisión de Educación y Deporte$",
#                 "^Comisión de Empleo y Seguridad Social$",
#                 "^Comisión de Industria, Energía y Turismo$",
#                 "^Comisión de Agricultura, Alimentación y Medio Ambiente$",
#                 "^Comisión de Sanidad y Servicios Sociales$",
#                 "^Comisión de Cooperación Internacional para el Desarrollo$",
#                 "^Comisión de Cultura$",
#                 "^Comisión de Igualdad$",
#                 "^Comisión de Reglamento$",
#                 "^Comisión del Estatuto de los Diputados$",
#                 "^Comisión de Peticiones$",
#                 "^Comisión de Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo$",
#                 "^Comisión sobre Seguridad Vial y Movilidad Sostenible$",
#                 "^Comisión para las Políticas Integrales de la Discapacidad$",
#                 "^Comisión de control de los créditos destinados a gastos reservados$",
#                 "^Comisión Consultiva de Nombramientos$",
#                 "^Comisión para el Estudio del Cambio Climático$",
#                 "^Comisión Mixta para las Relaciones con el Tribunal de Cuentas$",
#                 "^Comisión Mixta para la Unión Europea$",
#                 "^Comisión Mixta de Relaciones con el Defensor del Pueblo$",
#                 "^Comisión Mixta para el Estudio del Problema de las Drogas$",
#                 "^Comisión Mixta Control Parlam. de la Corporación RTVE y sus Sociedades$"
# )
# 
# comisabrev <- c("Constitucional",
#                 "Asuntos Exteriores",
#                 "Justicia",
#                 "Interior",
#                 "Defensa",
#                 "Economía y Competitividad",
#                 "Hacienda y Administraciones Públicas",
#                 "Presupuestos",
#                 "Fomento",
#                 "Educación y Deporte",
#                 "Empleo y Seguridad Social",
#                 "Industria, Energía y Turismo",
#                 "Agricultura, Alimentación y Medio Ambiente",
#                 "Sanidad y Servicios Sociales",
#                 "Cooperación Internacional para el Desarrollo",
#                 "Cultura",
#                 "Igualdad",
#                 "Reglamento",
#                 "Estatuto de los Diputados",
#                 "Peticiones",
#                 "Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo",
#                 "Seguridad Vial y Movilidad Sostenible",
#                 "Políticas Integrales de la Discapacidad",
#                 "control de los créditos destinados a gastos reservados",
#                 "Consultiva de Nombramientos",
#                 "Estudio del Cambio Climático",
#                 "Mixta para las Relaciones con el Tribunal de Cuentas",
#                 "Mixta para la Unión Europea",
#                 "Mixta de Relaciones con el Defensor del Pueblo",
#                 "Mixta para el Estudio del Problema de las Drogas",
#                 "Mixta Control Parlam. de la Corporación RTVE y sus Sociedades"
# )

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

extraer.comision <- function(x){#x=tmp$cntpre[e]
        #### queda depurar ante posibles errores
        s <- unlist(str_split(str_match(string = x, pattern = ignore.case('^A la comisi[óo]n.*'))[1,], " "))
        s1 <- (1:length(s))[s=="Comisión"]
        paste0("Comisión ", s[(s1+1)])
}


### Limpieza de blancos en cadenas
cleanBN <- function(x) { return( gsub(" +", " ", gsub("[[:cntrl:]]", "", x)) )}


### Utilidades para depurar el codigo

#extrae primera y ultima lineas
prult <- function(x){ print(c('primero'=head(x, n=1), 'ultimo'=tail(x, n=1))) }