Template.homepage.helpers({
    lastEntry: function() {
        return Meteor.subscribe('blogLastEntry');
    }
})