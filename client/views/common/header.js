Template.header.helpers({
  // messages: function () {
  //   return Messages.find();
  // },
  // hasMessages: function() {
  //   return Messages.count() != 0;
  // },
  isLoggedIn: function () {
    return !!Meteor.user();
  }
})

Template.header.events({
  'click .log-out': function () {
    Meteor.logout();
  },
  'click .close': function () {
    // Messages.remove({});
  }
})