Template.meetups.created = function () {
  //
};

Template.meetups.helpers({
	   settings: function () {
        return {
            rowsPerPage: 30,
			bPaginate: false,
            showFilter: false,
			showColumnToggles: false,
            fields: [{ key: 'name', label: 'Nombre', sort: 'descending'},
										 { key: 'description', label: 'Descripcion'},
                                         { key: 'url', label: 'Url'},
										 { key: 'date', label: 'Fecha'},
                                         { key: 'createdBy', label: 'Creado por'},
										 { key: 'acciones', label: 'Acciones', 
										 	fn: function(val, obj) {
												var actstr = '<a href="/meetups/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
												if (Meteor.user()) {
													actstr += 
				'<a href="/meetups/'+ obj._id._str + '/edit"><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>&nbsp;';
												}
												return Spacebars.SafeString(actstr);
											}}
										]
        };
    }
  //
});


Template.meetups.rendered = function () {
  //
};

Template.meetups.events({
	'click #create': function(e) {
		e.preventDefault();
		Router.go('/meetup/new');
	},
  //
});