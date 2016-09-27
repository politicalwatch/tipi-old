Template.scanner.rendered = function() {

    // Load count data for vizz
    // var dicts = Dicts.find().fetch();
    var root = {
        "name": "Escaner",
        "children": []
    }

    stats = TipiStats.find().fetch()[0];
    overall = stats.overall;
    statsbydeputies = stats.bydeputies;
    statsbygroups = stats.bygroups;
    statslatest = stats.latest;

    _.each(overall, function(el) {
        if ( (el.count > 0) && (! _.isNull(el._id)) ) {
            dictobj = Dicts.findOne({dict: el._id}, {fields: {iconb1: 1}});
            if (!_.isUndefined(dictobj)) {
              objd = {
                  "name": el._id,
                  "icon": dictobj.iconb1,
                  "size": el.count
              }
              root["children"].push(objd);
            }
        }
    });

    var margin = 20,
    diameter = (window.innerWidth >= 1050) ? 600 : (window.innerWidth < 768) ? window.innerWidth : window.innerWidth/2;
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
            cat = $("#scanner-title").text();
            sbd = statsbydeputies.filter(function(d,i){ return d._id == cat });
            if (sbd) {
                str += '<h3>Diputadas/os más activas/os</h3><ul class="list-unstyled">';
                _.each(sbd[0].deputies, function(d) {
                    dip = Diputados.findOne({nombre: d._id});
                    if (dip) {
                        str += '<li><span class="foto mediana"><img src="'+dip.imagen+'" /></span>&nbsp;'+d._id+'</h6></li>';
                    } else {
                        str += '<li>'+d._id+'</li>';
                    }
                });
                str += '</ul>';
            }
            sbg = statsbygroups.filter(function(g,i){ return g._id == cat });
            if (sbg) {
                str += '<h3>Grupos más activos</h3><ul class="list-unstyled">';
                _.each(sbg[0].groups, function(g) {
                    str += '<li style="border-left: 4px solid'+parliamentarygroups_colors[g._id]+';margin-bottom:5px;">&nbsp;'+parliamentarygroups[g._id]+'</li>';
                });
                str += '</ul>';
            }
            latest = statslatest.filter(function(l,i){ return l._id == cat });
            if (latest) {
                str += '<h3>Últimas iniciativas</h3><ul>';
                latest[0].items = latest[0].items.sort(function (a, b) {
                    if (a.fecha < b.fecha) return 1;
                    if (b.fecha < a.fecha) return -1;
                    return 0;
                });
                _.each(latest[0].items, function(l) {
                    str += '<li><a href="/t/'+l.id+'">'+l.titulo+'</a></li>';
                    /*if (l.titulo.length > 75) {
                        str += '<li><a href="/t/'+l.id+'">'+l.titulo.substring(0,75)+'...</a></li>';
                    } else {
                        str += '<li><a href="/t/'+l.id+'">'+l.titulo+'</a></li>';
                    }*/
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
        var k = diameter / v[2];
        view = v;
        image.attr("transform", function(d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        }).attr("width", function(d) { return d.r * scaling * k; }).attr("height", function(d) { return d.r * scaling * k; });
      }

    d3.select(self.frameElement).style("height", diameter + "px");


};
