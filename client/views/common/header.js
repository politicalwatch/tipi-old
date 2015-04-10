Template.header.helpers({
  // messages: function () {
  //   return Messages.find();
  // },
  // hasMessages: function() {
  //   return Messages.count() != 0;
  // },
  isLoggedIn: function () {
    return !!Meteor.user();
  },
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });
    
    return active && 'active';
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