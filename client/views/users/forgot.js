Template.forgot.events = {
    'click button[type=submit]': function(e) {
        e.preventDefault();
        var options = {
            email: $('#email').val()
        };
        Accounts.forgotPassword(options, function(error) {
            if(error) {
                flash(error.reason, "danger");
            } else {
                Router.go('/login');
                flash("Correo de recuperación de contraseña enviado!", "info");
            }
        });
        return false;
    }
};
