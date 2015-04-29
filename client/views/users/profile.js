Template.profile.helpers({
    defaultEmail: function(){
        return Meteor.user().emails[0].address;
    },
    isEqUser: function (id) {
        if (Meteor.userId() === id)
            return true;
        return false;
    }
})