Template.profileItem.helpers({
    isCurrent: function(id) {
        if (Meteor.userId() === id)
            return 'current';
        return '';
    }
});