/* ---------------------------------------------------- +/

## Tipis ##

/+ ---------------------------------------------------- */

function hasValue(val) {
    return val != '';
}

function isAdvancedSearch() {
    return hasValue(this.fechadesde.value)
        || hasValue(this.fechahasta.value)
        || hasValue(this.lugar.value)
        || hasValue(this.ref.value)
        || hasValue(this.vtipo.value)
        || hasValue(this.tramitacion.value)
        || hasValue(this.titulo.value);
}

function getTermsFromDict(d) {
    dict = Dicts.find(
        {name: d},
        {
            fields: {terms: 1},
            sort: {'terms.humanterm': 1}
        }).fetch();
    if (dict.length > 0) {
        res = dict[0].terms;
    } else {
        res = [];
    }
    return res;
}


function transformDataforCsv(d) {
    res={};
    res['autor_diputado'] = d.autor_diputado;
    res['autor_grupo'] = d.autor_grupo;
    res['autor_otro'] = d.autor_otro;
    res['fecha'] = d.fecha;
    res['lugar'] = d.lugar;
    res['ref'] = d.ref;
    res['tipotexto'] = d.tipotexto;
    res['titulo'] = d.titulo;

    arr=[];
    for (element in d.dicts.tipi){
        arr.push(d.dicts.tipi[element]);
    }
    delete res.dicts;
    res["dicts"]=arr;
    arr=[]
    for (element in d.terms.tipi){
        arr.push(d.terms.tipi[element].humanterm);
    }
    delete  res.terms;
    res["terms"]=arr;
    return res;

}


Template.search.onCreated(function () {
  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  var currentTerms = new ReactiveVar([]);
  this.currentTerms = currentTerms;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });
      // Build messages
  data = Template.instance().data;
  if (data.searched) {
      if (data.count == 0) {
          flash("No se han encontrado iniciativas que cumplan los criterios.", "danger");
      } else {
          if (data.count >= Meteor.settings.public.queryParams.limit) {
              flash("Demasiadas iniciativas encontradas. Se mostrarán solo las " + Meteor.settings.public.queryParams.limit + " últimas.", "info");
          } else {
              flash("Se han encontrado " + data.count + " iniciativas.", "info");
          }
      }
  }
});

Template.search.helpers({
    dicts_helper: function() {
        return Dicts.find(
            {},
            {
                fields: {name: 1},
                sort: {name: 1}
            }).fetch();
    },
    terms_helper: function() {
        return Template.instance().currentTerms.get();
    },
    grupootro_helper: function() {
        return [
            "Gobierno",
            "Grupo Popular",
            "Grupo Socialista",
            "Grupo Confederal de Unidos Podemos-En Comú Podem-En Mare",
            "Grupo Ciudadanos",
            "Grupo Vasco - EAJ PNV",
            "Grupo Esquerra Republicana",
            "Grupo Mixto",
        ];    
    },
    lugares_helper: function() {
        return [
            "Comisión Constitucional",
            "Comisión de Agricultura, Alimentación y Medio Ambiente",
            "Comisión de Asuntos Exteriores",
            "Comisión de Cooperación Internacional para el Desarrollo",
            "Comisión de Cultura",
            "Comisión de Defensa",
            "Comisión de Economía y Competitividad",
            "Comisión de Educación y Deporte",
            "Comisión de Empleo y Seguridad Social",
            "Comisión de Fomento",
            "Comisión de Hacienda y Administraciones Públicas",
            "Comisión de Igualdad",
            "Comisión de Industria, Energía y Turismo",
            "Comisión de Interior",
            "Comisión de Justicia",
            "Comisión de Presupuestos",
            "Comisión de Sanidad y Servicios Sociales",
            "Pleno",
        ];
    },
    tramitaciones_helper: function() {
        return [
            "Aprobada",
            "Aprobada con modificaciones",
            "En tramitación",
            "Rechazada",
            "Caducada",
            "Retirada"
        ];
    },
    tipos_helper: function() {
      return [
        "Comisiones, Subcomisiones y Ponencias",
        /*"Comparecencia",*/
        /*"Enmienda a Moción",*/
        "Enmienda a Proposición de Ley",
        /*"Enmienda a Proposición no de Ley",*/
        "Enmienda a Proyecto de Ley",
        "Interpelación",
        "Moción consecuencia de Interpelación",
        "Planes, Programas y Dictámenes",
        "Pregunta oral",
        "Pregunta para respuesta escrita",
        "Proposición de Ley",
        "Proposición no de Ley",
        "Proyecto de Ley",
        "Real Decreto Legislativo",
        "Real Decreto Ley",
      ];
    },
    dip_autocomplete_settings: function() {
        return {
            position: "bottom",
            limit: 10,
            rules: [
                {
                    token: '',
                    collection: Diputados,
                    field: "nombre",
                    template: Template.dipAutocomplete
                }
            ]
        };
    },
    lastquery: function() {
        return Session.get("search");
    },
    arrayNumPages: function() {
        npages = Math.ceil(this.count / Meteor.settings.public.reactiveTable.rowsPerPage);
        if (npages > 1) {
            return [...Array(npages).keys()].map(x => x+1);
        } else {
            return [];
        }
    },
    hasPrevious: function() {
        return Template.instance().currentPage.get() > 0;
    },
    hasNext: function() {
        return Template.instance().currentPage.get() + 1 < Math.ceil(this.count / Meteor.settings.public.reactiveTable.rowsPerPage);j
    },
    currentPage: function() {
        return Template.instance().currentPage.get() + 1;
    },
    totalPages: function() {
        return Math.ceil(this.count / Meteor.settings.public.reactiveTable.rowsPerPage);
    },
    settings: function () {
        return {
            currentPage: Template.instance().currentPage,
            rowsPerPage: Meteor.settings.public.reactiveTable.rowsPerPage,
            showNavigation: 'never',
            showFilter: false,
            showColumnToggles: false,
            multiColumnSort: false,
            fields: [
                { key: 'titulo', fieldId: 'titulo', label: 'Titulo', sortable: false, headerClass: 'col-md-6',
                    fn: function(val, obj) {
                        var str = '';
                        if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
                            str += '<div class="btn-group">';
                              str += '<a href="#" class="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-square-o-down"></i></a>';
                              str += '<ul class="dropdown-menu">';
                                str += '<li><a href="tipis/'+ obj._id + '"><i class="fa fa-file-o"></i> Ver iniciativa</a></li>';
                                str += '<li><a href="/admin/Tipis/'+ obj._id + '/edit"><i class="fa fa-pencil"></i> Editar iniciativa</a></li>';
                                str += '<li><a href="'+ obj.url + '"><i class="fa fa-institution"></i> Ver en Congreso.es</a></li>';
                              str += '</ul>';
                            str += '</div>';
                            str += '&nbsp;&nbsp;';
                        }
                        str += '<a href="/tipis/'+ obj._id + '"><strong>'+val+'</strong></a>';
                        return Spacebars.SafeString(str);
                    }
                },
                { key: 'autor_diputado', fieldId: 'autor', label: 'Autor', sortable: false, headerClass: 'col-md-2',
                    fn: function(val, obj) {
                      if (!_.isNull(val)) {
                        if (val.length > 0) {
                            return Spacebars.SafeString(val.join([separator = '<br/>']));
                        } else {
                            if (obj.autor_otro.length > 0) {
                                return Spacebars.SafeString(obj.autor_otro.join([separator = '<br/>']));
                            }
                        }

                      } else {
                        return '';
                      }
                    }
                },
                { key: 'autor_grupo', fieldId: 'grupo', label: 'Grupo', sortable: false, headerClass: 'col-md-1',
                    fn: function(val, obj) {
                        groupsHumanized = [];
                        for(i=0;i<val.length;i++) {
                            groupsHumanized.push(val[i]);
                        }
                        return groupsHumanized.join([separator = ', ']);
                    }
                },
                { key: 'dicts.tipi', fieldId: 'temas', label: 'Temas', sortable: false, headerClass: 'col-md-2', cellClass: 'capitalize-text',
                    fn: function(val, obj) {
                        return val.join(', ');
                    }
                },
                { key: 'fecha', fieldId: 'fecha', label: 'Fecha', sortable: true, sortDirection: 'descending', headerClass: 'col-md-1',
                    fn: function(val, obj) {
                        return new Spacebars.SafeString("<span sort=" + moment(val).format() + ">" + moment(val).format('l') + "</span>");
                    }
                }
            ]
        };
    }
});


Template.search.rendered = function () {
  if(!this._rendered) {
      this._rendered = true;
      Session.set('searchUrl', window.location.href);
      $("#fechadesde").datepicker(datepickeroptions);
      $("#fechahasta").datepicker(datepickeroptions);
      if (isAdvancedSearch()) {
          $('.adv-search-block').show();
          $('.adv-search-link.hide-block').show();
      } else {
          $('.adv-search-block').hide();
          $('.adv-search-link.hide-block').hide();
      }
      search = Session.get("search");
      Template.instance().currentTerms.set(getTermsFromDict(search.dicts));
  }
};

Template.search.events({
    'submit form': function(e) { },
    'click a#exportcsv': function(e) {
        e.preventDefault();
        var query = Session.get("search");
        var collection_data = Iniciativas.find().fetch();
        var forprint = []
        for (var coll in collection_data){
            ele= transformDataforCsv(collection_data[coll]);
            forprint.push(ele);
        }
        var data = json2csv(forprint,true,true);
        var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "tipis.csv");
    },
    'click .adv-search-link': function(e) {
        e.preventDefault();
        $(e.currentTarget).hide();
        $('.adv-search-block').toggle(0, function() {
            if ($('.adv-search-block').is(':visible'))
                $('.adv-search-link.hide-block').show();
            else 
                $('.adv-search-link.show-block').show();
        });
    },
    'change #dicts': function(e) {
        Template.instance().currentTerms.set(getTermsFromDict($('#dicts').val()));
    },
    'click .pager .begin': function(e) {
        e.preventDefault();
        movePage(0);
    },
    'click .pager .previous': function(e) {
        e.preventDefault();
        movePage(parseInt(Template.instance().currentPage.get())-1);
    },
    'click .pager .next': function(e) {
        e.preventDefault();
        movePage(parseInt(Template.instance().currentPage.get())+1);
    },
    'click .pager .end': function(e) {
        e.preventDefault();
        movePage(Math.ceil(this.count / Meteor.settings.public.reactiveTable.rowsPerPage)-1);
    }
});

function movePage(number) {
    Template.instance().currentPage.set(number);
    Session.set('current-page', Template.instance().currentPage.get());
    // Go to top after changing currentPage
    $('body').animate({ scrollTop: 0 }, 0);
}
