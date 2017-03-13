/* ---------------------------------------------------- +/

## Tipis ##

/+ ---------------------------------------------------- */


    function showCheckboxes() {
    }

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
    return res.sort();
}


function transformDataforCsv(d) {
    res={};
    res['autor_diputado'] = d.autor_diputado;
    res['autor_grupo'] = d.autor_grupo;
    res['autor_otro'] = d.autor_otro;
    res['fecha'] = d.actualizacion;
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
    options: function() {
      terms = [];
      var search = Session.get('search');
      _.each(Template.instance().currentTerms.get(), function(t) {
          if (t) {
              terms.push({
                      label: t.humanterm,
                      value: t.humanterm,
                      selected: _.indexOf(search.terms, t.humanterm) != -1
              });
          }
      });
      return terms;
    },
    selectOptions: function() {
        return {
              buttonClass: 'form-control',
              nonSelectedText: 'Pulsa para seleccionar',
              enableFiltering: true,
              maxHeight: "400",
              buttonWidth: "100%",
              nSelectedText: "seleccionados",
              numberDisplayed: 2,
              disableIfEmpty: true,
              filterPlaceholder: "Búsqueda de términos",
              allSelectedText: "Todos seleccionados",
        };
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
            "Comisión de Igualdad",
            "Comisión de Reglamento",
            "Comisión del Estatuto de los Diputados",
            "Comisión de Peticiones",
            "Comisión de Seguimiento y Evaluación de los Acuerdos Pacto de Toledo",
            "Comisión sobre Seguridad Vial y Movilidad Sostenible",
            "Comisión para las Políticas Integrales de la Discapacidad",
            "Comisión para el Estudio del Cambio Climático",
            "Comisión de Derechos de la Infancia y Adolescencia",
            "C. calidad democrática, contra corrupción y reformas inst. y legales",
        ];
    },
    tramitaciones_helper: function() {
        return [
            {name:"Aprobada", value:"aprobada"},
            {name:"Rechazada", value:"rechazada"},
            {name:"En tramitación", value:"tramitacion"},
            {name:"No admitida a trámite", value:"noadmitida"},
            {name:"No debatida", value:"nodebatida"},
            {name:"Retirada", value:"retirada"},
            {name:"Convertida en otra", value:"convertida"},
            {name:"Acumulada en otra", value:"acumulada"},
            
        ];
    },
    tipos_helper: function() {
      return [
        "Comparecencias",
        "Convenios internacionales",
        "Creación de comisiones, subcomisiones y ponencias",
        "Interpelación y su respuesta",
        "Moción consecuencia de interpelación y sus enmiendas",
        "Planes, programas y dictámenes",
        "Pregunta oral y su respuesta",
        "Pregunta para respuesta escrita y su respuesta",
        "Proposición de ley y sus enmiendas",
        "Proposición no de ley y sus enmiendas",
        "Proyecto de Ley y sus enmiendas",
        "Real decreto legislativo",
        "Real decreto-ley",
        "Otros actos y sus enmiendas",
      ];
    },
    tips_helper: function() {
        return Random.choice([
            "Una vez hayas escogido un tema, se desplegarán todos sus términos asociados.",
            "Los nombres de l@s diputad@s se auto-completan. Introduce una letra y verás.",
            "La 'referencia' es como el DNI de los actos parlamentarios: es un número único que los identifica.",
            "Escoge un autor de entre los siete Grupos Parlamentarios y el Gobierno.",
            "Escoge de entre los 13 tipos de actos parlamentarios a los que TIPI da seguimiento.",
            "Si has encontrado la información que buscabas no olvides que puedes descargártela gratis.",
            "Si al acceder a la web del Congreso de los Diputados desde TIPI no se carga la página, se soluciona si refrescas el buscador.",
        ]);
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
    autorgrupo_haslink: function(val) {
        return val != 'Gobierno';
    },
    autorgrupo_getlink: function(val) {
        grupo = Grupos.findOne({'nombre': val});
        return '/grupos/'+grupo._id._str;
    },
    autor_getlink: function(val) {
        dip = Diputados.findOne({'nombre': val});
        return '/dips/'+dip._id._str;
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
                                str += '<li><a href="/admin/Iniciativas/ObjectID(&quot;'+ obj._id + '&quot;)/edit"><i class="fa fa-pencil"></i> Editar iniciativa</a></li>';
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
                { key: 'actualizacion', fieldId: 'actualizacion', label: 'Fecha', sortable: true, sortDirection: 'descending', headerClass: 'col-md-1',
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
      //Templating multiselect
      $(document).ready(function() {
          $('#terms').multiselect({
              templates: {
                  button: '<button type="button" title="xxx" class="multiselect dropdown-toggle form-control" data-toggle="dropdown"></button>',
                  ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                  filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                  filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                  li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                  divider: '<li class="multiselect-item divider"></li>',
                  liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
              }
          });
      });
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
    },
});

function movePage(number) {
    Template.instance().currentPage.set(number);
    Session.set('current-page', Template.instance().currentPage.get());
    // Go to top after changing currentPage
    $('body').animate({ scrollTop: 0 }, 0);
}
