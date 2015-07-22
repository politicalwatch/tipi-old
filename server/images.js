Slingshot.createDirective("avatarUploads", Slingshot.S3Storage, {
    bucket: "tipimedia",
    acl: "public-read",
    authorize: function () {
        // Deny uploads if user is not logged in.
        if (!this.userId) {
            var message = "Please login before posting files";
            throw new Meteor.Error("Login Required", message);
        }
        return true;
    },
    key: function (file) {
        // Store file into a directory by the user's username.
        var user = Meteor.users.findOne(this.userId);
        return "avatar/" + Date.now() + "_" + file.name;
    }
});

Slingshot.createDirective("blogUploads", Slingshot.S3Storage, {
    bucket: "tipimedia",
    acl: "public-read",
    authorize: function () {
        // Deny uploads if user is not logged in.
        if (!this.userId) {
            var message = "Please login before posting files";
            throw new Meteor.Error("Login Required", message);
        }
        return true;
    },
    key: function (file) {
        // Store file into a directory by the user's username.
        var user = Meteor.users.findOne(this.userId);
        return "blog/" + Date.now() + "_" + file.name;
    }
});
