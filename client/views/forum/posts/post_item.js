Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  topics: function() {
    p = Posts.find({}, {fields: {topics: 1}}).fetch();
    return p[0].topics;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-secondary upvotable';
    }
    else {
        // return 'disabled';
        return 'btn-secondary upvotable';
    }
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    console.log("Enter...");
    if (Meteor.user()) {
        Meteor.call('upvote', this._id);
    } else {
        Router.go('login');
    }
  }
});