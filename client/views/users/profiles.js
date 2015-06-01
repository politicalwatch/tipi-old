Template.profiles.helpers({
    citizens: function () {
        return Meteor.users.find({roles: {$ne: 'deputy'}, roles: {$ne: 'organization'}}, {sort: {username: 1}});
    },
    deputies: function () {
        return Meteor.users.find({roles: 'deputy'}, {sort: {username: 1}});
    },
    organizations: function () {
        return Meteor.users.find({roles: 'organization'}, {sort: {username: 1}});
    }
})