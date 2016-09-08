Schema = {};

TermSchema = new SimpleSchema({
  term: {
    type: String,
    label: 'Término'
  },
  humanterm: {
    type: String,
    label: 'Término humano'
  },
  shuffle: {
    type: Boolean,
    label: 'Shuffle term?'
  }
});

Schema.Dict = new SimpleSchema({
    group: {
        type: String,
        label: 'Grupo',
    },
    name: {
        type: String,
        label: 'Nombre',
    },
    slug: {
        type: String,
        label: 'Slug (Url corta)',
        optional: true
    },
    description: {
        type: String,
        label: 'Descripción',
        optional: true
    },
    icon1: {
        type: String,
        label: 'Icono1',
        optional: true
    },
    icon2: {
        type: String,
        label: 'Icono2',
        optional: true
    },
    iconb1: {
        type: String,
        label: 'IconoB1',
        optional: true
    },
    iconb2: {
        type: String,
        label: 'IconoB2',
        optional: true
    },
    terms: {
        type: [TermSchema],
        label: 'Expresiones regulares',
        optional: true
    }
});


Dicts = new Meteor.Collection('dicts', {'idGeneration': 'MONGO'});

Dicts.attachSchema(Schema.Dict);
