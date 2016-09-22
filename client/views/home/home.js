Template.home.rendered = function() {
    data = getOverallStats(5);
    loadChart(data);
}
