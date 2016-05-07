var width = 1000,
    height = 600;

var svg = d3.select("#map-viz").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator() //orthographic()
    //.scale(270)
    .center([0, 55 ]);
    //.center([0, 10 ]);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10,0])
    .html(function(d) {
        var theName = d.name;
        var country = d.country;
        //convert to string so func can work
        var passengers = d.passengers.toString();
        passengers = passengers.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        return "<span class='tip-title'>Airport:</span> &nbsp;&nbsp;" + theName + "<br /><span class='tip-title'> Country:</span> &nbsp;&nbsp;" + country + "<br /><span class='tip-title'>Passengers:</span>&nbsp;&nbsp;" + passengers;
    });


svg.call(tip);

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}


/*
// Load shapes of Countries (TopoJSON) - using only one dataset

    d3.json("data/world-110m.json", function(error, data1) {
    // Convert TopoJSON to GeoJSON (target object = 'states')

        var countries = topojson.feature(data1, data1.objects.countries).features;

        // Render the U.S. by using the path generator
              svg.selectAll("path")
                 .data(countries)
                 .enter().append("path")
                 .attr("class","mapatt")
                 .attr("d", path);

    });
*/

//loading multiple datasets
function createVisualization(error, data1, data2) {     // Visualize data1 and data2

    console.log(data1);
    console.log(data2.links[0].source);

    var countries = topojson.feature(data1, data1.objects.countries).features;
    var airports =  data2.nodes;

    // Render the world map by using the path generator
    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class","mapatt")
        .attr("d", path);

    svg.selectAll("circle")
        .data(airports)
        .enter().append("circle")
        .attr("class","point")
        .attr("transform", function(d) { return "translate(" + projection([d.longitude, d.latitude]) + ")"; })
        .attr("r", 5)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "darkgreen");
            tip.show(d, document.getElementById("head"));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "gold");
            tip.hide(d, document.getElementById("head"))
        });



    //Attempt to connect airport nodes was largely unsuccessful :(  Uncomment below code to see results
    //Note: when the index values for x2 & y2 are correctly changed to [1], javascript throws an error and the lines don't render
    /*
    var theTarget;

    svg.selectAll("line")
        .data(data2.links)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return projection([data2.nodes[d.source].longitude])[0]; //data2.nodes[d.source].longitude
        })
        .attr("y1", function (d) {
            return projection([data2.nodes[d.source].latitude]) [0]; //data2.nodes[d.source].latitude
        })
        .attr("x2", function (d) {
            return projection([data2.nodes[d.target].longitude])[0]; //data2.nodes[d.target].longitude
        })
        .attr("y2", function (d) {
            return projection([data2.nodes[d.target].latitude])[0]; //data2.nodes[d.target].latitude
        })
        .style("stroke", "red");

    */
}

