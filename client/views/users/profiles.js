Template.profiles.helpers({
    citizens: function() {
        return Meteor.users.find({roles: {$ne: 'deputy'}, roles: {$ne: 'organization'}, roles: {$ne: 'media'}}, {sort: {username: 1}});
    },
    deputies: function() {
        deps = Meteor.users.find({roles: 'deputy'}, {sort: {username: 1}}).fetch();
        return (deps) ? deps : [];
    },
    organizations: function() {
        return Meteor.users.find({roles: 'organization'}, {sort: {username: 1}});
    },
    media: function() {
        return Meteor.users.find({roles: 'media'}, {sort: {username: 1}});
    },
    content_deputies: function() {
        return Diputados.find();
    },
    isInactive: function() {
        return (this.activo) ? "" : "inactive";
    },
    humanizedGroup: function(val) {
        return parliamentarygroups[val];
    },
    linkToTwitter: function(val) {
        return "https://twitter.com/" + val.substring(1,val.length);
    }
});