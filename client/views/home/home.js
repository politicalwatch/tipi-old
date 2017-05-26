Template.home.rendered = function() {
    data = getOverallStats(5);
    loadChart(data);
}

Template.home.helpers({
    hasStats: function() {
        return TipiStats.find().count() > 0;
    }
});
