/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (can.editItem(Meteor.user(), myItem)){
  // do something  
}

/+ ---------------------------------------------------- */

can = {
  createItem: function (userId) {
    return true;
  },
  editItem: function (userId, item) {
    return userId === item.userId;
  },
  removeItem: function (userId, item) {
    return userId === item.userId;
  },
	
  createDict: function (userId, item) {
    return Meteor.user();
  },
  editDict: function (userId, item) {
    return Meteor.user();
  },
  removeDict: function (userId, item) {
    return Meteor.user();
  },

  createRef: function (userId, item) {
    return false;
  },
  annotateRef: function (userId) {
    return userId;
  },
  removeRef: function (userId, item) {
    return false;
  },
	
  createTipi: function (userId) {
    return Meteor.user();
  },
  editTipi: function (userId) {
    return Meteor.user();
  },
  removeTipi: function (userId) {
    return Meteor.user();
  },

  createMeetup: function (userId) {
    return Meteor.user();
  },
  editMeetup: function (userId) {
    // Añadir filtro para administradores
    return Meteor.user();
  },
  removeMeetup: function (userId) {
    // Añadir filtro para administradores
    return Meteor.user();
  },

  updateUser: function(userId) {
    return Meteor.user()._id === userId;
  }

}


// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}