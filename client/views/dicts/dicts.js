/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.dicts.created = function () {
  //
};

Template.dicts.helpers({
	   settings: function () {
        return {
            rowsPerPage: 30,
			bPaginate: false,
            showFilter: false,
			showColumnToggles: false,
            fields: [{ key: 'dictgroup', label: 'Grupo', sort: 'descending'},
										 { key: 'dict', label: 'Diccionario'},
										 { key: 'lastUpdate', label: 'Actualizado'},
										 { key: 'acciones', label: 'Acciones', 
										 	fn: function(val, obj) {
												var actstr = '<a href="/dicts/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
												if (Meteor.user()) {
													actstr += 
				'<a href="/dicts/'+ obj._id._str + '/edit"><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>&nbsp;';
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
	'click #create': function(e) {
		e.preventDefault();
		Router.go('/dicts/new');
	},
  //
});