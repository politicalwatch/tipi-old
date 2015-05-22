Schema = {};

Schema.Dict = new SimpleSchema({
    dictgroup: {
        type: String,
        label: 'Grupo',
    },
    dict: {
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
    words: {
        type: [String],
        label: 'Expresiones regulares',
        optional: true
    }
});


Dicts = new Meteor.Collection('dicts');

Dicts.attachSchema(Schema.Dict);

// Allow/Deny

Dicts.allow({
  insert: function(userId){
    return can.createDict(userId);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return can.editDict(userId, doc);
  },
  remove:  function(userId, doc){
    return can.removeDict(userId, doc);
  }
});

// Methods

Meteor.methods({
  createDict: function(dict){
    if(can.createDict(Meteor.user()))
      Dicts.insert(dict);
  },
  removeDict: function(dict){
    if(can.removeDict(Meteor.user(), dict)){
      Dicts.remove(dict._id);
    } else {
      throw new Meteor.Error(403, 'You do not have the rights to delete this item.')
    }
  },
  editDict: function(dict){
    if(can.editDict(Meteor.user(), dict)){
      //Dicts.remove(dict._id);
    } else {
      throw new Meteor.Error(403, 'You do not have the rights to edit this item.')
    }
  }
});
