
Schema = {};

Schema.News = new SimpleSchema({
    titulo: {
        type: String,
        label: 'Título',
    },
    url: {
        type: String,
        label: 'Url',
    },
    medio: {
        type: String,
        label: 'Medio',
    },
    fecha: {
        type: Date,
        label: 'Fecha (yyyy-mm-dd)',
    },
});


News = new Meteor.Collection('news', {'idGeneration': 'MONGO'});

News.attachSchema(Schema.News);
