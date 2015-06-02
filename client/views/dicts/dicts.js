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
            fields: [
                { key: 'dict', label: 'Diccionario', sort: 'ascending'},
				{ key: 'dictgroup', label: 'Grupo'},
				{ key: 'acciones', label: 'Acciones', 
				    fn: function(val, obj) {
					   var actstr = '<a href="/dicts/'+ obj._id + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
					   if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
					       actstr += '<a href=\'/admin/Dicts/'+ obj._id + '/edit\'><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>&nbsp;';
					   }
					   return Spacebars.SafeString(actstr);
				    }
                }
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