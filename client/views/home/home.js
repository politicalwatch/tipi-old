Template.home.rendered = function() {
    if (!Session.get('total-initiatives')) {
        Session.set('total-initiatives', Iniciativas.find({}).count());
    }
    data = getOverallStats(5);
    loadChart(data);
}

Template.home.helpers({
    hasStats: function() {
        return TipiStats.find().count() > 0;
    }
});
