### Directorios y Funciones comunes a todas las series - Boletines Congreso Diputados

#+++++++++++++++++++++++++++++#
#    1. Mapeo tipo a texto    #
#+++++++++++++++++++++++++++++#
tipostexto <- data.frame(tipo = c(120,
                                  120,
                                  121,
                                  121,
                                  122,
                                  122,
                                  123,
                                  123,
                                  125,
                                  125,
                                  130,
                                  132,
                                  154,
                                  155,
                                  156,
                                  158,
                                  161,
                                  161,
                                  162,
                                  162,
                                  170,
                                  172,
                                  173,
                                  173,
                                  178,
                                  179,
                                  180,
                                  181,
                                  184,
                                  186,
                                  187,
                                  188,
                                  189,
                                  193,
                                  200,
                                  201,
                                  210,
                                  211,
                                  212,
                                  213,
                                  214,
                                  219,
                                  221,
                                  222,
                                  223,
                                  224,
                                  430,
                                  043,
                                  052,
                                  062,
                                  095),
                         texto=c("Proposición de Ley",
                                 "Enmienda a Proposición de Ley",
                                 "Proyecto de Ley",
                                 "Enmienda a Proyecto de Ley",
                                 "Proposición de Ley",
                                 "Enmienda a Proposición de Ley",
                                 "Proposición de Ley",
                                 "Enmienda a Proposición de Ley",
                                 "Proposición de Ley",
                                 "Enmienda a Proposición de Ley",
                                 "Real decreto ley",
                                 "Real decreto legislativo",
                                 "Solicitud creación subcomisiones y ponencias",
                                 "Solicitud creación comisión",
                                 "Solicitud creación comisión",
                                 "Solicitud creación subcomisiones y ponencias",
                                 "Proposiciones no de Ley presentadas en Comisión",
                                 "Enmienda a Proposición no de Ley",
                                 "Proposiciones no de Ley presentadas en Pleno",
                                 "Enmienda a Proposición no de Ley",
                                 "Interpelación ordinaria",
                                 "Interpelación urgente",
                                 "Moción consecuencia de interpelación urgente",
                                 "Enmienda a Moción",
                                 "Pregunta oral a la Corporación RTVE",
                                 "Pregunta a la Corporación RTVE con respuesta escrita",
                                 "Pregunta oral en Pleno",
                                 "Pregunta oral al Gobierno en Comisión",
                                 "Pregunta al Gobierno con respuesta escrita",
                                 "Solicitud de informe a la Administración del Estado",
                                 "Solicitud de informe a Comunidad Autónoma",
                                 "Solicitud de informe a Entidad Local",
                                 "Solicitud de informe a otra Entidad Pública",
                                 "Solicitud de informe a la Administración del Estado",
                                 "Comunicación del Gobierno",
                                 "Planes y programas",
                                 "Comparecencia del Gobierno ante el Pleno",
                                 "Comparecencia",
                                 "Comparecencia",
                                 "Comparecencia del Gobierno en Comisión",
                                 "Comparecencia del Gobierno en Comisión",
                                 "Otras comparecencias en Comisión",
                                 "Comparecencia del Gobierno en Comisión Mixta solicitada en el Senado",
                                 "Comparec. autoridades y funcionarios en Com. Mx. solicitada en Senado",
                                 "Otras comparecencias en Comisión Mixta solicitadas en el Senado",
                                 "Información sobre secretos oficiales",
                                 "Objetivo de estabilidad presupuestaria",
                                 "Documentación remitida a Comisiones para su conocimiento",
                                 "Funciones del Pleno",
                                 "Funciones de la Diputación Permanente",
                                 "Operaciones de las Fuerzas Armadas en el exterior"),
                         textoabrev=c("Proposición de Ley",
                                      "Enmienda a Proposición de Ley",
                                      "Proyecto de Ley",
                                      "Enmienda a Proyecto de Ley",
                                      "Proposición de Ley",
                                      "Enmienda a Proposición de Ley",
                                      "Proposición de Ley",
                                      "Enmienda a Proposición de Ley",
                                      "Proposición de Ley",
                                      "Enmienda a Proposición de Ley",
                                      "Real decreto Ley",
                                      "Real decreto Legislativo",
                                      "Solicitud creación subcomisiones y ponencias",
                                      "Solicitud creación comisión",
                                      "Solicitud creación comisión",
                                      "Solicitud creación subcomisiones y ponencias",
                                      "Proposición no de Ley",
                                      "Enmienda a Proposición no de Ley",
                                      "Proposición no de Ley",
                                      "Enmienda a Proposición no de Ley",
                                      "Interpelación",
                                      "Interpelación",
                                      "Moción",
                                      "Enmienda a Moción",
                                      "Pregunta oral",
                                      "Pregunta escrita para RTVE",#issue 179
                                      "Pregunta oral",
                                      "Pregunta oral",
                                      "Pregunta para respuesta escrita",
                                      "Solicitud informe",
                                      "Solicitud informe",
                                      "Solicitud informe",
                                      "Solicitud informe",
                                      "Solicitud informe",
                                      "Comunicación Gobierno",
                                      "Planes y programas",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Comparecencia",
                                      "Información secretos oficiales",
                                      "Objetivo estabilidad presupuestaria",
                                      "Planes, Programas y Dictámenes",
                                      "Funciones Pleno",
                                      "Funciones Diputación permanente",
                                      "Operaciones Fuerzas Armadas exterior"))
                                      
#tipos en serie D que no se procesarán.
noprocesar <- c("99999999")

#tipos adicionales a excluir en Diarios de Sesiones
noprocesarDS <- c("99999999")

#++++++++++++++++++++++++#
#    2. Comisiones       #
#++++++++++++++++++++++++#
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
                "^Comisión de Seguimiento y Evaluación de los Acuerdos del Pacto de Toledo$",
                "^Comisión sobre Seguridad Vial y Movilidad Sostenible$",
                "^Comisión para las Políticas Integrales de la Discapacidad$",
                "^Comisión de control de los créditos destinados a gastos reservados$",
                "^Comisión Consultiva de Nombramientos$",
                "^Comisión para el Estudio del Cambio Climático$",
                "^Comisión Mixta para las Relaciones con el Tribunal de Cuentas$",
                "^Comisión Mixta para la Unión Europea$",
                "^Comisión Mixta de Relaciones con el Defensor del Pueblo$",
                "^Comisión Mixta para el Estudio del Problema de las Drogas$",
                "^Comisión Mixta Control Parlam. de la Corporación RTVE y sus Sociedades$")
                
dfcomisiones <- data.frame(
                comisionbusq = 
                        c("Constitucional",
                          "Comisión de Asuntos Exteriores",
                          "Justicia",
                          "Interior",
                          "Defensa",
                          "Economía y Competitividad",
                          "Hacienda y Administraciones Públicas",
                          "Presupuestos",
                          "Fomento",
                          "Educación y Deporte",
                          "Empleo y Seguridad Social",
                          "Industria, Energía y Turismo",
                          "Agricultura, Alimentación y Medio Ambiente",
                          "Sanidad y Servicios Sociales",
                          "Cooperación Internacional para el Desarrollo",
                          "Cultura",
                          "Igualdad",
                          "Reglamento",
                          "del Estatuto de los Diputados",
                          "Peticiones",
                          "Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo",
						  "Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo",
                          "sobre Seguridad Vial y Movilidad Sostenible",
                          "para las Políticas Integrales de la Discapacidad",
                          "control de los créditos destinados a gastos reservados",
                          "Consultiva de Nombramientos",
                          "para el Estudio del Cambio Climático",
                          "Mixta para las Relaciones con el Tribunal de Cuentas",
                          "Mixta para la Unión Europea",
                          "Mixta de Relaciones con el Defensor del Pueblo",
                          "Mixta para el Estudio del Problema de las Drogas",
                          "Mixta Control Parlam. de la Corporación RTVE y sus Sociedades"),
                comision = c("Comisión Constitucional",
                             "Comisión de Asuntos Exteriores",
                             "Comisión de Justicia",
                             "Comisión de Interior",
                             "Comisión de Defensa",
                             "Comisión de Economía y Competitividad",
                             "Comisión de Hacienda y Administraciones Públicas",
                             "Comisión de Presupuestos",
                             "Comisión de Fomento",
                             "Comisión de Educación y Deporte",
                             "Comisión de Empleo y Seguridad Social",
                             "Comisión de Industria, Energía y Turismo",
                             "Comisión de Agricultura, Alimentación y Medio Ambiente",
                             "Comisión de Sanidad y Servicios Sociales",
                             "Comisión de Cooperación Internacional para el Desarrollo",
                             "Comisión de Cultura",
                             "Comisión de Igualdad",
                             "Comisión de Reglamento",
                             "Comisión del Estatuto de los Diputados",
                             "Comisión de Peticiones",
                             "Comisión de Seguimto. y Evaluación de los Acuerdos del Pacto de Toledo",
                             "Comisión de Seguimiento y Evaluación de los Acuerdos del Pacto de Toledo",
                             "Comisión sobre Seguridad Vial y Movilidad Sostenible",
                             "Comisión para las Políticas Integrales de la Discapacidad",
                             "Comisión de control de los créditos destinados a gastos reservados",
                             "Comisión Consultiva de Nombramientos",
                             "Comisión para el Estudio del Cambio Climático",
                             "Comisión Mixta para las Relaciones con el Tribunal de Cuentas",
                             "Comisión Mixta para la Unión Europea",
                             "Comisión Mixta de Relaciones con el Defensor del Pueblo",
                             "Comisión Mixta para el Estudio del Problema de las Drogas",
                             "Comisión Mixta Control Parlam. de la Corporación RTVE y sus Sociedades")
)
               

#++++++++++++++++++++++++++++++++#
#    3. Grupos Parlamentarios    #
#++++++++++++++++++++++++++++++++#

gparlam <- data.frame( gparlam = c("Grupo Parlamentario Popular en el Congreso",
                                   "Grupo Parlamentario Socialista",
                                   "Grupo Parlamentario Catalán (Convergència i Unió)",
                                   "Grupo Parlamentario de IU, ICV-EUiA, CHA: La Izquierda Plural",
     							   "Grupo Parlamentario de IU, ICV-EUiA, CHA: La Izquierda Plural",
                                   "Grupo Parlamentario de IU, ICV-EUiA, CHA: La Izquierda Plural",
                                   "Grupo Parlamentario de Unión Progreso y Democracia",
                                   "Grupo Parlamentario Vasco (EAJ-PNV)",
                                   "Grupo Parlamentario Mixto"),
                       gparlams = c("Popular en el Congreso",
                                    "Socialista",
                                    "Catalán \\(Convergència i Unió\\)",
                                    "IU, ICV-EUiA, CHA: La Izquierda Plural",
                                    "IU, ICV-EUiA, CHA",
                                    "Izquierda Plural",
                                    "Unión(,)? Progreso y Democracia",#modificado 26-junio
                                    "Vasco \\(EAJ-PNV\\)",
                                    "Mixto"),
                       gparlamab = c("GP",
                                     "GS",
                                     "GC-CiU",
                                     "GIP",
                                     "GIP",
                                     "GIP",#[INES 21-01-2015]
                                     "GUPyD",
                                     "GV (EAJ-PNV)", #[INES 21-01-2015 quitamos \\]
                                     "GMx")  )


#++++++++++++++++++++++++++++++++#
#    4. Tramites (por serie)     #
#++++++++++++++++++++++++++++++++#
#Trámites para la serie A.
tramitesA <- c("Iniciativa",
			   "Proyecto de Ley",
               "Ampliación del plazo de enmiendas",
               "Enmiendas e índice de enmiendas al articulado",
               "Enmiendas",
               "Informe de la Ponencia",
               "Dictamen de la Comisión",
               "Escritos de mantenimiento de enmiendas para su defensa ante el Pleno",
               "Aprobación por la Comisión con competencia legislativa plena",
               "Aprobación definitiva por el Congreso",
               "Aprobación por el Pleno",
               "Documentación complementaria",
               "Tramitación en lectura única"
)

#Trámites para la serie B.
#Lista reducida para la serieB. el resto de casos son 'otro'.
tramitesB <- c("Proposición de Ley",
               "Iniciativa",#CONSULTAR ALBA: EQUIVALENTE A PL?
               "Rechazada",
               "Retirada"
)
#Lista ampliada
tramitesBamp <- c("Proposición de Ley",
               "Iniciativa",
               "Rechazada",
               "Retirada",
               "Caducidad de la iniciativa", #--->"Caducidad"
               "Modificación del título", #--->'Modificacion'B-36
               "Toma en consideración", #B-39, 
               "Proposición de reforma del Reglamento del Congreso", #B-39
               "Proposición de reforma constitucional", #B-55
               "Texto de la Proposición", #B58
               "Acuerdo subsiguiente a la toma en consideración",#B-70, B-112
               "Enmiendas e índice de enmiendas al articulado",#B-70
               "Informe de la Ponencia", #B-70
               "Dictamen de la Comisión", #B-112
               "Aprobación por la Comisión con competencia legislativa plena",
               "Votación favorable en debate de totalidad",#B-112
               "Aprobación por la Comisión con competencia legislativa plena", #B-119
               "Tramitación en lectura única", #B-157
               "Enmiendas", #B-157
               "Aprobación por el Pleno" #B-157
)

#Tramites serie D, tipos 161, 162
tramitesDPNL <- c("Desestimación así como enmiendas formuladas",
				  "Desestimación así como enmienda formulada",
				  "Desestimada así como enmiendas formuladas",
				  "Desestimada así como enmienda formulada",
				  "Aprobación con modificaciones así como enmiendas formuladas",
				  "Aprobación con modificaciones así como enmienda formulada",
				  "Aprobada con modificaciones así como enmiendas formuladas",
				  "Aprobada con modificaciones así como enmienda formulada",
				  "Retirada", 
				  "Rechazada",
				  "Aprobación",
				  "Aprobada"
)


#+++++++++++++++++++++++++++++++++++++++++++#
#   Funciones - Tratamiento Campo "autor    #
#+++++++++++++++++++++++++++++++++++++++++++#

##### Tratamiento campo "autor"
#Parametro: Elemento de una lista
#Devuelve: elemento actualizado con un campo "autor", y sin campos "diputados" ni "grupos"
crearCampoAutor <- function(elemento){
        elementodado <- elemento
        #existe alguno, diputado o grupo
        if(!is.null(elemento$grupos)|!is.null(elemento$diputados)){
                if(!is.null(elemento$grupos)){
                        vg <- vector()
                        for(g in 1:length(elemento$grupos)){
                                vg <- c(vg, c(elemento$grupos[g]))
                        }
                        elemento$autor$grupo <- unique(vg)
                        elemento$grupos <- NULL
                }
                if(!is.null(elemento$diputados)){
                        vd <- vector()
                        for(d in 1:length(elemento$diputados)){
                                vd <- c(vd, c(elemento$diputados[d]))
                        }
                        if(!is.null(elemento$autor)) elemento$autor$diputado <- unique(vd)
                        elemento$diputados <- NULL
                }
        }
        #Autor específico según el tipo en serie D.
        if(!is.null(elemento$tipo)){
        	        if(elemento$tipo %in% c("154", "155", "156", "158")){
        	        	elemento$autor <- NULL
                elemento$autor$otro <- "Gobierno"}
		}

        #Respuestas a preguntas (184...): Si hemos cazado el Autor en el título.
        if(!is.null(elementodado$autor)){
                if(elementodado$autor == "Gobierno"){
                        elemento$autor <- NULL
                        elemento$autor$otro <- "Gobierno"
                }
        }
        return(elemento)
}


#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#
#   Funciones - Separación Enmiendas por Grupos parlamentarios    #
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++#

##### Envío separado de Enmiendas por Grupos.
#Agrupar en un solo elemento de lista todos los los elementos de un grupo parlamentario
#i=indice donde introducir el elemento
#lcont2=lista nueva, generada de antes con lcont2<-list()
agruparUnGrupo <- function(lcont, grupo){#grupo=lgrupos[[1]]
        #grupos distintos en lcont
        #         lgrupos <- unique(sapply(1:length(lcont), function(x){ print(lcont[[x]]$grupos) }, simplify = TRUE))
        #
        elemen <- list()
        #determinar en que elementos de lcont tengo que iterar.
        kgrupobusq <- rep(0, length(lcont))
        for(k in 1:length(lcont)){#k=1
                if(!is.null(lcont[[k]]$grupos)){ 
                        if(identical(lcont[[k]]$grupos, grupo)){kgrupobusq[k] <- 1 }
                }
        }
        #
        #         c <- 0
        #buscar el primero y coger la info básica
        indices <- which(kgrupobusq == 1)
        if(length(indices)>0){ #CAMBIO 26-JUNIO length(indices)>1
                elemen <- lcont[[indices[1]]] 
        }
        indices <- indices[-1] #quitamos el primero
        if(length(indices)>1){
                for(k in indices){#k=19
                        #actualizar campos con nuevas Enmiendas consecutivas.
                        elemen$numenmienda <- c(elemen$numenmienda, lcont[[k]]$numenmienda)
                        elemen$content <- c(elemen$content, lcont[[k]]$content)
                        elemen$grupos <- unique(c(elemen$grupos, lcont[[k]]$grupos)) #deberia ser siempre el mismo.
                        #si no hay diputado en el primero lo ponemos vacio.
                        if(is.null(elemen$diputados)){ elemen$diputados <- "" } 
                        if(!is.null(lcont[[k]]$diputados)){
                                if(elemen$diputados == ""){ elemen$diputados <-  lcont[[k]]$diputados } #asi no aparece solo ""
                                elemen$diputados <- c(elemen$diputados, lcont[[k]]$diputados)
                        }
                }
        }
        return(elemen)
}

## Unir enmiendas del mismo grupo parlamentario
unirEnmiendas <- function(lcont){
        lgrupos <- unique(sapply(1:length(lcont), function(x){ print(lcont[[x]]$grupos) }, simplify = TRUE))
        #lgrupos nos da cuáles hay que juntar
        lcont2 <- list()
        #Insertar en lcont2 tantos elementos como grupos haya.
        for(i in 1:length(lgrupos)){#i=1
                if(!is.character(lgrupos[[i]])){#grupo nulo, se salta de momento.TODO.Forzar que todos tengan '='
                        next()
                }
                #se agrupan las enmiendas
                elemen <- agruparUnGrupo(lcont = lcont, grupo = lgrupos[[i]])
                #se insertan en la lista
                lcont2[[i]] <- elemen
                rm(elemen)
        }
        return(lcont2)
}
