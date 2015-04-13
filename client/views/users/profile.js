Template.profile.helpers({
    defaultEmail: function(){
        return Meteor.user().emails[0].address;
    }
})