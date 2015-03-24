Template.blogListLayout.helpers({
    blogname: function() {
        return Meteor.settings.public.blog.name;
    },
    blogdescription: function() {
        return Meteor.settings.public.blog.description;
    }
})

Template.blogPostLayout.helpers({
    blogname: function() {
        return Meteor.settings.public.blog.name;
    },
    blogdescription: function() {
        return Meteor.settings.public.blog.description;
    }
})