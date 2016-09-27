AutoForm.hooks({
  editProfileForm: {
    onSubmit: function (doc) {
        schemas.User.clean(doc);
        this.done();
        return false;
    },
    onSuccess:function(operation, result, template){
        flash('Perfil actualizado', 'success');
        Router.go('profile');
    },
    onError: function(operation, error, template) {
        flash(error.toString(), 'warning');
    }
  }
});
