$('#viz2-footer-note').hide();
$('#viz3-footer-note').hide();
$('#info-div').hide();
getVizChoro();


function getVizChoro() {

// --> CREATE SVG DRAWING AREA
    var margin = {top: 20, right: 140, bottom: 20, left: 20},
        width = 550 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var rateById = d3.map();

    var quantize = d3.scale.quantize()
        .domain([0, .15])
        .range(d3.range(9).map(function (i) {
            return "q" + i + "-9";
        }));

    var projection = d3.geo.mercator()
        .scale(320)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#cmap").append("svg")
        .attr("id", "choroViz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


// Use the Queue.js library to read two files
    var data1;
    var data2;

    queue()
        .defer(d3.json, "data/africa.topo.json")
        .defer(d3.csv, "data/global-malaria-2015.csv")
        .await(function (error, mapTopJson, malariaDataCsv) {

            // --> PROCESS DATA
            //console.log(mapTopJson);
            //console.log(malariaDataCsv);

            data1 = mapTopJson;
            data2 = malariaDataCsv;

            // Update choropleth
            updateChoropleth();

        });





//get iso code
    var isoCode;
    var countryData;
    var malariaDataByCountryId = {};
    var theData;

//////////////Got this function to abbrivate numbers for legend from StackExchange///////////////////////////////////
/////////////url -> http://stackoverflow.com/a/18154846 written by Gabe (http://stackoverflow.com/users/1220278/gabe)
    function abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
        number = Number(number)
        forceLetter = forceLetter || false
        if (forceLetter !== false) {
            return annotate(number, maxPlaces, forcePlaces, forceLetter)
        }
        var abbr
        if (number >= 1e12) {
            abbr = 'T'
        }
        else if (number >= 1e9) {
            abbr = 'B'
        }
        else if (number >= 1e6) {
            abbr = 'M'
        }
        else if (number >= 1e3) {
            abbr = 'K'
        }
        else {
            abbr = ''
        }
        return annotate(number, maxPlaces, forcePlaces, abbr)
    }

    function annotate(number, maxPlaces, forcePlaces, abbr) {
        // set places to false to not round
        var rounded = 0
        switch (abbr) {
            case 'T':
                rounded = number / 1e12
                break
            case 'B':
                rounded = number / 1e9
                break
            case 'M':
                rounded = number / 1e6
                break
            case 'K':
                rounded = number / 1e3
                break
            case '':
                rounded = number
                break
        }
        if (maxPlaces !== false) {
            var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
            if (test.test(('' + rounded))) {
                rounded = rounded.toFixed(maxPlaces)
            }
        }
        if (forcePlaces !== false) {
            rounded = Number(rounded).toFixed(forcePlaces)
        }
        return rounded + abbr
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////

    var getReqData = function (data1, data2, req) {

        for (var i = 0; i < data1.objects.collection.geometries.length; i++) {

            isoCode = data1.objects.collection.geometries[i].properties.adm0_a3;

            if (isoCode !== -99) {

                //build object with country data here
                //console.log(isoCode)

                for (var j = 0; j < data2.length; j++) {

                    countryData = data2[j];

                    var theLabel;

                    if (isoCode == countryData.Code) {

                        //console.log(isoCode);
                        //console.log(countryData.Code);

                        if (req == 1) {

                            theData = parseInt(data2[j].Suspected_malaria_cases);
                            theLabel = "Suspected Malaria Cases in Africa (by Millions)";

                        } else if (req == 2) {

                            theData = parseInt(data2[j].At_high_risk);
                            theLabel = "At High Risk of Malaria in Africa";

                        } else if (req == 3) {

                            theData = parseInt(data2[j].At_risk);
                            theLabel = "At Risk of Malaria in Africa";

                        } else { //default

                            theData = parseInt(data2[j].Malaria_cases);
                            theLabel = "Malaria Cases in Africa (by Millions)";
                            document.getElementById("viz1-title").innerHTML = "<h3>Reported Malaria Cases in Africa (2015)</h3>";
                        }

                        malariaDataByCountryId[isoCode] = theData;
                        document.getElementById("l-title").innerHTML = theLabel;

                    }
                }


            }
        }

    }


    function updateChoropleth() {

        // --> Choropleth implementation
        //console.log(data1);
        //console.log(data2);
        //console.log(data1.objects.collection.geometries.length);
        //console.log(data2[0].Code);

        console.log(malariaDataByCountryId);

        getReqData(data1, data2);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([10, 0])
            .html(function (d) {
                var theName = d.properties.name;
                var thePop = parseInt(d.properties.pop_est);

                var theIso = d.properties.adm0_a3_is;

                var malaria = malariaDataByCountryId[theIso];

                return "<span class='tip-title'>Country:</span> &nbsp;&nbsp;" + theName + "<br /><span class='tip-title'>Est. Pop.:</span> &nbsp;&nbsp;" + thePop + "<br /><span class='tip-title'>Malaria Cases:</span> &nbsp;&nbsp;" + malaria;
            });


        svg.call(tip);


        /*

         function noNaN( n ) { return isNaN( n ) ? 0 : n; }

         var keyTest = Object.keys(malariaDataByCountryId);

         for (var x=0; x<keyTest.length; x++){

         value = malariaDataByCountryId[keyTest[x]].Malaria_cases;

         }
         */


        var africa = topojson.feature(data1, data1.objects.collection).features;

        var theMin = d3.min(data2, function (d) {
            return parseInt(d.Malaria_cases)
        });
        var theMax = d3.max(data2, function (d) {
            return parseInt(d.Malaria_cases)
        });

        var color = d3.scale.ordinal()
            .domain([theMin, theMax])
            .range(colorbrewer.RdBu[5]);

        theMax = theMax / 10; //scale by 10

        var color = d3.scale.quantize()
            .domain([theMin, theMax])
            .range(colorbrewer.Greens[9]);


        svg.selectAll("path")
            .data(africa)
            .enter().append("path")
            .attr("class", "mapatt")
            .attr("d", path)
            .attr("fill", function (d, i) {

                console.log(malariaDataByCountryId);          //console.log(d.properties.adm0_a3_is);

                value = malariaDataByCountryId[d.properties.adm0_a3_is];

                console.log(color(value));

                if (value) {
                    return color(value);
                } else {
                    return '#ccc';
                }


            })
            .on("mouseover", function (d) {
                tip.show(d, document.getElementById("head"));
            })
            .on("mouseout", function (d) {
                tip.hide(d, document.getElementById("head"))
            });
        //

        var theResults;

        d3.select(".list-inline").remove();

        var legend = d3.select('#legend')
            .append('ul')
            .attr('class', 'list-inline');

        var keys = legend.selectAll('li.key')
            .data(color.range());

        keys.enter().append('li')
            .attr('class', 'key')
            .style('border-top-color', String)
            .text(function (d) {

                var r = color.invertExtent(d);

                var x = 0;

                if (x <= d.length) {
                    x = x + 1;
                    theResults = abbreviate(r[1], 0, false, false)
                    //console.log(abbreviate(r[0], 2, false, false) + "&nbsp; to &nbsp;" + abbreviate(r[1], 2, false, false))
                } else {
                    theResults = abbreviate(r[0], 2, false, false) + " <";
                    //console.log(abbreviate(r[0], 0, false, false) + " Greater than ")
                }

                return theResults;
            });


    }


    var SelectValue = d3.select("#request-type").on("change", redrawChart);

    var theMin;
    var theMax;

    function redrawChart() {

        var valNow = d3.select("#request-type").property("value");
        var africa = topojson.feature(data1, data1.objects.collection).features;
        //theMax = theMax / 10; //scale by 10
        var color = d3.scale.quantize();


        if (valNow == "At_risk") {

            getReqData(data1, data2, 3);
            theMin = d3.min(data2, function (d) {
                return parseInt(d.At_risk)
            });
            theMax = d3.max(data2, function (d) {
                return parseInt(d.At_risk)
            });
            color.domain([theMin, theMax]);
            color.range(colorbrewer.Blues[9]);

        } else if (valNow == "At_high_risk") {

            getReqData(data1, data2, 2);
            theMin = d3.min(data2, function (d) {
                return parseInt(d.At_high_risk)
            });
            theMax = d3.max(data2, function (d) {
                return parseInt(d.At_high_risk)
            });
            color.domain([theMin, theMax]);
            color.range(colorbrewer.Purples[6]);

        } else if (valNow == "Suspected_malaria_cases") {

            getReqData(data1, data2, 1);
            theMin = d3.min(data2, function (d) {
                return parseInt(d.Suspected_malaria_cases)
            });
            theMax = d3.max(data2, function (d) {
                return parseInt(d.Suspected_malaria_cases)
            });

            theMax = theMax / 100;
            color.domain([theMin, theMax]);
            color.range(colorbrewer.Oranges[9]);

        } else if (valNow == "Malaria_cases") {//default Malaria_cases

            getReqData(data1, data2);
            theMin = d3.min(data2, function (d) {
                return parseInt(d.Malaria_cases)
            });
            theMax = d3.max(data2, function (d) {
                return parseInt(d.Malaria_cases)
            });
            theMax = theMax / 10;
            color.domain([theMin, theMax]);
            color.range(colorbrewer.Greens[9]);
        }


        //svg.selectAll(".mapatt").remove();
        svg.selectAll("path")
            .data(africa)
            .transition()
            .duration(1000)
            .attr("class", "mapatt")
            .attr("d", path)
            .attr("fill", function (d, i) {

                value = malariaDataByCountryId[d.properties.adm0_a3_is];

                console.log(color(value));

                if (value) {
                    return color(value);
                } else {
                    return '#ccc';
                }


            });

        var theResults;

        d3.select(".list-inline").remove();

        var legend = d3.select('#legend')
            .append('ul')
            .attr('class', 'list-inline');

        var keys = legend.selectAll('li.key')
            .data(color.range());

        keys.enter().append('li')
            .transition()
            .duration(1000)
            .attr('class', 'key')
            .style('border-top-color', String)
            .text(function (d) {

                var r = color.invertExtent(d);

                var x = 0;

                if (x <= d.length) {
                    x = x + 1;
                    theResults = abbreviate(r[1], 0, false, false)
                    //console.log(abbreviate(r[0], 2, false, false) + "&nbsp; to &nbsp;" + abbreviate(r[1], 2, false, false))
                } else {
                    theResults = abbreviate(r[0], 2, false, false) + " <";
                    //console.log(abbreviate(r[0], 0, false, false) + " Greater than ")
                }

                return theResults; //d; //formats.percent(r[0]);
            });

    }

}




$('#cases').on('click', function (e) {

    var barVizDom = document.getElementById("barViz");
    var totalVizDom = document.getElementById("totalViz");
    var choroVizDom = document.getElementById("choroViz");

    if (barVizDom) {
        var moveIt = remove("barViz");
    }

    if(totalVizDom) {
        var moveIt = remove("totalViz");
    }

    $('#legend').show();
    $('#option-control').show();
    $('#viz1-title').show();
    $('#viz2-title').hide();
    $('#viz2-footer-note').hide();
    $('#viz3-title').hide();
    $('#info-div').hide();
    $('#viz3-footer-note').hide();

    //prevent double clicking debacle
    if (choroVizDom !== null){
        var moveIt = remove("choroViz")
    }
    getVizChoro();

})
