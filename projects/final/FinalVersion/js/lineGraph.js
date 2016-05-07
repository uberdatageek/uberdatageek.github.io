WageLineGraph = function(_parentElement, _data){
  this.parentElement = _parentElement;
  this.csvNational = _data;

  this.initVis();
}

/*=================================================================
* Initialize visualization (static content, e.g. SVG area or axes)
*=================================================================*/

WageLineGraph.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 60, right: 200, bottom: 50, left: 50};

    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.height = 400 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#wage-line").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.frame = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // X and Y Scales
    vis.x = d3.time.scale()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([vis.height,0]); 

    //define X axis (year)
    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));

    //define Y axis 
    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    //Line functions
    vis.line1 = d3.svg.line()
        .x(function(d) { return vis.x(d.year); })
        .interpolate("monotone");  

    vis.line2 = d3.svg.line()
        .x(function(d) { return vis.x(d.year); })
        .interpolate("monotone");    

    vis.line3 = d3.svg.line()
        .x(function(d) { return vis.x(d.year); })
        .interpolate("monotone");  

    vis.line4 = d3.svg.line()
        .x(function(d) { return vis.x(d.year); })
        .interpolate("monotone");                

    //Create X axis
    vis.frame.append("g")
       .attr("class", "axis x-axis")
       .attr("transform", "translate(0," + (vis.height) + ")");

    //Create Y axis
    vis.frame.append("g")
       .attr("class", "axis y-axis")
       .attr("transform", "translate(0,0)");

    //Create linegraph
    vis.linePath1 = vis.frame.append("path");
    vis.linePath2 = vis.frame.append("path");
    vis.linePath3 = vis.frame.append("path");
    vis.linePath4 = vis.frame.append("path");

    //X axis label
    vis.frame.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height + vis.margin.bottom/1.5) + ")")
        .text("Year");

    //Graph Title 
    vis.svg.append("text")
        .attr("class", "line-title")
        .attr("transform", "translate(" + (vis.width/2.5) + "," + (vis.margin.top/2) + ")")
        .text("Average Real Income by Education Level");


    //Create Legend
    vis.svg.append("rect")
        .attr("x", vis.width+vis.margin.left+20)
        .attr("y", (vis.margin.top))
        .attr("width", 15)
        .attr("height", 10)
        .style("fill", "dodgerblue");
    vis.svg.append("rect")
        .attr("x", vis.width+vis.margin.left+20)
        .attr("y", (vis.margin.top)+20)
        .attr("width", 15)
        .attr("height", 10)
        .style("fill", "green");
    vis.svg.append("rect")
        .attr("x", vis.width+vis.margin.left+20)
        .attr("y", (vis.margin.top)+40)
        .attr("width", 15)
        .attr("height", 10)
        .style("fill", "purple");
    vis.svg.append("rect")
        .attr("x", vis.width+vis.margin.left+20)
        .attr("y", (vis.margin.top)+60)
        .attr("width", 15)
        .attr("height", 10)
        .style("fill", "crimson");   

    vis.svg.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width+vis.margin.left+40) + "," + (vis.margin.top+8) + ")")
        .text("College Degree");
    vis.svg.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width+vis.margin.left+40) + "," + (vis.margin.top+28) + ")")
        .text("Some College");
    vis.svg.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width+vis.margin.left+40) + "," + (vis.margin.top+48) + ")")
        .text("High School");
    vis.svg.append("text")
        .attr("class", "axis-text")
        .attr("transform", "translate(" + (vis.width+vis.margin.left+40) + "," + (vis.margin.top+68) + ")")
        .text("High School Dropout");


    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
* Data Wrangling
*=================================================================*/
WageLineGraph.prototype.wrangleData = function(){
    var vis = this;

    //No data wrangling needed here for now

    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence 
 * Function parameters only needed if different kinds of updates are needed
*=================================================================*/

 WageLineGraph.prototype.updateVis = function(){
    var vis = this;

    console.log(vis.csvNational);

    //Scale domains
    vis.x.domain([d3.min(vis.csvNational, function(d) { return d.year;}),
             d3.max(vis.csvNational, function(d) { return d.year;})])

    vis.y.domain([20000,
             d3.max(vis.csvNational, function(d) { return d.realIncWage_cg;})])

    //add y element to line function 
    vis.line1.y(function(d) { return vis.y(d.realIncWage_cg); });
    vis.line2.y(function(d) { return vis.y(d.realIncWage_sc); });
    vis.line3.y(function(d) { return vis.y(d.realIncWage_hs); });
    vis.line4.y(function(d) { return vis.y(d.realIncWage_do); });

    // Update (set dynamic properties of the elements)
    vis.linePath1
        .datum(vis.csvNational)
        .attr("class", "line")
        .attr("d", vis.line1)
        .style("stroke", "dodgerblue");    

    vis.linePath2
        .datum(vis.csvNational)
        .attr("class", "line")
        .attr("d", vis.line2)
        .style("stroke", "green");    

    vis.linePath3
        .datum(vis.csvNational)
        .attr("class", "line")
        .attr("d", vis.line3)
        .style("stroke", "purple");    

    vis.linePath4
        .datum(vis.csvNational)
        .attr("class", "line")
        .attr("d", vis.line4)
        .style("stroke", "crimson");    

    //Update X axis
    vis.svg.select(".x-axis")
        .call(vis.xAxis);

    //Update Y axis
    vis.svg.select(".y-axis")  
        .call(vis.yAxis);

   
}
