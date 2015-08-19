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
        "Proyecto de Ley",
        "Enmienda a Proyecto de Ley"
      ];
      /*
        return [
            {'value': '121', 'text': 'Proyecto de Ley'},
            {'value': '121', 'text': 'Enmienda a Proyecto de Ley'},
            {'value': '120', 'text': 'Iniciativa Legislativa Popular'},
            {'value': '120', 'text': 'Enmienda a Iniciativa Legislativa Popular'},
            {'value': '122', 'text': 'Proposición de Ley de Grupos Parlamentarios'},
            {'value': '122', 'text': 'Enmienda a Proposición de Ley de Grupos Parlamentarios'},
            {'value': '123', 'text': 'Proposición de Ley de Diputados'},
            {'value': '123', 'text': 'Enmienda a Proposición de Ley de Diputados'},
            {'value': '125', 'text': 'Proposición de Ley de CCAA'},
            {'value': '125', 'text': 'Enmienda a Proposición de Ley de CCAA'},
            {'value': '130', 'text': 'Real Decreto Ley'},
            {'value': '132', 'text': 'Real Decreto Legislativo'},
            {'value': '154', 'text': 'Subcomisiones y Ponencias'},
            {'value': '155', 'text': 'Solicitud creación Comisión Permanente'},
            {'value': '156', 'text': 'Solicitud creación Comisión de Investigación'},
            {'value': '158', 'text': 'Solicitud creación Subcomisiones y Ponencias'},
            {'value': '161', 'text': 'Proposiciones no de Ley en Comisión'},
            {'value': '161', 'text': 'Enmienda a Proposición no de Ley en Comisión'},
            {'value': '162', 'text': 'Proposiciones no de Ley en Pleno'},
            {'value': '162', 'text': 'Enmienda a Proposición no de Ley en Pleno'},
            {'value': '172', 'text': 'Interpelación urgente'},
            {'value': '173', 'text': 'Moción consecuencia de interpelación urgente'},
            {'value': '173', 'text': 'Enmienda a Moción'},
            {'value': '178', 'text': 'Pregunta oral a RTVE'},
            {'value': '179', 'text': 'Pregunta escrita para RTVE'},
            {'value': '180', 'text': 'Pregunta oral en Pleno'},
            {'value': '181', 'text': 'Pregunta oral en Comisión'},
            {'value': '184', 'text': 'Pregunta para respuesta escrita'},
            {'value': '210', 'text': 'Comparecencia del Gobierno ante el Pleno'},
            {'value': '211', 'text': 'Otras comparecencias'},
            {'value': '212', 'text': 'Comparecencia de autoridades y funcionarios en Comisión'},
            {'value': '213', 'text': 'Comparecencia del Gobierno en Comisión (art. 44)'},
            {'value': '214', 'text': 'Comparecencia del Gobierno en Comisión (arts. 202 y 203)'},
            {'value': '219', 'text': 'Otras comparecencias en Comisión'},
            {'value': '043', 'text': 'Planes, Programas y Dictámenes'},
            {'value': '043', 'text': 'Propuestas de Resolución'},
            {'value': '095', 'text': 'Operaciones de las Fuerzas Armadas en el exterior'}
        ];
        */
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
            showNavigation: 'never',
            showFilter: false,
            showColumnToggles: false,
            fields: [{ key: 'titulo', label: 'Titulo', sortable: true, sortOrder: 1, sortDirection: -1, headerClass: 'col-md-7',
                                            fn: function(val, obj) {
                                                return Spacebars.SafeString('<a href="/t/'+ obj._id + '">'+val+'</a>');
                                            }
                                        },
                                        { key: 'autor_diputado',  label: 'Autor', sortable: false, headerClass: 'col-md-2',
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
                                        { key: 'autor_grupo', label: 'Grupo', sortable: false, headerClass: 'col-md-2',
                                            fn: function(val, obj) {
                                                groupsHumanized = [];
                                                for(i=0;i<val.length;i++) {
                                                    groupsHumanized.push(parliamentarygroups[val[i]]);
                                                }
                                                return groupsHumanized.join([separator = ', ']);
                                            }
                                        },
                                        { key: 'fecha', label: 'Fecha', sortable: true, sortOrder: 0, sortDirection: -1, headerClass: 'col-md-1',
                                            fn: function(val, obj) {
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
