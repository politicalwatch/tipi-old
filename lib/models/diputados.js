Schema = {};

Schema.Diputado = new SimpleSchema({
    nombre: {
        type: String,
        label: 'Apellidos, Nombre',
    },
    grupo: {
        type: String,
        label: 'Grupo Parlamentario',
    },
    url: {
        type: String,
        label: 'Url del Congreso.es',
        optional: true
    },
    twitter: {
        type: String,
        label: 'Descripción',
        optional: true
    },
    activo: {
        type: Boolean,
        label: 'Activo?'
    },
    tipi: {
        type: Boolean,
        label: 'Está en TIPI?'
    }
});


Diputados = new Meteor.Collection('diputados');

Diputados.attachSchema(Schema.Diputado);