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
  },
  addMeetupForm: {
    onSubmit: function (doc) {
        schemas.MeetupSchema.clean(doc);
        this.done();
        return false;
    },
    onSuccess:function(operation, result, template){
        flash('Evento enviado correctamente', 'success');
        Router.go('meetups');
    },
    onError: function(operation, error, template) {
        flash(error.toString(), 'warning');
    }
  }
});