Template.stats.rendered = function() {
    if (!Session.get('total-initiatives')) {
        Session.set('total-initiatives', Iniciativas.find({}).count());
    }
    data = getOverallStats();
    loadChart(data);
    title = Iniciativas.findOne().titulo;
}
