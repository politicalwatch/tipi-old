Template.profile.helpers({
    isEqUser: function (id) {
        if (Meteor.userId() === id)
            return true;
        return false;
    },
    avatarUrl: function() {
        return (!_.isUndefined(this.profile.avatar)) ? this.profile.avatar : "/images/100x100.png";
    },
    hasPosts: function() {
        return Posts.find().count();
    },
    hasComments: function() {
        return Comments.find().count();
    }
});

var uploader = new Slingshot.Upload("avatarUploads");

Template.profile.events({
    'change #image-input': function(event, template) {
        uploader.send(document.getElementById('image-input').files[0], function (error, downloadUrl) {
            if (error) {
                // Log service detailed response
                var message = 'Error subiendo la imagen. Inténtelo de nuevo.';
                console.error(message);
                alert(message);
            }
            else {
                console.log(downloadUrl);
                Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": downloadUrl}});
            }
        });
    },
    'click .log-out': function () {
        Meteor.logout();
    }
})
