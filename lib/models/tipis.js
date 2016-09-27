/* ---------------------------------------------------- +/

## Tipis ##

All code related to the Tipis collection goes here. 

/+ ---------------------------------------------------- */

Schema = {};
/*
Nota: Solo ponemos los campos que queremos
que sean propensos a ser editados
*/
Schema.Tipi = new SimpleSchema({
    titulo: {
        type: String,
        label: 'Título'
    },
    ref: {
        type: String,
        label: 'Referencia',
        optional: true
    },
    tipo: {
        type: String,
        label: 'Tipo',
        optional: true
    },
    tipotexto: {
        type: String,
        label: 'Tipo (humanizado)',
        optional: true
    },
    autor_diputado: {
        type: [String],
        label: 'Autor',
        optional: true
    },
    autor_grupo: {
        type: [String],
        label: 'Grupo',
        optional: true
    },
    autor_otro: {
        type: [String],
        label: 'Otro',
        optional: true
    },
    fecha: {
        type: Date,
        label: 'Fecha',
        optional: true
    },
    lugar: {
        type: String,
        label: 'Lugar',
        optional: true
    },
    url: {
        type: String,
        label: 'Url',
        regEx: SimpleSchema.RegEx.Url,
        optional: true,
        autoform: {
          afFieldInput: {
            type: "url"
          }
        }
    },
    tramitacion: {
        type: String,
        label: 'Trámite',
        optional: true
    },
    dicts: {
        type: [Object],
        label: 'Diccionarios',
        optional: true
    },
    terms: {
        type: [Object],
        label: 'Términos',
        optional: true
    },
    quepasocon: {
        type: String,
        label: '¿Qué paso con...?',
        optional: true
    },
    quepasocon_moreinfo: {
        type: String,
        label: '¿Qué paso con...? (más info)',
        regEx: SimpleSchema.RegEx.Url,
        optional: true,
        autoform: {
          afFieldInput: {
            type: "url"
          }
        }
    },
    original: {
        type: String,
        label: 'Documento original (ID)'
    }
});

Tipis = new Meteor.Collection('tipis', {'idGeneration': 'MONGO'});

Tipis.attachSchema(Schema.Tipi);


/* Helpers */
Tipis.helpers({
    relativeDate: function() {
        return moment(this.fecha).startOf('day').fromNow();
    },
    shortDate: function() {
        return moment(this.fecha).format('l');
    }
});
