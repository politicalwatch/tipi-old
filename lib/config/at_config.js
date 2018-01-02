Accounts.emailTemplates = {                                                                 
    from: "Tipi Ciudadano <no-reply@tipiciudadano.es>",                                            
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    resetPassword: {
        subject: function subject(user) {
            return "Reiniciar contraseña " + Accounts.emailTemplates.siteName; 
        },
        text: function text(user, url) {
            var greeting = user.profile && user.profile.name ? "Hola " + user.profile.name + "," : "Hola,";
            return greeting + "\n\nYa puedes reiniciar tu contraseña en \n\n" + url + "\n\nGracias.\n";        
        }
    }
}
