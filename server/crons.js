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


/***************************** TIPI STATS ******************************/


SyncedCron.add({
    name: 'TIPI Stats',
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


/***************************** TIPI ALERTS ******************************/


SyncedCron.add({
    name: 'TIPI Alerts',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 10 hours');
    },
    job: function() {
        var subject = '';
        var body = '';
        dicts = Dicts.find({dictgroup: 'tipi'}, {fields: {dict: 1}}).fetch();
        _.each(dicts, function(dict) {
            alerts = TipiAlerts.findOne({dict: dict.dict});
            if (!_.isUndefined(alerts) && !_.isUndefined(alerts.items)) {
                subject = '[TIPI] Alertas de ' + dict.dict;
                body = "<ul>";
                if (alerts.items.length > 0) {
                    _.each(alerts.items, function(item) {
                        body += '<li><a href="' + Meteor.settings.url + '/t/' + item.id + '">' + item.titulo + '</a> ('+ moment(item.fecha).startOf('day').fromNow() +')</li>';
                    });
                    body += '</ul><br/><br/>';
                    body += '<p style="font-size:10px">Para darse de baja de las Alertas TIPI acceda a su perfil de usuario y cambie su configuración.</p>';
                    user_list = Meteor.users.find({"profile.dicts": dict.dict}).fetch();
                    _.each(user_list, function(user) {
                        Meteor.call('tipiSendEmail', user.emails[0].address, subject, body);
                    });
                    TipiAlerts.update({dict: dict.dict}, {$set: {items: []}});
                }
            }
            subject = '';
            body = '';
        });
    }
});


/***************************** ANNOTATE REFERENCES TO TIPI ******************************/


SyncedCron.add({
    name: 'Annotate References to TIPI',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 12 hours');
    },
    job: function() {
        console.log("Starting process...");
        console.log("Fetching documents...");
        referencias = Refs.find({$or: [{annotate: { $exists: false}}, {annotate: false}]}, { fields: { _id: 1 } }).fetch();
        console.log("Documents fetched: " + referencias.length);
        dicts = Dicts.find({dictgroup: "tipi"}).fetch();
        total = referencias.length;
        _.each(referencias, function(r, i) {
            console.log(i + "/" + total + " : " + r._id._str);
            res = suggest_annotation(r._id, dicts);
            annotateRef(r._id, res[0], res[1]);
        });
        console.log("Process finished!");
    }
});


function suggest_annotation(id, dicts) {
    ds = [];
    ts = [];
    _.each(dicts, function(d) {
        _.each(d.words, function(w) {
            search = new RegExp(w, 'gi');
            referenceElement = Refs.findOne(id);
            _.each(referenceElement.content, function(c){
                if (c.search(search) != -1) {
                    ts.push(w);
                    ds.push(d.dict);
                }
            });
        });
    });
    ds = ds.filter(onlyUnique);
    return [ds, ts];
}



/* Clean data funcions */

function cleanBol(el) {
    if (typeof el.bol !== 'undefined') {
        if (typeof el.bol.bol !== 'undefined') {return el.bol.bol;
        } else {
            return el.bol;
        }
    } else {
        return '';
    }
}
function cleanTramite(el) {
    if (typeof el.tramite !== 'undefined') {
        if (typeof el.tramite.tramite !== 'undefined') {
            return el.tramite.tramite;
        } else {
            return el.tramite;
        }
    } else {
        return '';
    }
}
function cleanUrl(el) {
    if (typeof el.url !== 'undefined') {
        if (typeof el.url.url !== 'undefined') {return el.url.url;
        } else {
            // If it has more than one url, it returns just one
            if (Array.isArray(el.url)) {
                return el.url[0];
            } else {
                return el.url;
            }
        }
    } else {
        return '';
    }
}
function parseAutorDiputado(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.diputado !== 'undefined') && (el.autor.diputado != '')) {
            if (Array.isArray(el.autor.diputado)) {
                els = [];
                _.each(el.autor.diputado, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.diputado];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorGrupo(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.grupo !== 'undefined') && (el.autor.grupo != '')) {
            if (Array.isArray(el.autor.grupo)) {
                els = [];
                _.each(el.autor.grupo, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.grupo];
            }
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorOtro(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.otro !== 'undefined') && (el.autor.otro != '')) {
            if (Array.isArray(el.autor.otro)) {
                els = [];
                _.each(el.autor.otro, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.otro];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}



function annotateRef(id, _dicts, _terms) {
    if (_dicts.length > 0) {
        r = Refs.findOne(id);
        if ((typeof r.annotate === 'undefined') || (r.annotate == false)) {
            if (typeof r.titulo === 'undefined') {
                titulo = "Sin titulo";
            } else {
                titulo = r.titulo;
            }
            tipi = {
                'titulo': titulo,
                'bol': cleanBol(r),
                'origen': r.origen,
                'ref': r.ref,
                'tipo': r.tipo,
                'tipotexto': r.tipotexto,
                'lugar': r.lugar,
                'fecha': r.fecha,
                'tramite': cleanTramite(r),
                'url': cleanUrl(r),
                'autor_diputado': parseAutorDiputado(r),
                'autor_grupo': parseAutorGrupo(r),
                'autor_otro': parseAutorOtro(r),
                'dicts': _dicts,
                'terms': _terms,
                'relacionadas': [],
                'observaciones': '',
                'quepasocon': '',
                'original': r._id._str
            }
            t = Tipis.insert(tipi);
            if (t) {
                var alert_id = t;
                var alert_titulo = titulo;
                var alert_fecha = r.fecha;
                // Tipi successfully inserted
                _.each(_dicts, function(dict) {
                    TipiAlerts.update({dict: dict}, {$addToSet: {items: {id: alert_id, titulo: alert_titulo, fecha: alert_fecha}}});
                });
                Refs.update(id, {$set: {dicts: _dicts, terms: _terms, annotate: true, is_tipi: true}});
            } else {
                // Do nothing (this code will be run once again)
            }
        } else {
            // This document is already annotated
        }
    } else {
        Refs.update(id, {$set: {dicts: [], terms: [], annotate: true, is_tipi: false}});
    }
}

/* Tools */

function onlyUnique (value, index, self) { 
    return self.indexOf(value) === index;
}




SyncedCron.start();
