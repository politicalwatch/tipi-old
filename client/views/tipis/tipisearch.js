/* ---------------------------------------------------- +/

## Tipis ##

/+ ---------------------------------------------------- */

Template.tipisearch.helpers({
    alldicts_helper: function() {
        return Dicts.find().fetch();
    },
	lastquery: function() {
		return Session.get("searchTipis");
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
                { key: 'ref', label: 'Referencia'},
                { key: 'titulo', label: 'Titulo'},
                { key: 'fecha', label: 'Fecha',
                    fn: function(val, obj) {
                        return moment(val).format('l');
                     }
                },
                { key: 'dicts', label: 'Diccionarios'},
    			{ key: 'acciones', label: 'Acciones',
                    fn: function(val, obj) {
					    var actstr = '<a href="tipis/'+ obj._id + '"><span class="label label-info"><i class="fa fa-eye"></i></span></a>&nbsp;';
						if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
                            actstr += '&nbsp;<a href="/admin/Tipis/'+ obj._id + '/edit"><span class="label label-warning"><i class="fa fa-pencil"></i></span></a>';
    					}
    					return Spacebars.SafeString(actstr);
    				}
                }
    		]
        };
    }
});


Template.tipisearch.rendered = function () {
  //
};

Template.tipisearch.events({
	'submit form': function(e) { },
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
