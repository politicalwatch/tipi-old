/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here. 

/+ ---------------------------------------------------- */

Dicts = new Meteor.Collection('dicts', {idGeneration : 'MONGO'});

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
