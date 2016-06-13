Template.signup.events = {
  'click button[type=submit]': function(event){
    event.preventDefault();
    var user = {
      username: $('#username').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      password2: $('#password2').val(),
      profile: {
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(),
        bio: '',
        organization: '',
        website: '',
        twitter: '',
        facebook: '',
      },
      roles: ['ciudadano']
    }

    if(!user.username || !user.email || !user.password){
      flash('Please fill in all fields', 'danger');
    } else if (user.password != user.password2) {
      flash('Las contraseñas no coincide', 'danger');
		}else{
      Accounts.createUser(user, function(error){
        if(error){
          flash(error.reason, 'danger');
        }else{
          Router.go('/');
          flash('Gracias por registrarte en TiPi', 'success');
        }
      });
    }
    return false;

  }
};