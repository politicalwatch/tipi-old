/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (can.editItem(Meteor.user(), myItem)){
  // do something  
}

/+ ---------------------------------------------------- */

can = {
	
  createDict: function (userId, item) {
    return Meteor.user();
  },
  editDict: function (userId, item) {
    return Meteor.user();
  },
  removeDict: function (userId, item) {
    return Meteor.user();
  },

  annotateRef: function () {
    user = Meteor.user()
    if (user) {
      if (Roles.userIsInRole(user, ["admin","manager"])) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  createMeetup: function () {
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