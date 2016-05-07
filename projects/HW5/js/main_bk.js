// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10,0])
    .html(function(d) {
        var country = d.WINNER;
        var yr = formatDate(d.YEAR);
        var yval = "<br /><strong># of Goals:&nbsp;</strong>" + d.GOALS;

        return "<strong>Winner:&nbsp;</strong>" + country + "<br /><strong>Year:&nbsp;</strong>" + yr + yval;
    });


svg.call(tip);


// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left");

// Define the line for goals
var valueline = d3.svg.line()
    .x(function(d) { return x(d.YEAR); })
    .y(function(d) { return y(d.GOALS); });

// Initialize data
loadData();

// FIFA world cup
var data;


// Load CSV file
function loadData() {
    d3.csv("data/fifa-world-cup.csv", function(error, csv) {

        csv.forEach(function(d){
            // Convert string to 'date object'
            d.YEAR = formatDate.parse(d.YEAR);

            // Convert numeric values to 'numbers'
            d.TEAMS = +d.TEAMS;
            d.MATCHES = +d.MATCHES;
            d.GOALS = +d.GOALS;
            d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
            d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
        });
        console.log(csv);

        // Store csv data in global variable
        data = csv;

///////////////////////////////////////////////////////////////

        var date1 = new Date("1996");
        var date2 = new Date("1990");

        //data = data.filter(function (el) {
            //return el.YEAR < date1 & el.YEAR > date2;
       // });
        //console.log(data);

//////////////////////////////////////////////////////////////
        // Draw the visualization for the first time
        updateVisualization();
    });
}


var yLabel;

// Render visualization
function updateVisualization() {

    yLabel = "Goals"; //default value

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.YEAR; }));
    y.domain([0, d3.max(data, function(d) { return d.GOALS; })]);//d.GOALS

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "y-label")
        .attr("transform", "translate(0,-20)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    var point = svg.append("g")
        .attr("class", "line-point");

    point.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr("cx", function(d) { return x(d.YEAR) })
        .attr("cy", function(d) { return y(d.GOALS) })
        .attr("r", 3.5)
        .on("mouseover", function(d) {
            tip.show(d, document.getElementById("head"));
        })
        .on("mouseout", function(d) {
            tip.hide(d, document.getElementById("head"))
        });
}

var SelectValue = d3.select("#request-type").on("change", redrawChart);
// Show details for a specific FIFA World Cup

function redrawChart(){

    var valNow = d3.select("#request-type").property("value");

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10,0])
        .html(function(d) {
            var country = d.WINNER;
            var yr = formatDate(d.YEAR);
            var yval;

            if(valNow == "Matches") {
                yval = "<br /><strong>Matches:&nbsp;</strong>" + d.MATCHES;
            } else if (valNow == "Teams"){
                yval = "<br /><strong>Teams:&nbsp;</strong>" + d.TEAMS;
            } else if (valNow == "Avg. Goals"){
                yval = "<br /><strong>Average<br />Goals:&nbsp;</strong>" + d.AVERAGE_GOALS;
            } else if (valNow == "Avg. Attendance"){
                yval = "<br /><strong>Average<br />Attendance:&nbsp;</strong>" + d.AVERAGE_ATTENDANCE;
            } else {
                yval = "<br /><strong># of Goals:&nbsp;</strong>" + d.GOALS;
            }

            return "<strong>Winner:&nbsp;</strong>" + country + "<br /><strong>Year:&nbsp;</strong>" + yr + yval;
        });

    svg.call(tip);

    // matches
    valueline2 = d3.svg.line()
        .x(function(d) { return x(d.YEAR); })
        .y(function(d) {

            if(valNow == "Matches") {
                return y(d.MATCHES);
            } else if (valNow == "Teams"){
                return y(d.TEAMS);
            } else if (valNow == "Avg. Goals"){
                return y(d.AVERAGE_GOALS);
            } else if (valNow == "Avg. Attendance"){
                return y(d.AVERAGE_ATTENDANCE);
            } else {
                return y(d.GOALS);
            }

        });

    yLabel = valNow;

    svg.selectAll(".y-label").remove();
    svg.append("g")
        .append("text")
        .attr("class", "y-label")
        .transition()
        .duration(800)
        .attr("transform", "translate(0,-20)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    y.domain([0, d3.max(data, function (d) {

        if(valNow == "Matches") {
            return d.MATCHES;
        } else if (valNow == "Teams"){
            return d.TEAMS;
        } else if (valNow == "Avg. Goals"){
            return d.AVERAGE_GOALS;
        } else if (valNow == "Avg. Attendance"){
            return d.AVERAGE_ATTENDANCE;
        } else {
            return d.GOALS;
        }

    })]);


    svg.select(".y.axis") // change the y axis
        .transition()
        .duration(800)
        .call(yAxis);

    // Make the changes
    svg.selectAll(".line").remove();
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline2(data));

    svg.selectAll(".line-point").remove();
    var point = svg.append("g")
        .attr("class", "line-point");

    // Make the changes
    svg.selectAll(".line").remove();
    svg.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return valueline2(data); });

    svg.selectAll(".line-point").remove();
    var point = svg.append("g")
        .attr("class", "line-point");

    point.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr("cx", function (d) { return x(d.YEAR) })
        .attr("cy", function (d) {

            if(valNow == "Matches") {
                return y(d.MATCHES);
            } else if (valNow == "Teams"){
                return y(d.TEAMS);
            } else if (valNow == "Avg. Goals"){
                return y(d.AVERAGE_GOALS);
            } else if (valNow == "Avg. Attendance"){
                return y(d.AVERAGE_ATTENDANCE);
            } else {
                return y(d.GOALS);
            }

        })
        .attr("r", 3.5)
        .on("mouseover", function(d) {
            tip.show(d, document.getElementById("head"));
        })
        .on("mouseout", function(d) {
            tip.hide(d, document.getElementById("head"))
        });

}


function showEdition(d){


}