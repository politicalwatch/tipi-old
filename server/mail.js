Meteor.startup(function() {
    return Meteor.Mandrill.config({
        username: "tipi@ciecode.es",
        key: "8U6BZmsWlIIIYICTIbAXBg"
    });
});


Meteor.methods({
    tipiSendEmail: function (from, to, subject, text) {
        check([from, to, subject, text], [String]);
        this.unblock();

        Meteor.Mandrill.send({
            from: from,
            to: to,
            subject: subject,
            html: text
        });
    }
});