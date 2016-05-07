
function getVizBar() {

    document.getElementById("viz2-footer-note").innerHTML="* Funding amount in millions";
    document.getElementById("info-div").innerHTML="click to view yr";

    var margin = {top: 20, right: 10, bottom: 80, left: 60},
        width = 550 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#viz2-chart").append("svg")
        .attr("id", "barViz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(colorbrewer.Blues[4]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .outerTickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    function splicObj(theObj, k, v) {

        for (var i = 0; i < theObj.length; i++) {

            if (theObj[i][k] == v) {

                return theObj.splice(i, 1);
            }

        }
    }

    var data3;

    d3.csv("data/global-funding.csv", function (data) {

        //for(var i=0; i<data.length; i++) {
        //alert(data[i].type + " " + data[i].percentage);
        //}

        data.filter(function (d, i) {
            //d.percentage = +d.percentage;

            d["2005"] = +d["2005"].replace("$", "").trim();
            d["2006"] = +d["2006"].replace("$", "").trim();
            d["2007"] = +d["2007"].replace("$", "").trim();
            d["2008"] = +d["2008"].replace("$", "").trim();
            d["2009"] = +d["2009"].replace("$", "").trim();
            d["2010"] = +d["2010"].replace("$", "").trim();
            d["2011"] = +d["2011"].replace("$", "").trim();
            d["2012"] = +d["2012"].replace("$", "").trim();
            d["2013"] = +d["2013"].replace("$", "").trim();


            //console.log(d["Source"][0]);

        })

        splicObj(data, 'Source', 'Total');

        data3 = data;

        updateVis();

    });


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([10, 0])
        .html(function (d) {

            var theFunding = d.value;
            var whenYr = d.name;

            return "<span class='tip-title'>Funding (in millions):</span> &nbsp;&nbsp;" + theFunding + "<br /><span class='tip-title'>Year:</span> &nbsp;&nbsp;" + whenYr;

        });


    svg.call(tip);


    var yrNames;
    var yrNamesL;

    // Render visualization
    function updateVis() {

        document.getElementById("viz2-title").innerHTML = "<h3>Global Malaria Funding (2005 - 2013)</h3>";

        yrNames = d3.keys(data3[0]).filter(function (key) {
            return /*key == "2007";*/ key !== "Source";
        });

        yrNamesL = d3.keys(data3[0]).filter(function (key) {
            return key !== "Source";
        });

        data3.forEach(function (d) {
            d.yrs = yrNames.map(function (name) {
                return {name: name, value: +d[name]};
            });
        });

        x0.domain(data3.map(function (d) {
            return d.Source;
        }));
        x1.domain(yrNames).rangeRoundBands([0, x0.rangeBand()]);

        var theMax = d3.max(data3, function (d) {
            return d3.max(d.yrs, function (d) {
                return d.value;
            });
        });
        console.log(theMax);

        y.domain([0, theMax]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("y", -15)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Funding *");

        svg.selectAll(".tick")
            .each(function (d, i) {
                if (i == 6) {
                    this.remove();
                }
            });

        var source = svg.selectAll(".source")
            .data(data3)
            .enter().append("g")
            .attr("class", "source")
            .attr("transform", function (d) { /*return "translate(" + x0(d.Source) + ",0)";*/
                if (d.Source !== "Total") {
                    return "translate(" + x0(d.Source) + ",0)";
                } else {
                    d3.select(this).remove();
                }
            });

        source.selectAll("rect").remove();
        source.selectAll("rect")
            .data(function (d) {
                return d.yrs;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.name);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .style("fill", function (d) {
                return color(d.name);
            })
            .on("mouseover", function (d) {
                tip.show(d, document.getElementById("head"));
            })
            .on("mouseout", function (d) {
                tip.hide(d, document.getElementById("head"))
            });

        var legend = svg.selectAll(".legend")
            .data(yrNamesL.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .on("mouseover", function (d) {
                d3.select(this).style("stroke", "#9a8465");
                //alert(d); //the yr
            })
            .on("mouseout", function (d) {
                d3.select(this).style("stroke", "none");
            })
            .on("click", function (d) {
                updateBars(d);
            });
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });


    }

    var yrVal;

    function updateBars(d) {

        yrVal = d;

        document.getElementById("viz2-title").innerHTML = "<h3>Global Malaria Funding for " + yrVal + "</h3>";

        d3.csv("data/global-funding.csv", function (data) {

            data.filter(function (d, i) {
                //d.percentage = +d.percentage;

                d["2005"] = +d["2005"].replace("$", "").trim();
                d["2006"] = +d["2006"].replace("$", "").trim();
                d["2007"] = +d["2007"].replace("$", "").trim();
                d["2008"] = +d["2008"].replace("$", "").trim();
                d["2009"] = +d["2009"].replace("$", "").trim();
                d["2010"] = +d["2010"].replace("$", "").trim();
                d["2011"] = +d["2011"].replace("$", "").trim();
                d["2012"] = +d["2012"].replace("$", "").trim();
                d["2013"] = +d["2013"].replace("$", "").trim();

            })

            //shortcut hack... need to write a function to perform this...
            splicObj(data, 'Source', 'Total');
            data3 = data;

        });


        yrNames = d3.keys(data3[0]).filter(function (key) {
            return key == yrVal;
            /*key !== "Source";*/
        });

        yrNamesL = d3.keys(data3[0]).filter(function (key) {
            return key !== "Source";
        });

        data3.forEach(function (d) {
            d.yrs = yrNames.map(function (name) {
                return {name: name, value: +d[name]};
            });
        });

        x0.domain(data3.map(function (d) {
            return d.Source;
        }));
        x1.domain(yrNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data3, function (d) {
            return d3.max(d.yrs, function (d) {
                return d.value;
            });
        })])


        svg.selectAll(".y.axis")
            .transition()
            .attr("class", "y axis")
            .call(yAxis);

        var source = svg.selectAll(".source")
            .data(data3)
            //.enter().append("g")
            .attr("class", "source")
            .attr("transform", function (d) { /*return "translate(" + x0(d.Source) + ",0)"; */
                if (d.Source !== "Total") {
                    return "translate(" + x0(d.Source) + ",0)";
                } else {
                    d3.select(this).remove();
                }
            });

        source.selectAll("rect").remove();
        source.selectAll("rect")
            .data(function (d) {
                return d.yrs;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.name);
            })
            .style("fill", function (d) {
                return color(d.name);
            })
            .transition()
            .duration(800)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });


        /**/source.selectAll("rect")
            .on("mouseover", function (d) {
                tip.show(d, document.getElementById("head"));
            })
            .on("mouseout", function (d) {
                tip.hide(d, document.getElementById("head"))
            });

    }



}

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

$('#funding').on('click', function (e) {

    var choroVizDom = document.getElementById("choroViz");
    var totalVizDom = document.getElementById("totalViz");
    var barVizDom = document.getElementById("barViz");


    if (choroVizDom) {
        var moveIt = remove("choroViz");
    }

    if(totalVizDom) {
        var moveIt = remove("totalViz");
    }

    $('#legend').hide();
    $('#option-control').hide();
    $('#viz1-title').hide();
    $('#viz2-title').show();
    $('#viz2-footer-note').show();
    $('#viz3-title').hide();
    $('#info-div').show();
    $('#viz3-footer-note').hide();

    //prevent double clicking debacle
    if (barVizDom !== null){
        var moveIt = remove("barViz")
    }
    getVizBar();


})
