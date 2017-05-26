Template.stats.rendered = function() {
    data = getOverallStats();
    loadChart(data);
}

Template.stats.helpers({
    hasStats: function() {
        return TipiStats.find().count() > 0;
    },
    shareData: function() {
        return {title: "¿De que se habla en el @Congreso_es?", author: Meteor.settings.public.twitter_account, url: window.location.href}
    }
});
