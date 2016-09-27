Template.stats.rendered = function() {
    if (!Session.get('total-initiatives')) {
        Session.set('total-initiatives', Iniciativas.find({}).count());
    }
    data = getOverallStats();
    loadChart(data);
    title = Iniciativas.findOne().titulo;
}

Template.stats.helpers({
    shareData: function() {
        return {title: "¿De que se habla en el @Congreso_es?", author: Meteor.settings.public.twitter_account, url: window.location.href}
    }
});
