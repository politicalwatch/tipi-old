Meteor.startup(function() {
    console.log(Meteor.settings.mandrillUsername);
    console.log(Meteor.settings.mandrillKey);
    return Mandrill.config({
        "username": Meteor.settings.mandrillUsername,
        "key": Meteor.settings.mandrillKey
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
