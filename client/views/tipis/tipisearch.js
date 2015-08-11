/* ---------------------------------------------------- +/

## Tipis ##

/+ ---------------------------------------------------- */

Template.tipisearch.helpers({
    alldicts_helper: function() {
        return Dicts.find().fetch();
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
    origen_helper: function() {
        return [
            {'value': 'serieA', 'text': 'Serie A'},
            {'value': 'serieB', 'text': 'Serie B'},
            {'value': 'serieD', 'text': 'Serie D'},
            {'value': 'diariosC', 'text': 'Diarios (Comisiones)'},
            {'value': 'diariosPD', 'text': 'Diarios (Plenos y Diputación permanente)'}
        ];
    },
    grupootro_helper: function() {
        return [
            {'value': 'Gobierno', 'text': 'Gobierno'},
            {'value': 'GP', 'text': 'G.P. Popular'},
            {'value': 'GS', 'text': 'G.P. Socialista'},
            {'value': 'GC-CiU', 'text': 'Grupo Catalán (CiU)'},
            {'value': 'GIP', 'text': 'G.P. La Izquierda Plural'},
            {'value': 'GUPyD', 'text': 'G.P. UPyD'},
            {'value': 'GV (EAJ-PNV)', 'text': 'G.P. Vasco (EAJ-PNV)'},
            {'value': 'GMx', 'text': 'G.P. Mixto'}
        ];    
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
                { key: 'autor_mixed', label: 'Autor',
                        fn: function(val, obj) {
                          return (obj.autor_otro.length > 0) ? obj.autor_otro : (obj.autor_grupo.length > 0) ? parliamentarygroups[obj.autor_grupo] : (obj.autor_diputado) ? obj.autor_diputado : '';
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
    if(!this._rendered) {
        this._rendered = true;
        $("#fechadesde").datepicker(datepickeroptions);
        $("#fechahasta").datepicker(datepickeroptions);
    }
};

Template.tipisearch.events({
	'submit form': function(e) { },
	'click button#exportcsv': function(e) {
		var query = Session.get("searchTipis");
		var collection_data = Tipis.find(cleanTipiQuery(query)).fetch();
		var data = json2csv(collection_data, true, true);
		var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
		saveAs(blob, "tipis.csv");
	}
});
