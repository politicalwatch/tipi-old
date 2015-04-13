AutoForm.hooks({
  editProfileForm: {
    onSubmit: function (doc) {
        console.log(doc);
        console.log(this);
        schemas.User.clean(doc);
        this.done();
        return false;
    },
    onSuccess:function(operation, result, template){
        Router.go('profile');
    },
    onError: function(operation, error, template) {
        flash(error, 'warning');
        console.log(operation,error);
    }
  }
});