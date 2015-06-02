Template.profiles.helpers({
    citizens: function() {
        return Meteor.users.find({roles: {$ne: 'deputy'}, roles: {$ne: 'organization'}, roles: {$ne: 'media'}}, {sort: {username: 1}});
    },
    deputies: function() {
        return Meteor.users.find({roles: 'deputy'}, {sort: {username: 1}});
    },
    organizations: function() {
        return Meteor.users.find({roles: 'organization'}, {sort: {username: 1}});
    },
    media: function() {
        return Meteor.users.find({roles: 'media'}, {sort: {username: 1}});
    }
});