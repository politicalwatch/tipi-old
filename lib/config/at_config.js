Accounts.emailTemplates = {                                                                 
    from: "Tipi Ciudadano <no-reply@tipiciudadano.es>",                                            
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

    resetPassword: {
        subject: function subject(user) {
            return "Reiniciar contraseña en TiPi Ciudadano"; 
        },
        text: function text(user, url) {
            var greeting = user.profile && user.profile.name ? "Hola " + user.profile.name + "," : "Hola,";
            url = Meteor.settings.url + '/#' + url.split('#')[1]
            return greeting + "\n\nYa puedes reiniciar tu contraseña en \n\n" + url + "\n\nGracias.\n";        
        }
    }

}
