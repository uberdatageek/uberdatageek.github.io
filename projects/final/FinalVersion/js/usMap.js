USMap = function(_parentElement, _map, _data){
    this.parentElement = _parentElement;
    this.usMap = _map;
    this.csvUS = _data;
    this.displayData = []; // unused right now could be useful for years though.

    // DEBUG RAW DATA
    //console.log(this.csvUS);
    //console.log(this.usMap);

    this.initVis();
}

/*=================================================================
 * Initialize visualization (static content, e.g. SVG area or axes)
 *=================================================================*/

USMap.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 30, right: 10, bottom: 10, left: 10};

    vis.width = /*1000*/ parseInt(document.getElementById("usa-map").clientWidth) - vis.margin.left - vis.margin.right;

    vis.height = 700 - vis.margin.top - vis.margin.bottom;


    vis.svg = d3.select("#usa-map").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.frame = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //Set colorscale # of buckets
    vis.colorBuckets = 7;

    //Set colorscale range
    vis.colorScale = d3.scale.quantize()
        .range(colorbrewer.Purples[vis.colorBuckets]);

    //Define map projection
    vis.projection = d3.geo.albersUsa()
        .translate([vis.width/2, vis.height/2])
        .scale([1200]);

    //Define default path generator
    vis.path = d3.geo.path()
        .projection(vis.projection);

    //Define percentage format
    vis.percent = d3.format("2.1%");

    //Initialize tooltip
    vis.tipx = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

    vis.frame.call(vis.tipx);

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
 * Data Wrangling
 *=================================================================*/
USMap.prototype.wrangleData = function(){
    var vis = this;

    //No data wrangling needed here for now

    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence
 * Function parameters only needed if different kinds of updates are needed
 *=================================================================*/

USMap.prototype.updateVis = function(){
    var vis = this;

    //get current keyVar value from dropdown
    vis.keyVar = d3.select("#stat-type").property("value");

    //get current year value from slider
    vis.keyYear = parseInt(d3.select("#timeslide").property("value"));
    console.log(vis.keyYear);

    // Convert TopoJSON to GeoJSON
    var usa = topojson.feature(vis.usMap, vis.usMap.objects.states).features;

    //console.log(usa);
    //console.log(vis.csvUS);

    //Set up empty array and then push the relevent year objects into it
    var stateDataYear = [];
    for(var i = 0; i < vis.csvUS.length; i++ ) {
        if (vis.csvUS[i].year === vis.keyYear) {
            stateDataYear.push(vis.csvUS[i]);
        }
    }
    console.log(stateDataYear);

    //Create objects that can map to the state Fips code
    var keyById = {};
    var nameById = {};
    stateDataYear.forEach(function(d) {
        keyById[d.statefip] = d[vis.keyVar];
        nameById[d.statefip] = d.state;
    });
    console.log(keyById);

    //Alternate color scale domain - constant scale
     var domainExtent = d3.extent(d3.values(vis.csvUS), function(d) { return d[vis.keyVar]; });
     vis.colorScale.domain(domainExtent);
     console.log(domainExtent);

    //Find range and create array of color cutoff points for legend
    var colorBlocksize = (domainExtent[1]-domainExtent[0])/vis.colorBuckets;
    var colorCutoffs = [];
    for (i=0; i<vis.colorBuckets; i++) {
        if (vis.keyVar != "realIncWage") {
            colorCutoffs.push(Math.round(1000*(domainExtent[0] + i*colorBlocksize))/1000)
        } else {
            colorCutoffs.push(Math.round(domainExtent[0] + i*colorBlocksize))
        }
    };
    console.log(colorCutoffs);

    //add tip function
    vis.tipx.html(function(d) {
        if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
            return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
            "<br/> <strong>" + vis.keyVar + ": </strong> <span>" + vis.percent(keyById[d.id])  + "</span>";
        } else {
            return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
            "<br/> <strong>" + vis.keyVar + ": </strong> <span>" + keyById[d.id]  + "</span>";
        }
    });

    //Draw map
    var map = vis.frame.append("g")
        .attr("class", "states")
        .selectAll("vis.path")
        .data(usa)
        .enter().append("path")
        .attr("d", vis.path)
        .style("fill", function(d) {
            if ( isNaN(keyById[d.id]) === true  ) {
                return "#ccc";
            } else {
                return vis.colorScale(keyById[d.id]);
            }
        })
        .on('mouseover',vis.tipx.show)
        .on('mouseout', vis.tipx.hide)


    //Draw boundries, for further use note that I have to set the .boundary class fill to none in css otherwise it messes up paths
    vis.frame.insert("path", ".graticule")
        .datum(topojson.mesh(vis.usMap, vis.usMap.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", vis.path);

    //legend
    var legend = vis.frame.selectAll('rect')
        .data(colorbrewer.Purples[vis.colorBuckets])
        .enter()
        .append('rect')
        .attr("x", 0)
        .attr("y", function(d, i) {
            return (vis.height/3) - (i * 30);
        })
        .attr("width", 15)
        .attr("height", 30)
        .style("fill", function(d) {
            return d;
        });

    //legend text
    var text = vis.frame.selectAll("text")
        .data(colorCutoffs)
        .enter()
        .append('text')
        .attr("class", "legend-text")
        .attr("transform", function(d, i) {
            return "translate(" + (18) + "," + ((vis.height/3+15) - i*30) + ")"
        })
        .text(function(d) {
            if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
                return "> " + vis.percent(d);
            }
            else {
                return "> " + d;
            }
        });

    $(document).ready(function() {

        $('#stat-type').on('change', function() {
            vis.keyVar = this.value;
            vis.updateColors();
        });
    
        var $element = $('#timeslide');
        var $handle;
        
        $element
          .rangeslider({
            polyfill: false,
          })
          .on('input', function() {
            vis.keyYear = parseInt(this.value);  
            $('#range').text(vis.keyYear)
            vis.updateColors();
          });
    });
}

/*=================================================================
 * Update Colors etc. with new keyVar/keyYear
 *=================================================================*/
USMap.prototype.updateColors = function(){
    var vis = this;

    //Set up empty array and then push the relevent year objects into it
    var stateDataYear = [];
    for(var i = 0; i < vis.csvUS.length; i++ ) {
        if (vis.csvUS[i].year === vis.keyYear) {
            stateDataYear.push(vis.csvUS[i]);
        }
    }

    //Create objects that can map to the state Fips code
    var keyById = {};
    var nameById = {};
    stateDataYear.forEach(function(d) {
        keyById[d.statefip] = d[vis.keyVar];
        nameById[d.statefip] = d.state;
    });

    //Alternate color scale domain - constant scale
     var domainExtent = d3.extent(d3.values(vis.csvUS), function(d) { return d[vis.keyVar]; });
     vis.colorScale.domain(domainExtent);

    //Find range and create array of color cutoff points for legend
    var colorBlocksize = (domainExtent[1]-domainExtent[0])/vis.colorBuckets;
    var colorCutoffs = [];
    for (i=0; i<vis.colorBuckets; i++) {
        if (vis.keyVar != "realIncWage") {
            colorCutoffs.push(Math.round(1000*(domainExtent[0] + i*colorBlocksize))/1000)
        } else {
            colorCutoffs.push(Math.round(domainExtent[0] + i*colorBlocksize))
        }
    };

    //Update tip function
    vis.tipx.html(function(d) {
        if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
            return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
            "<br/> <strong>Value: </strong> <span>" + vis.percent(keyById[d.id])  + "</span>";
        } else {
            return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
            "<br/> <strong>Value: </strong> <span>" + keyById[d.id]  + "</span>";
        }
    });

    //Update choropleth colors
    d3.select("g.states")
        .selectAll("path")
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            if ( isNaN(keyById[d.id]) === true  ) {
                return "#ccc";
            } else {
                return vis.colorScale(keyById[d.id]);
            }
        });

    //Data join for new legend text
    var text = vis.frame.selectAll("text")
        .data(colorCutoffs);

    //Update
    text.attr("class", "legend-text");

    //Enter
    text.enter().append("text")
        .attr("class", "enter");

    //Enter + Update
    text.text(function(d) {
        if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
            return "> " + vis.percent(d);
        }
        else {
            return "> " + d;
        }
    });

    //Exit
    text.exit().remove();
}