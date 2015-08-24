/* ---------------------------------------------------- +/

## References ##

/+ ---------------------------------------------------- */

Template.refsearch.helpers({
	alldicts_helper: function() {
		return Dicts.find().fetch();
	},
	tipoautor_helper: function() {
		return [
			{'value': 'diputado', 'text': 'Diputado/a'},
	        {'value': 'grupo', 'text': 'Grupo'},
	        {'value': 'otro', 'text': 'Otro'}
		];
	},
	origen_helper: function() {
		return [
			{'value': 'serieA', 'text': 'Serie A'},
	        {'value': 'serieB', 'text': 'Serie B'},
	        {'value': 'serieD', 'text': 'Serie D'},
	        {'value': 'diariosC', 'text': 'Diarios (Comisiones)'},
	        {'value': 'diariosPD', 'text': 'Diarios (Plenos y Diputación permanente)'}
		];
	},
	lastquery: function() {
		return Session.get("searchRefs");
	},
	count: function() {
		if (this.count >= 20) flash("Se han encontrado más de 20 iniciativas.", "info");
		else if (this.count == 0) flash("No se han encontrado iniciativas que cumplan los criterios.", "info");
	},
   	settings: function () {
          return {
            rowsPerPage: 30,
            showFilter: false,
			showColumnToggles: false,
            fields: [
            	                { key: 'bol', label: 'Bol.', sort: 'descending',
            		          fn: function(val, obj) {
            			    return obj.getBol();
            		          }
            	                },
				{ key: 'ref', label: 'Referencia'},
				{ key: 'titulo', label: 'Título'},
                                { key: 'autor_mixed', label: 'Autor',
                                        fn: function(val, obj) {
                                          return obj.getAutor();
                                        }
                                },
				{ key: 'dicts', label: 'Diccionarios'},
				{ key: 'fecha', label: 'Fecha',
					fn: function(val, obj) {
						return moment(val).format('l');
					}
				},
				{ key: 'acciones', label: 'Acciones', 
				  fn: function(val, obj) {
				    actstr = '';
	  			    actstr += '<a href="refs/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>';
				    // actstr += '&nbsp;<a href="refs/'+ obj._id._str + '/annotate"><span class="label label-info"><i class="fa fa-tag"></i></span></a>';
				    actstr += '&nbsp;<a href="http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(obj.ref) + '%29.ALL." target="_blank"><span class="label label-info"><i class="fa fa-institution"></i></span></a>';
				    if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
                                      if (obj.is_tipi) {
				        actstr += '&nbsp;<span class="label label-warning"><i class="fa fa-check"></i></span>';
                                      } else {
                                        if (obj.annotate) {
                                          var icon = "bookmark";
                                          var message = "Marcarlo para volver a ser etiquetada";
                                        } else {
                                          var icon = "bookmark-o";
                                          var message = "Pendiente de etiquetado";
                                        }
				        actstr += '&nbsp;<a class="unmark" title="'+message+'" href="#" data-id="'+obj._id._str+'"><span class="label label-warning"><i class="fa fa-'+icon+'"></i></span></a>';
				        actstr += '&nbsp;<a class="copytotipi" title="Copiar a Tipi" href="#" data-id="'+obj._id._str+'"><span class="label label-success"><i class="fa fa-copy"></i></span></a>';
                                      }
                                    }
				    return Spacebars.SafeString(actstr);
				  }
				}
		  ]
          };
	}
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29


Template.refsearch.rendered = function (a) {
	if(!this._rendered) {
		this._rendered = true;
		$("#fechadesde").datepicker(datepickeroptions);
		$("#fechahasta").datepicker(datepickeroptions);
	}
};

Template.refsearch.events({
	'submit form': function(e) {},
        'click .unmark': function(e) {
	  e.preventDefault();
          var oid = new Mongo.ObjectID(e.currentTarget.attributes[0].value);
          ref = Refs.findOne(oid);
          if (ref.annotate) {
            if (!ref.is_tipi) {
	      Meteor.call('unmarkRef', oid, function(error, result){
                if (result > 0) {
      	          flash('Referencia lista para volver a ser etiquetada.', 'info');
                  e.currentTarget.innerHTML = Spacebars.SafeString('<span class="label label-warning"><i class="fa fa-bookmark-o"></i></span>');
                }
    	      });
            }
          }
        },
        'click .copytotipi': function(e) {
          e.preventDefault();
          var oid = new Mongo.ObjectID(e.currentTarget.attributes[0].value);
          ref = Refs.findOne(oid);
          if (!ref.is_tipi) {
            Meteor.call('copyToTipi', oid, function(error, result){
              if (result > 0) {
                flash('Referencia copiada a Tipi.', 'info');
                e.currentTarget.innerHTML = Spacebars.SafeString('');
              }
            });
          }
        },
	'click button#exportcsv': function(e) {
		var query = Session.get("searchRefs");
		
		var collection_data = Refs.find(cleanRefQuery(query)).fetch();
		var data = json2csv(collection_data, true, true);
		var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
		saveAs(blob, "refs.csv");
	}
});
