Template.home.rendered = function() {
    if (!Session.get('total-initiatives')) {
        Session.set('total-initiatives', Iniciativas.find({}).count());
    }
    data = getOverallStats(5);
    loadChart(data);
}
