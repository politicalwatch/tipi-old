var dicts = {'educacion': 150, 'sanidad': 50};

Template.scanner.helpers({
    dictcount: function(dictname) {
      return dicts[dictname];
    },
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
    gps: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "Partido X";
        dataset.push(obj);
      };
      return dataset;
    },
    whatevers: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "Whtvr " + (i+1);
        dataset.push(obj);
      };
      return dataset;
    }
});


Template.scanner.rendered = function() {

    // D3js example: https://raw.githubusercontent.com/Slava/d3-meteor-basic/master/client.js

    var margin = 20,
    diameter = 600,
    scaling = 1.3;

    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["hsl(82,60%,100%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
        .padding(3)
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return d.size; })

    var svg = d3.select("#vizz").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2.5 + "," + diameter / 2.5 + ")");

    d3.json(Meteor.absoluteUrl("/data/fixtures.json"), function(error, root) {
      if (error) return console.error(error);

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
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("opacity", function(d) { return d.children ? 0 : 1; })
            .style("cursor", "pointer")
            .on("click", function(d) { console.log("CLICK!!!"); if (focus !== d) { console.log("Focus: " + focus); console.log("Data: " + d); zoom(d), d3.event.stopPropagation(); } });

        image.on("click", function(d) { console.log(d); });

    var node = svg.selectAll("image");


      d3.select("#vizz")
          .on("click", function() { zoom(root); });


      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {

        $("#scanner-title").text(d.name);
        if ($("#scanner-title").text() == "Escaner") {
          $("#scanner-content").addClass("hidden");
        }
        else {
    
          $("#scanner-content").removeClass("hidden");
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
        // console.log('V: ' + v);
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        image.attr("width", function(d) { return d.r * scaling * k; }).attr("height", function(d) { return d.r * scaling * k; });
      }
    });

    d3.select(self.frameElement).style("height", diameter + "px");

};