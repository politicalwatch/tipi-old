## Funciones auxiliares para test-proc.R, el nuevo procesador de boletines
options(stringsAsFactors=FALSE)
##[INES 22-12-2014] Grupos parlamentarios, nombres alternativos
gparlam <- data.frame( gparlam = c("Grupo Parlamentario Popular en el Congreso",
                                   "Grupo Parlamentario Socialista",
                                   "Grupo Parlamentario Catalán (Convergència i Unió)",
                                   "Grupo Parlamentario de IU, ICV-EUiA, CHA: La Izquierda Plural",
                                   "Grupo Parlamentario de la Izquierda Plural",#[INES 21-01-2015]
                                   "Grupo Parlamentario de Unión Progreso y Democracia",
                                   "Grupo Parlamentario Vasco (EAJ-PNV)",
                                   "Grupo Parlamentario Mixto"),
                       gparlams = c("Popular en el Congreso",
                                    "Socialista",
                                    "Catalán \\(Convergència i Unió\\)",
                                    "IU, ICV-EUiA, CHA: La Izquierda Plural",
                                    "Izquierda Plural",#[INES 21-01-2015]
                                    "Unión Progreso y Democracia",
                                    "Vasco \\(EAJ-PNV\\)",
                                    "Mixto"),
                       gparlamab = c("GP",
                                     "GS",
                                     "GC-CiU",
                                     "GIP",
                                     "GIP",#[INES 21-01-2015]
                                     "GUPyD",
                                     "GV (EAJ-PNV)", #[INES 21-01-2015 quitamos \\]
                                     "GMx")  )
# probablemente incluir alternativas... Propuestas a ojo:
# "Grupo Parlamentario de UPyD"

# por falta de tiempo lo editmos a mano para meter \\ en los parentesis.
# en teoría debería hacerse con un paste0 
# grupos.re <- "(Popular en el Congreso)|(Socialista)|(Catalán \\(Convergència i Unió\\))|
# (de IU, ICV-EUiA, CHA: La Izquierda Plural)|(de Unión Progreso y Democracia)|(Vasco \\(EAJ-PNV\\))|(Mixto)"
# 

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

## [INES 15-01-2015] Frases que indican secciones: (VER SI ES NECESARIO)
secciones <- c("^PREGUNTAS PARA RESPUESTA ESCRITA$",
               "^PREGUNTAS PARA RESPUESTA ESCRITA RTVE$")

## [ines 16-01-2015] Comisiones
comisiones <- c("^Comisión Constitucional$",
                "^Comisión de Asuntos Exteriores$",
                "^Comisión de Justicia$",
                "^Comisión de Interior$",
                "^Comisión de Defensa$",
                "^Comisión de Economía y Competitividad$",
                "^Comisión de Hacienda y Administraciones Públicas$",
                "^Comisión de Presupuestos$",
                "^Comisión de Fomento$",
                "^Comisión de Educación y Deporte$",
                "^Comisión de Empleo y Seguridad Social$",
                "^Comisión de Industria, Energía y Turismo$",
                "^Comisión de Agricultura, Alimentación y Medio Ambiente$",
                "^Comisión de Sanidad y Servicios Sociales$",
                "^Comisión de Cooperación Internacional para el Desarrollo$",
                "^Comisión de Cultura$",
                "^Comisión de Igualdad$",
                "^Comisión de Reglamento$",
                "^Comisión del Estatuto de los Diputados$",
                "^Comisión de Peticiones$",
                "^Comisión de Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo$",
                "^Comisión sobre Seguridad Vial y Movilidad Sostenible$",
                "^Comisión para las Políticas Integrales de la Discapacidad$",
                "^Comisión de control de los créditos destinados a gastos reservados$",
                "^Comisión Consultiva de Nombramientos$",
                "^Comisión para el Estudio del Cambio Climático$",
                "^Comisión Mixta para las Relaciones con el Tribunal de Cuentas$",
                "^Comisión Mixta para la Unión Europea$",
                "^Comisión Mixta de Relaciones con el Defensor del Pueblo$",
                "^Comisión Mixta para el Estudio del Problema de las Drogas$",
                "^Comisión Mixta Control Parlam. de la Corporación RTVE y sus Sociedades$"
)

## [INES 15-01-2015] Frases de separación de contenidos
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
        if (length(lc$contentpre)>0) {
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
