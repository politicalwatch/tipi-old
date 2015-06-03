Template.meetup.helpers({
    archiveClass: function() {
        var now = new Date();
        meetup_date = Meetups.find().fetch()[0].date;
        if (now >= meetup_date) {
            return 'archive';
        } else {
            return '';
        }
    }
});

Template.meetup.events({
	//
});