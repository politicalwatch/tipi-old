Template.messages.helpers({
  messages: function () {
    return Messages.find();
  },
  hasMessages: function() {
    return Messages.find().count() != 0;
  }
});

Template.messages.events({
  'click .close': function () {
    Messages.remove({});
  }
});
