Template.profile.helpers({
    isEqUser: function (id) {
        if (Meteor.userId() === id)
            return true;
        return false;
    },
    hasPosts: function() {
        return Posts.find().count();
    },
    hasComments: function() {
        return Comments.find().count();
    }
})