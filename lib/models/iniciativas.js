/* ---------------------------------------------------- +/

## Iniciativas ##

/+ ---------------------------------------------------- */

Schema = {};
/*
Nota: Solo ponemos los campos que queremos
que sean propensos a ser editados
*/
Schema.Iniciativa = new SimpleSchema({
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
    contenido: {
        type: [String],
        label: 'Contenido',
        optional: true
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
    annotate: {
        type: [Object],
        label: 'Anotaciones',
        optional: true
    }
});


Iniciativas = new Meteor.Collection('iniciativas', {'idGeneration': 'MONGO'});

Iniciativas.attachSchema(Schema.Iniciativa);


/* Helpers */
Iniciativas.helpers({
    relativeDate: function() {
        return moment(this.fecha).startOf('day').fromNow();
    },
    shortDate: function() {
        return moment(this.fecha).format('l');
    }
});
