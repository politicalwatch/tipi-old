Template.forgot.events = {
  'click button[type=submit]': function(e){
    e.preventDefault();

    var options = {
      email: $('#email').val()
    };
    Accounts.forgotPassword(options, function(error){
      if(error){
        flash(error.reason, "danger");
      }else{
        Router.go('/login');
        flash("Correo de recuperación de contraseña enviado!", "info");
      }
    });
    return false;
  },
'click button[type=delete]': function(e){
    e.preventDefault();
    Meteor.users.remove({ _id: this._id }, function (error, result) {
    if (error) {
      console.log("Error removing user: ", error);
    } else {
      console.log("Number of users removed: " + result);
    }
  })
  }  
};