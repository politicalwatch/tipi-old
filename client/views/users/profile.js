Template.profile.helpers({
    isEqUser: function (id) {
        if (Meteor.userId() === id)
            return true;
        return false;
    }
})