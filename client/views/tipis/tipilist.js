/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.tipilist.created = function () {
  //
};

Template.tipilist.helpers({
	lastquery: function() {
		return Session.get("searchRefs");
	},
	   settings: function () {
        return {
            rowsPerPage: 30,
			showColumnToggles: false,
            fields: [{ key: 'ref', label: 'Referencia'},
                                        { key: 'titulo', label: 'Titulo'},
										{ key: 'autor', label: 'Autor',
                                            fn: function(value, obj) {
                                                return obj.getAutor();
                                            }
                                        },
										{ key: 'acciones', label: 'Acciones', 
									       fn: function(val, obj) {
											 var actstr = '<a href="tipis/'+ obj._id._str + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
										      if (Meteor.user()) {
											     actstr += 
				'<a href="tipis/'+ obj._id._str + '/edit"><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>&nbsp;';
											     }
												return Spacebars.SafeString(actstr);
											}}
										]
        };
    }
  //
});


Template.tipilist.rendered = function () {
  //
};

Template.tipilist.events({
	'submit form': function(e) {console.log("Form submitted");},
	'click button.reset': function(e) {Session.set('searchTipis', {});},
	'click button#exportcsv': function(e) {
		var query = Session.get("searchTipis");
		for( var property in query )
			if( query.hasOwnProperty(property) )
				if( query[property] == "" )
					delete query[property];
		var collection_data = Refs.find(query).fetch();
		var data = json2csv(collection_data, true, true);
		var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
		saveAs(blob, "tipis.csv");
	}
  //
});
