Template.forgot.events = {
  'click button[type=submit]': function(e){
    e.preventDefault();

    var options = {
      email: $('#email').val()
    };

    Accounts.forgotPassword(options, function(error){
      if(error){
        flash(error.reason, "error");
      }else{
        Router.go('/login');
        flash("Password reset link sent!");
      }
    });
    return false;
  }
};