/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.refsearch.helpers({
		alldicts_helper: function() {
			return Dicts.find().fetch();
		},
		lastquery: function() {
			return Session.get("searchRefs");
		},
		count: function() {
			if (this.count >= 300) flash("Se han encontrado más de 300 iniciativas.", "info");
			else if (this.count == 0) flash("No se han encontrado iniciativas que cumplan los criterios.", "info");
		},
	   settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: false,
			showColumnToggles: false,
            fields: [{ key: 'bol', label: 'Bol.', sort: 'descending'},
										 { key: 'ref', label: 'Referencia'},
										 { key: 'fecha', label: 'Fecha',
										 	fn: function(val, obj) {
												return moment(val).format('l') + ', ' + moment(val).fromNow();
										 	}
										 },
										 { key: 'autor', label: 'Autor',
										 	fn: function(val, obj) {
										 		return getAutor(val);
										 	}
										 },
										 { key: 'titulo', label: 'Título'},
										 { key: 'dicts', label: 'Diccionarios'},
										 { key: 'acciones', label: 'Acciones', 
										 	fn: function(val, obj) {
												return Spacebars.SafeString(
				'<a href="refs/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;<a href="refs/'+ obj._id._str + '/annotate"><span class="label label-info"><i class="fa fa-tag"></i></span></a>&nbsp;' +
				'<a href="http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(obj.ref) + '%29.ALL." target="_blank"><span class="label label-info"><i class="fa fa-institution"></i></span>');
												//return new Spacebars.SafeString('<a href="+Routes.route[\'refs\'].path(obj._id._str)+">Ver</a>');
											}}
										]
        };
    }
  //
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29


Template.refsearch.rendered = function (a) {
	if(!this._rendered) {
		this._rendered = true;
		$("#fechadesde").datepicker();
		$("#fechahasta").datepicker();
		// setup select
	}
};

Template.refsearch.events({
	'submit form': function(e) {console.log("Form submitted");},
	'click button.reset': function(e) {Session.set('searchRefs', {});},
	'click button#exportcsv': function(e) {
		var query = Session.get("searchRefs");
		for( var property in query )
			if( query.hasOwnProperty(property) )
				if( query[property] == "" )
					delete query[property];
		var collection_data = Refs.find(query).fetch();
		var data = json2csv(collection_data, true, true);
		var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
		saveAs(blob, "refs.csv");
	}
  //
});

function getAutor(autor) {
	if (typeof autor !== 'undefined') {
		if (typeof autor.grupo !== 'undefined') {return autor.grupo;}
		else if (typeof autor.diputado !== 'undefined') {return autor.diputado;}
		else if (typeof autor.otro !== 'undefined') {return autor.otro;}
		else {return '';}
	}
}
