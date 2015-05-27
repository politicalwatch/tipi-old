Stats = new Mongo.Collection('stats');
LatestItems = new Mongo.Collection('latest');
StatsByDeputies = new Mongo.Collection('statsbydeputies');
StatsByGroups = new Mongo.Collection('statsbygroups');

// TODO: Moverlo a area comun
var parliamentarygroups = {
    'GP': 'Grupo Popular',
    'GS': 'Grupo Socialista',
    'GC-CiU': 'Grupo Catalán - Convergencia i Unió',
    'GIP': 'Grupo La Izquierda Plural',
    'GV (EAJ-PNV)': 'Grupo Vasco - EAJ PNV',
    'GUPyD': 'Grupo Unión Progreso y Democracia',
    'GMx': 'Grupo Mixto'
}

Template.scannervizz.helpers({
    diputados: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "xxx Falciani";
        dataset.push(obj);
      };
      return dataset;
    },
    grupos: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "Partido X";
        dataset.push(obj);
      };
      return dataset;
    }
});


Template.scannervizz.rendered = function() {

    // D3js example: https://raw.githubusercontent.com/Slava/d3-meteor-basic/master/client.js

    // Load count data for vizz
    // var dicts = Dicts.find().fetch();
    var root = {
        "name": "Escaner",
        "children": []
    }

    // _.each(dicts, function(d) {
    //     n = Refs.find({"dicts": d.dict}).count();
    //     if (n) {
    //         objd = {
    //             "name": d.dict,
    //             "icon": d.iconb1,
    //             "size": n
    //         }
    //         root["children"].push(objd);
    //     }
    // });
    
    stats_array = Stats.find().fetch();
    _.each(stats_array, function(el) {
        if (el.count > 0) {
            objd = {
                "name": el._id,
                "icon": Dicts.find({dict: el._id}, {fields: {iconb1: 1}}).fetch()[0].iconb1,
                "size": el.count
            }
            root["children"].push(objd);
        }
    });

    var margin = 20,
    diameter = 600,
    scaling = 1.3;

    var pack = d3.layout.pack()
        .padding(3)
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return d.size; })

    var svg = d3.select("#vizz").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2.5 + "," + diameter / 2.5 + ")");


      var focus = root,
          nodes = pack.nodes(root),
          view;
      
      var image = svg.selectAll('image').data(nodes).enter().append("image")
            .attr("xlink:href", function(d){
                  return Meteor.absoluteUrl("images/svgs-circles/") + d.icon;
            })
            .attr("width", function(d) { return d.r * scaling; })
            .attr("height", function(d) { return d.r * scaling; })
            .attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; })
            // .attr("class", function(d) { return d.children ? "node node--root" : "node node--leaf"; })
            .style("opacity", function(d) { return d.children ? "0" : "1"; })
            .style("cursor", function(d) { return d.children ? "default" : "pointer"; })
            .on("click", function(d) { if (focus !== d) { zoom(d), d3.event.stopPropagation(); } });

      d3.select("#vizz")
          .on("click", function() { zoom(root); });


      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {

        $("#scanner-title").text(d.name);
        if ($("#scanner-title").text() == "Escaner") {
            $("#scanner-content").addClass("hidden");
            $("#scanner-help").removeClass("hidden");
        } else {
            var str = '';
            function sortcountfunction(a, b){
                if (a.count >= b.count) {
                    return -1;
                } else {
                    return 1;
                }
            }
            str = '';
            sbd = StatsByDeputies.findOne({_id: $("#scanner-title").text()});
            if (sbd) {
                str += '<h3>Diputadas/os más activas/os</h3><ul class="list-unstyled">';
                sbd.deputies.sort(sortcountfunction);
                _.each(sbd.deputies.filter(function(d,i){ return ((d._id != null) && (d._id != '')) }).filter(function(d,i){ return i<3; }), function(d) {
                    str += '<li><span class="badge badge-tipi">'+d.count+'</span> '+d._id+'</li>';
                });
                str += '</ul>';
            }
            sbg = StatsByGroups.findOne({_id: $("#scanner-title").text()});
            if (sbg) {
                str += '<h3>Grupos más activos</h3><ul class="list-unstyled">';
                sbg.groups.sort(sortcountfunction);
                _.each(sbg.groups.filter(function(g,i){ return ((g._id != null) && (g._id != '')) }).filter(function(g,i){ return i<3; }), function(g) {
                    str += '<li><span class="badge badge-tipi">'+g.count+'</span> '+parliamentarygroups[g._id]+'</li>';
                });
                str += '</ul>';
            }
            latestitems = LatestItems.find($("#scanner-title").text()).fetch();
            if (latestitems) {
                str += '<h3>Últimas iniciativas</h3><ul>';
                _.each(latestitems[0].items.filter(function(_,i){ return i<3 }), function(l) {
                    if (l.titulo.length > 75) {
                        str += '<li><a href="/t/'+l.id+'">'+l.titulo.substring(0,75)+'...</a></li>';
                    } else {
                        str += '<li><a href="/t/'+l.id+'">'+l.titulo+'</a></li>';
                    }
                });
                str += '</ul>';
            }
            $("#scanner-content").html(str);
            $("#scanner-content").removeClass("hidden");
            $("#scanner-help").addClass("hidden");
        }

        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });

      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        image.attr("transform", function(d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        }).attr("width", function(d) { return d.r * scaling * k; }).attr("height", function(d) { return d.r * scaling * k; });
      }
      
    // });

    d3.select(self.frameElement).style("height", diameter + "px");


};