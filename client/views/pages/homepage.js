Template.homepage.helpers({
    lastEntries: function() {
        return Blog.find({},{sort: {date: -1}, limit: 3});
    }
});