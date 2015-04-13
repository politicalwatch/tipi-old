Schema = {};

Schema.UserProfile = new SimpleSchema({
    'firstname': {
        type: String,
        label: "Nombre"
    },
    'lastname': {
        type: String,
        label: "Apellidos"
    }
});

Schema.User = new SimpleSchema({
    'emails.$.address': {
        type: String,
        label: "Correo electrónico",
        regEx: SimpleSchema.RegEx.Email
    },
    'password': {
      type: String,
      label: "Contraseña",
      min: 6
    },
    'passwordConfirmation': {
      type: String,
      min: 6,
      label: "Confirmar contraseña",
      custom: function() {
        if (this.value !== this.field('password').value) {
          return "passwordMissmatch";
        }
      }
    },
    'profile': {
        type: Schema.UserProfile
    }
});

Meteor.users.attachSchema(Schema.User);




Meteor.users.allow({
  update:  function(userId){
    return can.updateUser(userId);
  }
});