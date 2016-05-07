//Padding applied
var padding = 0;
// Margin object with properties for the four directions
var margin = {top: 20, right: 10, bottom: 50, left: 50};

// Width and height as the inner dimensions of the chart area
var width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

/* //For dynamic tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");
    */

d3.csv("data/zaatari-refugee-camp-population.csv", function(data) {

    for(var i=0; i<data.length; i++) {

        console.log(data[i].date);
        console.log(data[i].population);

    }

    var area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.population); });


    data.filter(function(d,i){
        d.population = +d.population;

        //Convert to date object
        var format = d3.time.format("%Y-%m-%d");
        d.date = format.parse(d.date); // returns a Date
        //d.date = format(new Date(d.date)); // returns a string
    })

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(11)
        .tickFormat(d3.time.format("%b %Y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues([0,20000,40000,60000,80000,100000,120000,140000,160000,180000,200000]);

    var svg = d3.select("#svg-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    ////////////////////////////////////////////////////////////////
    var lineSvg = svg.append("g");

    var focus = svg.append("g")
        .style("display", "none");
    ////////////////////////////////////////////////////////////////

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.population); });

    ////////////////////////////////////////////////////////////////
    // Add the valueline path.
    lineSvg.append("path")                                 // **********
        .attr("class", "line")
        .attr("d", valueline(data));
    ////////////////////////////////////////////////////////////////

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" );


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    /* //Failed attempt at Dynamic tooltip////
    svg.selectAll("path")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            svg.selectAll("path").transition()
                .duration(250)
                .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                })})


        .on("mousemove", function(d, i) {
            mousex = d3.mouse(this);
            mousex = mousex[0];
            var invertedx = x.invert(mousex);
            invertedx = invertedx.getMonth() + invertedx.getDate();
            var selected = (d.population);
            alert(selected);
            for (var k = 0; k < selected.length; k++) {
                datearray[k] = selected[k].date
                datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
            }

            mousedate = datearray.indexOf(invertedx);
            pro = d.population[mousedate].value;

            d3.select(this)
                .classed("hover", true)
                .attr("stroke", strokecolor)
                .attr("stroke-width", "0.5px"),
                tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");

        })
        .on("mouseout", function(d, i) {
            svg.selectAll(".layer")
                .transition()
                .duration(250)
                .attr("opacity", "1");
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
        })

        */

});


//for Bar chart
var bmargin = {top: 20, right: 20, bottom: 30, left: 40},
    bwidth = 400 - bmargin.left - bmargin.right,
    bheight = 500 - bmargin.top - bmargin.bottom;

var xbar = d3.scale.ordinal()
    .rangeRoundBands([0, bwidth], .1);

var ybar = d3.scale.linear()
    .range([bheight, 0]);

var bxAxis = d3.svg.axis()
    .scale(xbar)
    .orient("bottom");

var formatter = d3.format("%");
var byAxis = d3.svg.axis()
    .scale(ybar)
    .orient("left")
    .ticks(10);

var svg = d3.select("#svg-container2").append("svg")
    .attr("width", bwidth + bmargin.left + bmargin.right)
    .attr("height", bheight + bmargin.top + bmargin.bottom)
    .append("g")
    .attr("transform", "translate(" + bmargin.left + "," + bmargin.top + ")");

d3.csv("data/shelter_type.csv", function(data) {

    //for(var i=0; i<data.length; i++) {
        //alert(data[i].type + " " + data[i].percentage);
    //}

    data.filter(function(d,i){
        d.percentage = +d.percentage;
    })

    xbar.domain(data.map(function(d) {

        if(d.type == "combination") {
            d.type = d.type + "*"
        }
        return d.type;
    }));
    ybar.domain([0,100]);

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.percentage;
        })
        .attr("class", "bar-label")
        .attr("x", function(d, i) {
            return i * (bwidth / data.length) + 55;
        })
        .attr("y", function(d) {
            return  ybar(d.percentage) - 10;
        })
        .style("text-anchor", "middle");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bheight + ")")
        .call(bxAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(byAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percentage");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xbar(d.type); })
        .attr("width", xbar.rangeBand())
        .attr("y", function(d) { return ybar(d.percentage); })
        .attr("height", function(d) { return bheight - ybar(d.percentage); });


});

