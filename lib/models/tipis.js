/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here. 

/+ ---------------------------------------------------- */

Tipis = new Meteor.Collection('tipis');

// Allow/Deny

Tipis.allow({
  insert: function(userId, doc){
    return can.createTipi(userId);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return can.editTipi(userId, doc);
  },
  remove:  function(userId, doc){
    return can.removeTipi(userId, doc);
  }
});

// Methods

Meteor.methods({
  createTipi: function(tipi){
    if(can.createTipi(Meteor.user()))
      Tipis.insert(tipi);
  },
  removeTipi: function(tipi){
    if(can.removeTipi(Meteor.user(), tipi)){
      Tipis.remove(tipi._id);
    }else{
      throw new Meteor.Error(403, 'You do not have the rights to delete this item.')
    }
  }
});
