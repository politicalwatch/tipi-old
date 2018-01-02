import { Meteor } from 'meteor/meteor';
import { Sparkpost } from 'meteor/agoldman:sparkpost-mail';

Meteor.startup(() => {
    Sparkpost.config(Meteor.settings.public.sparkpost);
});
