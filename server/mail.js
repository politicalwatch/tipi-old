Meteor.startup(function() {
    console.log(Meteor.settings.Mandrill.username);
    console.log(Meteor.settings.Mandrill.key);
    return Mandrill.config({
        'username': Meteor.settings.mandrill.username,
        'key': Meteor.settings.mandrill.key
    });
});


Meteor.methods({
    tipiSendEmail: function (to, subject, text) {
        check([to, subject, text], [String]);
        this.unblock();

        Email.send({
            from: 'tipi@ciecode.es',
            to: to,
            subject: subject,
            html: text
        });
    }
});
