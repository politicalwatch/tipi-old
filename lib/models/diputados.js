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
    imagen: {
        type: String,
        label: 'Url de la foto',
        optional: true
    },
    url: {
        type: String,
        label: 'Url del Congreso.es',
        optional: true
    },
    correo: {
        type: String,
        label: 'Correo electrónico',
        optional: true
    },
    cargos: {
        type: [String],
        label: 'Cargos parlamentarios',
        optional: true
    },
    twitter: {
        type: String,
        label: 'Twitter (url)',
        optional: true
    },
    activo: {
        type: Boolean,
        label: 'Activo?',
        defaultValue: true
    },
    tipi: {
        type: Boolean,
        label: 'Está en TIPI?'
    }
});


Diputados = new Meteor.Collection('diputados', {'idGeneration': 'MONGO'});

Diputados.attachSchema(Schema.Diputado);
