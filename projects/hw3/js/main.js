d3.csv("data/buildings/buildings.csv", function(data) {


    console.log(data);
    //Checking all data types
    for(var i=0; i < data.length; i++){

        console.log(data[i].building);
        console.log(data[i].country);
        console.log(data[i].city);
        console.log(data[i].height_m);
        console.log(data[i].height_ft);
        console.log(data[i].height_px);
        console.log(data[i].floors);
        console.log(data[i].completed);
        console.log(data[i].image);

    }

    //Default values
    var building = data[0].building;
    document.getElementById("building").innerHTML="<b>" + building + "</b>";

    var country = data[0].country;
    document.getElementById("country").innerHTML="<b>" + country + "</b>";

    var city = data[0].city;
    document.getElementById("city").innerHTML="<b>" + city + "</b>";

    var height = data[0].height_m;
    document.getElementById("height").innerHTML="<b>" + height + "</b>";

    var floors = data[0].floors;
    document.getElementById("floors").innerHTML="<b>" + floors + "</b>";

    var completed = data[0].completed;
    document.getElementById("completed").innerHTML="<b>" + completed + "</b>";

    var the_image = data[0].image;
    document.getElementById("the-img").innerHTML='<img src="data/buildings/img/' + the_image + '" class="the-img"/>';

    var theCount = 0;
    for (var i=0; i < data.length; i++) {

            theCount = theCount + 1;
        //get count

        document.getElementById("building-count").innerHTML="<p>Total Number of buildings:<b> &nbsp;" + theCount + "</b></p>";

    }

    //Set size variables
    var width = 500;
    var height = 500;
    var barHeight = 30;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10,40])
        .html(function(d) {
            var theBuilding = d.building;
            return "<strong>Click for more info on</strong> <span style='color:pink'>" + theBuilding + "</span>";

        });

    //Select the <body> and create a new SVG element
    //with the width and height values set above.
    var svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.call(tip);

    //Create a series of 'rect' elements within the SVG,
    //with each 'rect' referencing a corresponding data values
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .sort(function(a,b){
            return b.height_m - a.height_m;
        })
        .attr("fill", "blue")
        .attr("x", 180)
        .attr("y", function(d, i) {
            return i * barHeight;
        })
        .attr("width", function(d) {
            return parseInt(d.height_px) / 1.2;
        })
        .attr("height", barHeight - 10)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "pink");
            tip.show(d, document.getElementById("head"));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "blue");
            tip.hide(d, document.getElementById("head"));
        })
        .on("click", function(d) {

            document.getElementById("building").innerHTML="<b>" + d.building + "</b>";

            document.getElementById("country").innerHTML="<b>" + d.country + "</b>";

            document.getElementById("city").innerHTML="<b>" + d.city + "</b>";

            document.getElementById("height").innerHTML="<b>" + d.height_m + "</b>";

            document.getElementById("floors").innerHTML="<b>" + d.floors + "</b>";

            document.getElementById("completed").innerHTML="<b>" + d.completed + "</b>";

            document.getElementById("the-img").innerHTML='<img src="data/buildings/img/' + d.image + '" class="the-img"/>';

        });




    /* Tried adding a class - bld.height - but for some unknown reason the text did not show up in the graph. I was able to see it in the console however.
    svg.selectAll("span.bld-height")
        .data(data)
        .enter()
        .append("span")
        .attr("class","bld-height")
         .sort(function(a,b){
            return b.height_m - a.building_m;
         })
        .append("text", function(d) {
            return d.height_m;
        })
        .attr("y", function(d, i) {
            return i * barHeight + 14;
        })
        .attr("x", function(d) {
            return d.height_px - 10;
        })
        .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill","red")
            .attr("text-anchor","end");
    */



    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .sort(function(a,b){
            return b.height_m - a.height_m;
        })
        .text(function(d) {
            return d.height_m;
        })
        .attr("y", function(d, i) {
            return i * barHeight + 14;
        })
        .attr("x", function(d) {
            var theFig = parseInt(d.height_px) / 1.2;

            return (theFig + 170) - 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill","white");
       // .attr("text-anchor","end");

    /*svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", function(d, i) {
            return i * barHeight + 14;
        })
        .attr("dy", ".55em")
        .attr("transform", "translate(30,0)")
        .text("Go Go Go Go");*/

    svg.selectAll("g")
        .data(data)
        .enter()
        .append("text")
        .sort(function(a,b){
            return b.height_m - a.height_m;
        })
        .text(function(d) {
            return d.building;
        })
        .attr("y", function(d, i) {
            return i * barHeight + 14;
        })
        .attr("x", function(d) {
            return 0;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill","black");
        //.attr("text-anchor","end");

});