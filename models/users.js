// Schema = {};

// Schema.UserProfile = new SimpleSchema({
//     'firstname': {
//         type: String,
//         label: "Nombre"
//     },
//     'lastname': {
//         type: String,
//         label: "Apellidos"
//     }
// });

// Schema.User = new SimpleSchema({
//     'username': {
//         type: String,
//         label: "Nombre de usuario"
//     },
//     'emails.$.address': {
//         type: String,
//         label: "Correo electrónico",
//         regEx: SimpleSchema.RegEx.Email
//     },
//     'password': {
//       type: String,
//       label: "Contraseña",
//       min: 6
//     },
//     'passwordConfirmation': {
//       type: String,
//       min: 6,
//       label: "Confirmar contraseña",
//       custom: function() {
//         if (this.value !== this.field('password').value) {
//           return "passwordMissmatch";
//         }
//       }
//     },
//     'profile': {
//         type: Schema.UserProfile
//     }
// });


Schema = {};

Schema.UserProfile = new SimpleSchema({
    firstname: {
        type: String,
        label: 'Nombre',
        optional: true
    },
    lastname: {
        type: String,
        label: 'Apellidos',
        optional: true
    },
    bio: {
        type: String,
        label: 'Bio',
        optional: true
    },
    organization : {
        type: String,
        label: 'Organización',
        regEx: /^[a-z0-9A-z .]{3,30}$/,
        optional: true
    },
    website: {
        type: String,
        label: 'Web',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    twitter: {
        type: String,
        label: 'Twitter',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    facebook: {
        type: String,
        label: 'Facebook',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    }
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        type: [Object],
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: [String],
        optional: true
    }
});

Meteor.users.attachSchema(Schema.User);



Meteor.users.allow({
  update:  function(userId){
    return can.updateUser(userId);
  }
});