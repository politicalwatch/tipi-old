/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.items.created = function () {
  //
};

Template.refs.helpers({
	   settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: true,
						showColumnToggles: true,
            fields: [{ key: 'bol', label: 'Bol.', sort: 'descending'},
										 { key: 'ref', label: 'Referencia'},
										 { key: 'fecha', label: 'Fecha'},
										 { key: 'autor', label: 'Autor'},
										 { key: 'texto', label: 'Índice'},
										 { key: 'acciones', label: 'Acciones', 
										 	fn: function(val, obj) {
												return Spacebars.SafeString(
				'<a href="refs/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;' +
				'<a href="refs/'+ obj._id._str + '"><span class="label label-warning"><i class="fa fa-send-o"></i></span></a>&nbsp;' +
				'<a href="http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28' + encodeURIComponent(obj.ref) + '*.NDOC.%29" target="_blank"><span class="label label-info"><i class="fa fa-institution"></i></span>');
												//return new Spacebars.SafeString('<a href="+Routes.route[\'refs\'].path(obj._id._str)+">Ver</a>');
											}}
										]
        };
    }
  //
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29
