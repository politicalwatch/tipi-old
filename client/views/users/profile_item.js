Template.profileItem.helpers({
    isCurrent: function(id) {
        if (Meteor.userId() === id)
            return 'current';
        return '';
    },
    avatarUrl: function() {
        return (!_.isUndefined(this.profile.avatar)) ? this.profile.avatar : "/images/100x100.png";
    },
});