
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
    nombre_medio: {
        type: String,
        label: 'Medio',
    },
});


News = new Meteor.Collection('news', {'idGeneration': 'MONGO'});

News.attachSchema(Schema.News);
