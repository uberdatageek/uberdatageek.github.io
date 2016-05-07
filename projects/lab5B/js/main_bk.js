// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//var yAxisGroup = svg.append("g")
//.attr("class", "y-axis axis");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");



// Initialize data
loadData();

// Coffee chain data
var data;

// Load CSV file
function loadData() {
    d3.csv("data/coffee-house-chains.csv", function(error, csv) {

        csv.forEach(function(d){
            d.revenue = +d.revenue;
            d.stores = +d.stores;
        });

        // Store csv data in global variable
        //Coffee house chains sorted by number of stores
        data = csv.sort(function(a, b){ return b.stores - a.stores; });

        // Draw the visualization for the first time
        updateVisualization();
    });
}

var SelectValue = d3.select("#ranking-type").on("change", updateData);


// Render visualization
function updateVisualization() {
    var valNow = d3.select("#ranking-type").property("value");


    console.log(data);
    var theData;
    x.domain(data.map(function(d) { return d.company; }));
    y.domain([0, d3.max(data, function(d) {  return d.stores; })]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("transform", "translate(0,-20)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Stores");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.company); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.stores); })
        .attr("height", function(d) { return height - y(d.stores); });

}


var data;
function updateData() {

//var valNow = this.options[this.selectedIndex].value;
    var valNow = d3.select("#ranking-type").property("value");
    /**/var yLabel;

    d3.csv("data/coffee-house-chains.csv", function(error, csv) {

        csv.forEach(function(d){
            d.revenue = +d.revenue;
            d.stores = +d.stores;
        });

        data = csv; //.sort(function(a, b){ return b.stores - a.stores; });

    });

    alert(valNow);

    var bar = svg.selectAll(".bar")
        .data(data);

    //svg.selectAll(".y-label").remove();

    if(valNow == "revenue"){

        y.domain([0, d3.max(data, function(d) { return d.revenue; })]);

        yLabel = "Revenue";

        bar.transition()
            .attr("x", function(d) { return x(d.company); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.revenue); })
            .attr("height", function(d) { return height - y(d.revenue); });

    } else if (valNow == "stores"){

        //x.domain(data.map(function(d) { return d.company; }));
        y.domain([0, d3.max(data, function(d) { return d.stores; })]);

        yLabel= "Stores";

        bar.transition()
            .attr("x", function(d) { return x(d.company); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.stores); })
            .attr("height", function(d) { return height - y(d.stores); });
    }

    svg.selectAll(".y-label").remove();
    svg.selectAll(".y.axis")
        .call(yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("transform", "translate(0,-20)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);



}



var a = a;
var btn = d3.select("#change-sorting").on("click", function() {

    //get value in select field so as to ensure that bars heights are calculated correctly
    var valNow = d3.select("#ranking-type").property("value");


    if (a == true){
        a = false;
    } else {
        a = true;
    };

    d3.csv("data/coffee-house-chains.csv", function(error, csv) {

        csv.forEach(function(d){
            d.revenue = +d.revenue;
            d.stores = +d.stores;
        });

        //data = csv;

        //var newData = data.filter(function (d) { return revenue;});

        //console.log(newData);

        var bar = svg.selectAll(".bar")
            .data(data);
        if(a == true) {
            // Store csv data in global variable
            //Coffee house chains sorted by number of stores
            data = csv.sort(function (a, b) {
                return a.stores - b.stores;
            });
        } else { //a must be false
            data = csv.sort(function (a, b) {
                return b.stores - a.stores;
            });
        }
        x.domain(data.map(function(d) { return d.company; }));
        svg.selectAll("g.x-axis")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        if(valNow == "stores") {
            bar.transition()
                .attr("x", function (d) {
                    return x(d.company);
                })
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.stores);
                })
                .attr("height", function (d) {
                    return height - y(d.stores);
                });
        } else {
            bar.transition()
                .attr("x", function (d) {
                    return x(d.company);
                })
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.revenue);
                })
                .attr("height", function (d) {
                    return height - y(d.revenue);
                });
        }

        // Draw the visualization for the first time
        //updateVisualization();
    });
});
