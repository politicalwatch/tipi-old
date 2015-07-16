/* ---------------------------------------------------- +/

## Public Tipis ##

/+ ---------------------------------------------------- */

Template.scannertext.helpers({
    alldicts_helper: function() {
        return Dicts.find().fetch();
    },
    grupootro_helper: function() {
        return [
            {'value': 'Gobierno', 'text': 'Gobierno'},
            {'value': 'GP', 'text': 'G.P. Popular'},
            {'value': 'GS', 'text': 'G.P. Socialista'},
            {'value': 'GC-CiU', 'text': 'Grupo Catalán (CiU)'},
            {'value': 'GIP', 'text': 'G.P. La Izquierda Plural'},
            {'value': 'GUPyD', 'text': 'G.P. UPyD'},
            {'value': 'GV (EAJ-PNV)', 'text': 'G.P. Vasco (EAJ-PNV)'},
            {'value': 'GMx', 'text': 'G.P. Mixto'}
        ];    
    },
    lugares_helper: function() {
        return [
            "Pleno",
            "Comisión Constitucional",
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
            "Comisión de Igualdad"
        ];
    },
    tipos_helper: function() {
        return [
            "Proposición de Ley",
            "Enmienda a Proposición de Ley",
            "Proyecto de Ley",
            "Enmienda a Proyecto de Ley",
            "Real decreto ley",
            "Real decreto legislativo",
            "Solicitud creación subcomisiones y ponencias",
            "Solicitud creación comisión",
            "Proposiciones no de Ley presentadas en Comisión",
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
            "Operaciones de las Fuerzas Armadas en el exterior"
        ];
    },
    lastquery: function() {
        return Session.get("scannerText");
    },
    count: function() {
        if (this.count >= 100) flash("Se han encontrado más de 20 iniciativas.", "info");
        else if (this.count == 0) flash("No se han encontrado iniciativas que cumplan los criterios.", "info");
    },
    settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: false,
            showColumnToggles: false,
            fields: [{ key: 'titulo', label: 'Titulo', headerClass: 'col-md-7',
                                            fn: function(val, obj) {
                                                return Spacebars.SafeString('<a href="/t/'+ obj._id + '">'+val+'</a>');
                                            }
                                        },
                                        { key: 'autor_diputado', label: 'Autor', headerClass: 'col-md-2',
                                            fn: function(val, obj) {
                                                if (val.length > 0) {
                                                    return Spacebars.SafeString(val.join([separator = '<br/>']));
                                                } else {
                                                    if (obj.autor_otro.length > 0) {
                                                        return Spacebars.SafeString(obj.autor_otro.join([separator = '<br/>']));
                                                    }
                                                }
                                            }
                                        },
                                        { key: 'autor_grupo', label: 'Grupo', headerClass: 'col-md-2',
                                            fn: function(val, obj) {
                                                groupsHumanized = [];
                                                for(i=0;i<val.length;i++) {
                                                    groupsHumanized.push(parliamentarygroups[val[i]]);
                                                }
                                                return groupsHumanized.join([separator = ', ']);
                                            }
                                        },
                                        { key: 'fecha', label: 'Fecha', headerClass: 'col-md-1',
                                            fn: function(val, obj) {
                                                // return obj.relativeDate();
                                                return moment(val).format('l');
                                            }
                                        }
                                        ]
        };
    }
});


Template.scannertext.rendered = function () {
  if(!this._rendered) {
    this._rendered = true;
    $("#fechadesde").datepicker(datepickeroptions);
    $("#fechahasta").datepicker(datepickeroptions);
  }
};

Template.scannertext.events({
    'submit form': function(e) { }
    // 'click .reset': function(e) { console.log("reiniciando formulario..."); Session.set('scannerText', {}); }
});
