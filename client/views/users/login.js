Template.login.events = {
  'click button[type=submit]': function(event){
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    Meteor.loginWithPassword(username, password, function(error){
      if(error){
        flash(error.reason, 'danger');
      }else{
        Router.go('/profile/' + username);
        flash('Ya estás dentro de TiPi', 'success');
      }
    });
    return false;
  }
};