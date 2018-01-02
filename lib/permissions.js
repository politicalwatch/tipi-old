/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (can.editItem(Meteor.user(), myItem)){
  // do something  
}

/+ ---------------------------------------------------- */

can = {	
    updateUser: function(userId) {
        return Meteor.user()._id === userId;
    },
    removeUser: function(userId) {
        return Meteor.user()._id === userId;
    }
}
