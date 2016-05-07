CAMap = function(_parentElement, _map, _data){
  this.parentElement = _parentElement;
  this.caMap = _map;
  this.csvCA = _data;
  this.displayData = []; // unused right now could be useful for years though.

  // DEBUG RAW DATA
  //console.log(this.csvCA);
  //console.log(this.usMap);

  this.initVis();
}

/*=================================================================
* Initialize visualization (static content, e.g. SVG area or axes)
*=================================================================*/

CAMap.prototype.initVis = function(){
    var vis = this;

    $("#group-one").show();
    $("#group-two").hide();
    $("#viewTwo").css("color", "gray");
    $("#viewTwo").css("font-size", "20px");
    $("#viewOne").css("color", "crimson");
    $("#viewOne").css("font-size", "28px");
    document.getElementById("viewcloud").innerHTML= '<a href="#" data-toggle="modal" data-target="#myModal1" title="Santa Clara County Companies">View WordCloud</a>';

    vis.margin = {top: 30, right: 10, bottom: 10, left: 10};

    vis.width = 700 - vis.margin.left - vis.margin.right,
    vis.height = 700 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#ca-map").append("svg")
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
    //EITHER FIND CA MAP OR FIX ZOOM OR FILTER JSON OR SOMETHING!
    vis.projection = d3.geo.albersUsa()
        .translate([1100,375])
        .scale([3200]);

    //Define default path generator
    vis.path = d3.geo.path()
        .projection(vis.projection);

    //Define percentage format
    vis.percent = d3.format("2.1%");        

    //Initialize tooltip 
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]); 

    vis.frame.call(vis.tip); 

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
}

/*=================================================================
* Data Wrangling
*=================================================================*/
CAMap.prototype.wrangleData = function(){
    var vis = this;

    //No data wrangling needed here for now

    // Update the visualization
    vis.updateVis();
}


/*=================================================================
 * The drawing function - should use the D3 update sequence 
 * Function parameters only needed if different kinds of updates are needed
*=================================================================*/

 CAMap.prototype.updateVis = function(){
    var vis = this;

    //get current keyVar value from dropdown
    vis.keyVar = d3.select("#stat-type2").property("value");

    //get current year value from slider
    vis.keyYear = parseInt(d3.select("#timeslide2").property("value"));
    console.log(vis.keyYear);

     vis.theYear = d3.select("#getgini").property("value");


    // Convert TopoJSON to GeoJSON
    var ca = topojson.feature(vis.caMap, vis.caMap.objects.subunits).features;

    //console.log(ca);
    //console.log(vis.csvCA);

    //Set up empty array and then push the relevent year objects into it

     var santaClara;
     var losAngeles;
     var sanMateo;
     var sonoma;

    var countyDataYear = [];
    for(var i = 0; i < vis.csvCA.length; i++ ) {
        if (vis.csvCA[i].year === vis.keyYear) {
            countyDataYear.push(vis.csvCA[i]);
        }

        if (vis.csvCA[i].county == "Los Angeles" & vis.csvCA[i].year == "1998") {
            losAngeles = vis.csvCA[i].gini;
            document.getElementById("la").innerHTML= losAngeles;
        }

        if (vis.csvCA[i].county == "Santa Clara" & vis.csvCA[i].year == "1998"){
            santaClara = vis.csvCA[i].gini;
            document.getElementById("santaclara").innerHTML=santaClara;
        }

        if (vis.csvCA[i].county == "San Mateo" & vis.csvCA[i].year == "1998"){
            sanMateo= vis.csvCA[i].gini;
            document.getElementById("sanmateo").innerHTML=sanMateo;
        }

        if (vis.csvCA[i].county == "Sonoma" & vis.csvCA[i].year == "1998"){
            sonoma = vis.csvCA[i].gini;
            document.getElementById("sonoma").innerHTML=sonoma;
        }

    }

     if (santaClara > losAngeles ) {
         document.getElementById("amountTo").innerHTML=">";
     } else if (santaClara < losAngeles) {
         document.getElementById("amountTo").innerHTML="<";
     } else {
         document.getElementById("amountTo").innerHTML="=";
     }

     if (sanMateo > sonoma ) {
         document.getElementById("amountToNext").innerHTML=">";
     } else if (sanMateo < sonoma) {
         document.getElementById("amountToNext").innerHTML="<";
     } else {
         document.getElementById("amountToNext").innerHTML="=";
     }

    console.log(countyDataYear);

    //Create objects that can map to the county Fips code
    var keyById = {};
    var nameById = {};
    countyDataYear.forEach(function(d) { 
        keyById[d.countyfip] = d[vis.keyVar];
        nameById[d.countyfip] = d.county;
    });
    console.log(keyById);

    //Alternate color scale domain - constant scale
    var domainExtent = d3.extent(d3.values(vis.csvCA), function(d) { return d[vis.keyVar]; });
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
    vis.tip.html(function(d) {
        if (keyById[d.id] == undefined) {
            return "<strong>County: No Data Available </strong> <span>"  + ///
            "<br/> <strong>Value: No Data Available </strong> <span>"  + "</span>";
        } else {
            if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
                return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
                "<br/> <strong>Value: </strong> <span>" + vis.percent(keyById[d.id])  + "</span>";
            } else {
                return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
                "<br/> <strong>Value: </strong> <span>" + keyById[d.id]  + "</span>";
            }
        }
    });

    //Draw map
    var map = vis.frame.append("g")
        .attr("class", "counties")
        .selectAll("vis.path")
        .data(ca)
        .enter().append("path")
        .attr("d", vis.path)
        .style("fill", function(d) {

        if ( isNaN(keyById[d.id]) === true  ) {
                return "#ccc";
            } else {
                return vis.colorScale(keyById[d.id]); 
            }
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);        

    //Draw boundries, for further use note that I have to set the .boundary class fill to none in css otherwise it messes up paths
    vis.frame.insert("path", ".graticule")
      .datum(topojson.mesh(vis.caMap, vis.caMap.objects.subunits, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", vis.path);

    //legend                            
    var legend = vis.frame.selectAll('rect')
        .data(colorbrewer.Purples[vis.colorBuckets])
        .enter()
        .append('rect')
        .attr("transform","translate(450,-230)")
        .attr("x", 0)
        .attr("y", function(d, i) {
           return (vis.height-30) - (i * 30);
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
            return "translate(" + (472) + "," + ((vis.height-240) - i*30) + ")"
        })
        .text(function(d) {
            if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
                return "> " + vis.percent(d);
            }
            else {
                return "> " + d;
            }
        });

    //JQuery to update Colors on dropdown change or timeslide change, pass in new value of dropdown selection and year
    $(document).ready(function() {

        $('#viewOne').on('click', function (e) {
            $("#group-one").show();
            $("#group-two").hide();
            $("#viewTwo").css("color", "gray");
            $("#viewTwo").css("font-size", "20px");
            $("#viewOne").css("color", "crimson");
            $("#viewOne").css("font-size", "28px");
            document.getElementById("viewcloud").innerHTML= '<a href="#" data-toggle="modal" data-target="#myModal1" title="Santa Clara County Companies">View WordCloud</a>';

            return false;
        })

        $('#viewTwo').on('click', function (e) {
            $("#group-one").hide();
            $("#group-two").show();
            $("#viewOne").css("color", "gray");
            $("#viewOne").css("font-size", "20px");
            $("#viewTwo").css("color", "crimson");
            $("#viewTwo").css("font-size", "28px");
            document.getElementById("viewcloud").innerHTML= '<a href="#" data-toggle="modal" data-target="#myModal2" title="San Mateo County Companies">View WordCloud</a>';

            return false;
        })

        $('#stat-type2').on('change', function() {
            vis.keyVar = this.value;
            vis.updateColors();
        });

        var $element = $('#timeslide2');
        var $handle;
        
        $element
          .rangeslider({
            polyfill: false,
          })
          .on('input', function() {
            vis.keyYear = parseInt(this.value);  
            $('#range2').text(vis.keyYear)
            vis.updateColors();
          });

        $('#getgini').on('change', function() {


            vis.theYear = parseInt(this.value);

            for(var i = 0; i < vis.csvCA.length; i++ ) {

                if (vis.csvCA[i].year == vis.theYear){
                    //Update each field
                    //update #la 18  update santaclara 5

                    if (vis.csvCA[i].county == "Los Angeles") {
                        losAngeles = vis.csvCA[i].gini;
                        document.getElementById("la").innerHTML= losAngeles;

                    }

                    if (vis.csvCA[i].county == "Santa Clara"){
                        santaClara = vis.csvCA[i].gini;
                        document.getElementById("santaclara").innerHTML= santaClara;

                    }

                    if (vis.csvCA[i].county == "San Mateo"){
                        sanMateo = vis.csvCA[i].gini;
                        document.getElementById("sanmateo").innerHTML= sanMateo;

                    }

                    if (vis.csvCA[i].county == "Sonoma"){
                        sonoma = vis.csvCA[i].gini;
                        document.getElementById("sonoma").innerHTML= sonoma;

                    }

                    if (santaClara > losAngeles ) {
                        document.getElementById("amountTo").innerHTML=">";
                    } else if (santaClara < losAngeles) {
                        document.getElementById("amountTo").innerHTML="<";
                    } else {
                        document.getElementById("amountTo").innerHTML="=";
                    }

                    if (sanMateo > sonoma ) {
                        document.getElementById("amountToNext").innerHTML=">";
                    } else if (sanMateo < sonoma) {
                        document.getElementById("amountToNext").innerHTML="<";
                    } else {
                        document.getElementById("amountToNext").innerHTML="=";
                    }

                }
            }

        });


    });

}

/*=================================================================
* Update Colors etc. with new keyVar/keyYear
*=================================================================*/
CAMap.prototype.updateColors = function(){
    var vis = this;

    //Set up empty array and then push the relevent year objects into it
    var countyDataYear = [];
    for(var i = 0; i < vis.csvCA.length; i++ ) {
        if (vis.csvCA[i].year === vis.keyYear) {
            countyDataYear.push(vis.csvCA[i]);
        }
    }

    //Create objects that can map to the county Fips code
    var keyById = {};
    var nameById = {};
    countyDataYear.forEach(function(d) { 
        keyById[d.countyfip] = d[vis.keyVar];
        nameById[d.countyfip] = d.county;
    });

    //Alternate color scale domain - constant scale
    var domainExtent = d3.extent(d3.values(vis.csvCA), function(d) { return d[vis.keyVar]; });
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
    //console.log(colorCutoffs);

    //Update tip function
    vis.tip.html(function(d) {
        if (keyById[d.id] == undefined) {
            return "<strong>County: No Data Available </strong> <span>"  + ///
            "<br/> <strong>Value: No Data Available </strong> <span>"  + "</span>";
        } else {
            if (vis.keyVar == "pctTechnicalWorker" || vis.keyVar == "unemployementRate" ) {
                return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
                "<br/> <strong>Value: </strong> <span>" + vis.percent(keyById[d.id])  + "</span>";
            } else {
                return "<strong>State: </strong> <span>" + nameById[d.id]  + ///
                "<br/> <strong>Value: </strong> <span>" + keyById[d.id]  + "</span>";
            }
        }
    });

    //Update choropleth colors
    d3.select("g.counties")
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
