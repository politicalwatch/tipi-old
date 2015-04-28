/* ---------------------------------------------------- +/

## Public Tipis ##

/+ ---------------------------------------------------- */

Template.scannertext.helpers({
    alldicts_helper: function() {
        return Dicts.find().fetch();
    },
    lastquery: function() {
        return Session.get("scannerText");
    },
    count: function() {
        if (this.count >= 100) flash("Se han encontrado más de 100 iniciativas.", "info");
        else if (this.count == 0) flash("No se han encontrado iniciativas que cumplan los criterios.", "info");
    },
    settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: false,
            showColumnToggles: false,
            fields: [{ key: 'titulo', label: 'Titulo', headerClass: 'col-md-6',
                                            fn: function(val, obj) {
                                                return Spacebars.SafeString('<a href="/t/'+ obj._id._str + '">'+val+'</a>');
                                            }
                                        },
                                        { key: 'fecha', label: 'Fecha', headerClass: 'col-md-2',
                                            fn: function(val, obj) {
                                                // return obj.relativeDate();
                                                return moment(val).format('l');
                                            }
                                        },
                                        { key: 'autor', label: 'Autor', headerClass: 'col-md-2',
                                            fn: function(value, obj) {
                                                return obj.getTipiAutor();
                                            }
                                        },
                                        { key: 'grupo', label: 'Grupo', headerClass: 'col-md-2',
                                            fn: function(value, obj) {
                                                return obj.getGrupo();
                                            }
                                        }]
        };
    }
});


Template.scannertext.rendered = function () {
  if(!this._rendered) {
    this._rendered = true;
    $("#fechadesde").datepicker();
    $("#fechahasta").datepicker();
    // setup select
  }
};

Template.scannertext.events({
    'submit form': function(e) { }
    // 'click .reset': function(e) { console.log("reiniciando formulario..."); Session.set('scannerText', {}); }
});
