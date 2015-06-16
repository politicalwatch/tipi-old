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
                           actstr += '<a class="exportusersbydict" id="'+obj._id+'" href=\'#\'><span class="label label-default"><i class="fa fa-users"></i></span></a>&nbsp;';
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
    'click .exportusersbydict': function(e) {
        dictionary = Dicts.findOne(e.currentTarget.id);
        var collection_data = Meteor.users.find({'profile.dicts': dictionary.dict}, {fields: {username: 1, 'profile.firstname': 1, 'profile.lastname': 1, 'emails': 1}}).fetch();
        var collection_data_mod = [];
        _.each(collection_data, function(col) {
            u = {}
            u['username'] = col.username;
            u['firstname'] = col.profile.firstname;
            u['lastname'] = col.profile.lastname;
            u['email'] = col.emails[0].address;
            collection_data_mod.push(u);
        });
        var data = json2csv(collection_data_mod, true, true);
        var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
        saveAs(blob, dictionary.dict.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') + "_users.csv");
    }
});