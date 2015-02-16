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
	
  createDict: function (userId) {
    return Meteor.user();
  },
  editDict: function (userId) {
    return Meteor.user();
  },
  removeDict: function (userId) {
    return Meteor.user();
  },
	
  createTipi: function (userId) {
    return Meteor.user();
  },
  editTipi: function (userId) {
    return Meteor.user();
  },
  removeTipi: function (userId) {
    return Meteor.user();
  }

}