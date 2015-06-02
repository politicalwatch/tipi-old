/* Stats utils function */
function sortcountfunction(a, b) {
    if (a.count >= b.count) {
        return -1;
    } else {
        return 1;
    }
}
function sortbydatefunction(a, b) {
    if (a.fecha >= b.fecha) {
        return -1;
    } else {
        return 1;
    }
}


SyncedCron.add({
    name: 'Global TIPI Stats',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 8 hours');
    },
    job: function() {
        // Initialized
        TipiStats.remove({});
        dicts = Dicts.find({dictgroup: 'tipi'}, {fields: {dict: 1}}).fetch();
        s = {}
        var date = new Date();

        // Overall
        pipeline = [ { $match: {} }, { $unwind: '$dicts' }, { $group: { _id: '$dicts', count: { $sum: 1 } } } ];
        stats = Tipis.aggregate(pipeline);
        s['overall'] = [];
        for(i=0;i<stats.length;i++) {
            s['overall'].push(stats[i]);
        }

        // By deputies
        s['bydeputies'] = [];
        for(i=0;i<dicts.length;i++) {
            pipeline = [ { $match: {dicts: dicts[i].dict} }, { $unwind: '$autor_diputado' }, { $group: { _id: '$autor_diputado', count: { $sum: 1 } } } ];
            statsbydeputies = Tipis.aggregate(pipeline);
            if (statsbydeputies.length > 0) {
                subdoc = {}
                subdoc['_id'] = dicts[i].dict;
                statsbydeputies.sort(sortcountfunction);
                subdoc['deputies'] = statsbydeputies.filter(function(d,i){ return ((d._id != null) && (d._id != '')) }).filter(function(d,i){ return i<3; });
                s['bydeputies'].push(subdoc);
            }
        }

        // By groups
        s['bygroups'] = [];
        for(i=0;i<dicts.length;i++) {
            pipeline = [ { $match: {dicts: dicts[i].dict} }, { $unwind: '$autor_grupo' }, { $group: { _id: '$autor_grupo', count: { $sum: 1 } } } ];
            statsbygroups = Tipis.aggregate(pipeline);
            if (statsbygroups.length > 0) {
                subdoc = {}
                subdoc['_id'] = dicts[i].dict;
                statsbygroups.sort(sortcountfunction);
                subdoc['groups'] = statsbygroups.filter(function(g,i){ return ((g._id != null) && (g._id != '')) }).filter(function(g,i){ return i<3; });
                s['bygroups'].push(subdoc);
            }
        }

        // Latest
        s['latest'] = [];
        pipeline = [ { $match: {} }, { $sort: {fecha: -1} }, { $unwind: '$dicts' }, { $group: { _id: '$dicts', items: { $push:  { id: "$_id", titulo: "$titulo", fecha: "$fecha" } } } } ];
        latest_items = Tipis.aggregate(pipeline);
        for(i=0;i<latest_items.length;i++) {
            subdoc = {}
            subdoc['_id'] = latest_items[i]._id;
            latest_items[i].items.sort(sortbydatefunction);
            subdoc['items'] = latest_items[i].items.filter(function(_,i){ return i<3 });
            s['latest'].push(subdoc);
        }

        // Metadata
        s['created'] = date;

        // Save
        TipiStats.insert(s);
    }
});

SyncedCron.start();
