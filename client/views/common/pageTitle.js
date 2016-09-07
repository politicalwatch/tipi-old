var pagesWithoutTitle = [
    '/',
];

Template.pageTitle.helpers({
    hasTitle: function() {
        if (_.indexOf(pagesWithoutTitle, window.location.pathname) != -1) {
            return false;
        } else {
            return true;
        }
    }
})
