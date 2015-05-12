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
    }
});



Meetups = new Meteor.Collection('meetups', {idGeneration : 'MONGO'});

Meetups.attachSchema(Schema.Meetup);



// Allow/Deny

Meetups.allow({
  insert: function(userId, meetup){
    return can.createMeetup(userId);
  },
  update:  function(userId, meetup, fieldNames, modifier){
    return can.editMeetup(userId, meetup);
  },
  remove:  function(userId, meetup){
    return can.removeMeetup(userId, meetup);
  }
});

// Methods

Meteor.methods({
  createMeetup: function(meetup){
    console.log(meetup);
    if(can.createMeetup(Meteor.user()))
      Meetups.insert(meetup);
  },
  editMeetup: function(meetup){
    if(can.editMeetup(Meteor.user())){
      // add code here
    } else {
      throw new Meteor.Error(403, 'You do not have the rights to edit this item.')
    }
  },
  removeMeetup: function(meetup){
    if(can.removeMeetup(Meteor.user())){
      Meetups.remove(meetup._id);
    } else{
      throw new Meteor.Error(403, 'You do not have the rights to delete this item.')
    }
  }
});
