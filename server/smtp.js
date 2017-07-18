import { Meteor } from 'meteor/meteor';
import { Sparkpost } from 'meteor/agoldman:sparkpost-mail';

Meteor.startup(() => {
    // configure Sparkpost
    Sparkpost.config('');

    // Send an email
});