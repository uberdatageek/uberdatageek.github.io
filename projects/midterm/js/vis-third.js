//bar chart
//getVizTotal();
function getVizTotal() {

    document.getElementById("viz3-footer-note").innerHTML="* Funding amount in millions";


    var margin = {top: 40, right: 10, bottom: 60, left: 60};

    var width = 560 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#viz3-chart").append("svg")
        .attr("id", "totalViz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([30, 0])
        .html(function (d) {
            var theAmount = d.value;

            return "<span class='tip-title'>Total Funding:</span> &nbsp;&nbsp;" + theAmount;
        });


    svg.call(tip);

// Scales
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var data3;

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

            console.log(d["Source"][0]);

        })

        data3 = data;

        updateVis();

    });


// Render visualization
    function updateVis() {

        document.getElementById("viz3-title").innerHTML = "<h3>Total Global Funding for Malaria (by Year)</h3>"

            x.domain(d3.keys(data3[0]).filter(function (key) {
            return key !== "Source";
        }));

        var yrNames = d3.keys(data3[0]).filter(function (key) {
            return key !== "Source";
        });
        var myData = {};
        data3.forEach(function (d) {
            d.ages = yrNames.map(function (name) {
                return {name: name, value: +d[name]};
            });
            myData = d.ages;

        });
        console.log(myData)

        y.domain([0, d3.max(myData, function (d) {
            console.log(d);
            return d3.max(myData, function (d) {
                return d.value;
            });
        })])

        svg.append("g")
            .attr("class", "x axis")
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
            .text("Funding");

        svg.selectAll(".bar")
            .data(myData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.name);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                console.log(d);
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .on("mouseover", function (d) {
                tip.show(d, document.getElementById("head"));
            })
            .on("mouseout", function (d) {
                tip.hide(d, document.getElementById("head"))
            });

    }

}

$('#total-funding').on('click', function (e) {

    var barVizDom = document.getElementById("barViz");
    var choroVizDom = document.getElementById("choroViz");
    var totalVizDom = document.getElementById("totalViz");

    if (barVizDom) {
        var moveIt = remove("barViz");
    }

    if(choroVizDom) {
        var moveIt = remove("choroViz");
    }

    $('#legend').hide();
    $('#option-control').hide();
    $('#viz1-title').hide();
    $('#viz2-title').hide();
    $('#viz2-footer-note').hide();
    $('#info-div').hide();
    $('#viz3-title').show();
    $('#viz3-footer-note').show();

    //prevent double clicking debacle
    if (totalVizDom !== null){
        var moveIt = remove("totalViz")
    }

    getVizTotal();

})