Template.banners.helpers({
    featuredbanners: function() {
        return Banners.find({destacado: true},{sort: {ancho: -1}});
    },
    nonfeaturedbanners: function() {
        return Banners.find({destacado: false},{sort: {ancho: -1}});
    },
    autobanners: function() {
        // Template is prepared to support two autobanners
        // without breaking the styles (6 columns each)
        stats = TipiStats.findOne();
        autos = [];
        randomdict = Math.floor(Math.random() * stats.bydeputies.length);
        autos.push(getBannerByStats(stats, randomdict));
        randomdict = (randomdict + Math.floor(Math.random() * (stats.bydeputies.length-1))) % stats.bydeputies.length;
        autos.push(getBannerByStats(stats, randomdict));
        return autos;
    }
});

function getBannerByStats(stats, index) {
    return {
        dict: stats.bydeputies[index]._id,
        deputy: stats.bydeputies[index].deputies[0]._id
    };
}
