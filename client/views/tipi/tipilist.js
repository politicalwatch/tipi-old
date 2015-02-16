/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.tipilist.created = function () {
  //
};

//{numActo: 1, ref: 1, fechaPub: 1, autor: 1, grupoPar: 1, titulo: 1}

Template.tipilist.helpers({
	   settings: function () {
        return {
            rowsPerPage: 30,
						bPaginate: false,
            showFilter: true,
						showColumnToggles: true,
            fields: [{ key: 'numActo', label: 'TiPi', sort: 'descending'},
										 { key: 'ref', label: 'Referencia'},
										 { key: 'autor', label: 'Autor'},
										 { key: 'grupoPar', label: 'GP'},
										 { key: 'titulo', label: 'Titulo'},
										 
										 { key: 'acciones', label: 'Acciones', 
										 	fn: function(val, obj) {
												var actstr = '<a href="tipi/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
												
												if (Meteor.user()) {
													actstr += 
				'<a href="tipi/'+ obj._id._str + '/edit"><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>&nbsp;';
												}
												return Spacebars.SafeString(actstr);
												//return new Spacebars.SafeString('<a href="+Routes.route[\'refs\'].path(obj._id._str)+">Ver</a>');
											}}
										]
        };
    }
  //
});


Template.dicts.rendered = function () {
  //
};

Template.dicts.events({
  //
});