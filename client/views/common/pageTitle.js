var pagesWithoutTitle = [
    '/',
];

Template.pageTitle.helpers({
    hasTitle: function() {
        // console.log(_.indexOf(pagesWithoutTitle, window.location.pathname));
        // console.log(window.location.pathname);
        if (_.indexOf(pagesWithoutTitle, window.location.pathname) != -1) {
            return false;
        } else {
            return true;
        }
    }
})
