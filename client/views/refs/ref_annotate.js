Template.refAnnotate.helpers({
    // add some code here...
});

Template.refAnnotate.events({
    'click #back': function(e) {
        e.preventDefault();
        history.back();
    },
});