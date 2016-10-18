Template.news.helpers({
    news: function() {
        return News.find();
    },
    getDate: function() {
        return moment(this.fecha).format('LL');
    }
});

