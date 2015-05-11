AutoForm.hooks({
  editProfileForm: {
    onSubmit: function (doc) {
        schemas.User.clean(doc);
        this.done();
        return false;
    },
    onSuccess:function(operation, result, template){
        Router.go('profile');
    },
    onError: function(operation, error, template) {
        flash(error, 'warning');
    }
  },
  addMeetupForm: {
    onSubmit: function (doc) {
        console.log(doc);
        console.log(this);
        schemas.MeetupSchema.clean(doc);
        this.done();
        return false;
    },
    onSuccess:function(operation, result, template){
        Router.go('meetups');
    },
    onError: function(operation, error, template) {
        flash(error, 'warning');
    }
  }
});