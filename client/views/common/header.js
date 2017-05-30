Template.header.helpers({
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
});

Template.header.events({
    'click .logout': function() {
        Meteor.logout();
        $('#main-menu').collapse('hide');

    }
});
