
Schema = {};

Schema.Banner = new SimpleSchema({
    titulo: {
        type: String,
        label: 'Título',
    },
    url: {
        type: String,
        label: 'Url',
    },
    ancho: {
        type: Number,
        label: 'Ancho (12=grande, 6=mediano, 3=pequeño)',
        allowedValues: [12, 6, 3],
        defaultValue: 12
    },
    destacado: {
        type: Boolean,
        label: 'Destacado?',
        defaultValue: false
    },
    activo: {
        type: Boolean,
        label: 'Activo?',
        defaultValue: true
    }
});


Banners = new Meteor.Collection('banners', {'idGeneration': 'MONGO'});

Banners.attachSchema(Schema.Banner);
