/* ---------------------------------------------------- +/

## Referencias ##

All code related to the Refs collection goes here. 

/+ ---------------------------------------------------- */

Schema = {};
/*
Nota: Solo ponemos los campos que queremos
que sean propensos a ser editados
*/
Schema.Ref = new SimpleSchema({
    titulo: {
        type: String,
        label: 'Título (original)',
        optional: true
    },
    dicts: {
        type: [String],
        label: 'Diccionarios',
        optional: true
    },
    terms: {
        type: [String],
        label: 'Términos',
        optional: true
    },
    annotate: {
        type: Boolean,
        label: 'Anotado?',
        optional: true
    },
    is_tipi: {
        type: Boolean,
        label: 'Es TIPI?',
        optional: true
    },
    invisible: {
        type: Boolean,
        label: "Invisible?",
        optional: true
    }
});


Refs = new Meteor.Collection('referencias', {'idGeneration': 'MONGO'});

Refs.attachSchema(Schema.Ref);


/* Clean data funcions */

function cleanBol(el) {
    if (typeof el.bol !== 'undefined') {
        if (typeof el.bol.bol !== 'undefined') {return el.bol.bol;
        } else {
            return el.bol;
        }
    } else {
        return '';
    }
}
function cleanTramite(el) {
    if (typeof el.tramite !== 'undefined') {
        if (typeof el.tramite.tramite !== 'undefined') {
            return el.tramite.tramite;
        } else {
            return el.tramite;
        }
    } else {
        return '';
    }
}
function cleanUrl(el) {
    if (typeof el.url !== 'undefined') {
        if (typeof el.url.url !== 'undefined') {return el.url.url;
        } else {
            // If it has more than one url, it returns just one
            if (Array.isArray(el.url)) {
                return el.url[0];
            } else {
                return el.url;
            }
        }
    } else {
        return '';
    }
}
function parseAutorDiputado(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.diputado !== 'undefined') && (el.autor.diputado != '')) {
            if (Array.isArray(el.autor.diputado)) {
                els = [];
                _.each(el.autor.diputado, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.diputado];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorGrupo(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.grupo !== 'undefined') && (el.autor.grupo != '')) {
            if (Array.isArray(el.autor.grupo)) {
                els = [];
                _.each(el.autor.grupo, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.grupo];
            }
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorOtro(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.otro !== 'undefined') && (el.autor.otro != '')) {
            if (Array.isArray(el.autor.otro)) {
                els = [];
                _.each(el.autor.otro, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.otro];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}




/* Helpers */
Refs.helpers({
    relativeDate: function() {
        return moment(this.fecha).startOf('day').fromNow();
    },
    shortDate: function() {
        return moment(this.fecha).format('l');
    },
    getAutor: function() {
        if (!_.isUndefined(this.autor)) {
            if ((!_.isUndefined(this.autor.otro)) && (this.autor.otro != '')) {return this.autor.otro;}
            else if ((!_.isUndefined(this.autor.grupo)) && (this.autor.grupo != '')) {return parliamentarygroups[this.autor.grupo];}
            else if ((!_.isUndefined(this.autor.diputado)) && (this.autor.diputado != '')) {return this.autor.diputado;}
            else {
              return '';
            }
        } else {
          return '';
        }
    },
    getBol: function () {
        return cleanBol(this);
    },
    getGrupo: function() {
        if (typeof this.autor !== 'undefined') {
            if (typeof this.autor.grupo !== 'undefined') {return this.autor.grupo;}
            else {return '';}
        }
    },
    getTramite: function() {
        return cleanTramite(this);
    },
    getUrl: function() {
        return cleanUrl(this);
    }
});
