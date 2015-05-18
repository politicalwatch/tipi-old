Schema = {};

Schema.Meetup = new SimpleSchema({
    name: {
        type: String,
        label: 'Nombre',
    },
    description: {
        type: String,
        label: 'Descripcion',
        optional: true
    },
    url: {
        type: String,
        label: 'Url',
        regEx: SimpleSchema.RegEx.Url,
        optional: true,
        autoform: {
          afFieldInput: {
            type: "url"
          }
        }
    },
    date: {
        type: Date,
        autoform: {
          afFieldInput: {
            type: "bootstrap-datetimepicker"
          }
        }
    },
    createdBy: {
        type: String,
        autoform: {
          afFieldInput: {
            type: "hidden"
          }
        }
    },
    active: {
      type: Boolean,
      optional: true
    }
});



Meetups = new Meteor.Collection('meetups', {idGeneration : 'MONGO'});

Meetups.attachSchema(Schema.Meetup);


Meetups.helpers({
    humanDate: function() {
        return moment(this.date).format('LLL');
    }
});


// Allow/Deny

Meetups.allow({
  insert: function(userId, meetup){
    return can.createMeetup(userId);
  }
});

// Methods

Meteor.methods({
  createMeetup: function(meetup){
    if(can.createMeetup(Meteor.user()))
      Meetups.insert(meetup);
  }
});
