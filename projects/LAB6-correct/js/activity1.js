
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT


// Load data
d3.json("data/airports.json", function(data) {

console.log(data);
    //Debug message
    var jsonD = data.nodes;
    var jsonL = data.links;
    var count = 0;

    for(var i=0; i<jsonD.length; i++){

        console.log("ID " + data.nodes[i].id);
        console.log("Name " + data.nodes[i].name);
        console.log("Country " + data.nodes[i].country);
        console.log("Passengers " + data.nodes[i].passengers);
        console.log("Latitude " + data.nodes[i].latitude);
        console.log("Longitude " + data.nodes[i].longitude);

    }

    for(var i=0; i<jsonL.length; i++){

        console.log("Source " + data.links[i].source);
        console.log("Target " + data.links[i].target);

    }


    //for (var key in data) {
        //if (data.hasOwnProperty(key)) {
            //var val = data[key];

        //}
    //}




  // 2a) DEFINE 'NODES' AND 'EDGES'
    var force = d3.layout.force()
        .nodes(data.nodes)
        .links(data.links)
        .size([width, height])
        .linkDistance([100])
        .charge([-100])
        .gravity(0.4)
        .theta(0.7)
        .alpha(0.3);



  // 2b) START RUNNING THE SIMULATION
    force.start();

  // 3) DRAW THE LINKS (SVG LINE)
    var edges = svg.selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stoke-width", 1);

  // 4) DRAW THE NODES (SVG CIRCLE)
    // Ordinal color scale (10 default colors)

    //var colors = d3.scale.category10();

    var nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", function(d, i) {
            if(d.country == "United States") {
                return "blue";
            } else {
                return "red";
            }
                //return colors(i);
        })
        .call(force.drag);

    nodes.append("title")
        .text(function(d) { return d.name; });

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    force.on("tick", function() {
        edges.attr("x1", function(d){ return d.source.x; })
             .attr("y1", function(d){ return d.source.y; })
             .attr("x2", function(d){ return d.target.x; })
             .attr("y2", function(d){ return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; });

    });

});