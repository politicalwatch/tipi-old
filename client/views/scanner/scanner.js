var dicts = {'educacion': 150, 'sanidad': 50};

Template.scanner.helpers({
    dictcount: function(dictname) {
        return dicts[dictname];
    }
});


Template.scanner.rendered = function() {

    // D3js example: https://raw.githubusercontent.com/Slava/d3-meteor-basic/master/client.js

    var color = d3.scale.category10();
    var bubble = d3.layout.pack()
        .sort(null)
        .size([30, 500])
        .padding(1.5);
        
        var svg = d3.select("#vizz").append("svg")
            .attr("width", 600)
            .attr("height", 400)
            .style("background-color", "#fff")
            .attr("class","bubble");
        
        svg.selectAll("circle")
            .data([32, 57, 112, 293,32, 57, 112, 293,32, 57, 112, 293,32, 57, 112, 293])
            .enter().append("circle")
            .attr("cy", function(d,i) {return Math.random()*200})
            .attr("cx", function(d, i) {return Math.random()*200})
            .attr("r", function(d) { return Math.sqrt(d); })
            .style("fill", function (d) {return color(d)});

        svg.selectAll("circle").append("svg:image")
            .attr('x',0)
            .attr('y',0)
            .attr('width', 20)
            .attr('height', 20)
            .attr("xlink:href", "/public/images/franhealysvg2.svg");

        d3.select(self.frameElement).style("height", "50px");

};