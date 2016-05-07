//Activity I #4
/*d3.select("body")
    .append("div")
    .text("Dynamic Content");*/

//Activity II #1 - 3
/*var sandwiches = [
    { name: "Thesis", price: 7.95, size: "large"},
    { name: "Dissertation", price: 8.95, size: "large"},
    { name: "Highlander", price: 6.50, size: "small"},
    { name: "Just Tuna", price: 6.50, size: "small"},
    { name: "So-La", price: 7.95, size: "large"},
    { name: "Special", price: 12.50, size: "small"}
];

var svg=d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 800);

svg.selectAll("circle")
    .data(sandwiches)
    .enter()
    .append("circle")
    .attr("fill", function(d){
        var cVal = "blue";
        if (d.price < 7.00) {
            cVal = "red";
        }
        return cVal;
    })
    .attr("stroke", "gray")
    .attr("stroke-width", 3)
    .attr("cy", 45)
    .attr("cx", function(d, index) {
       var xVal = 0;
       if (index == 0) {
           xVal = index + 45; //padding of a sort for 1st circle
       } else {
           xVal = index * 100 + 45;
       }
        return xVal;
    })
    .attr("r",function(d) {
        var rVal = 20;
        if(d.size == "large") {
            rVal = 40;
        }
        return rVal;
    });
*/

//Activity III
//Information is stored in CSV (Comma Separated Value) format
//Properties include: city, country, EU status, population, X & Y coordinates
d3.csv("data/cities.csv", function(data) {


    //Filtering out all the non-EU Countries
    //data = data.filter(function (el) {
        //return (el.city = "Brussels");
    //});
    console.log(data);
    //Checking all data types
    for(var i=0; i < data.length; i++){

        console.log(typeof data[i].city);
        console.log(typeof data[i].country);
        console.log(typeof data[i].eu);
        console.log(typeof data[i].population);
        console.log(typeof data[i].x);
        console.log(typeof data[i].y);

    }


});

d3.csv("data/cities.csv", function(data) {

    var theCount = 0;
    for (var i=0; i < data.length; i++) {
        if(data[i].eu == "true"){
            theCount = theCount + 1;
        }
        //get count

        document.getElementById("city-count").innerHTML="<p><b>Total Number of Cities:</b> &nbsp;" + theCount + "</p>";

    }

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10,0])
        .html(function(d) {
            var smallName = "";
            var thePop = d.population.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); //adding commas to population total

            if(d.population < 1000000){
                smallName = "<strong>City:</strong> <span style='color:gray'>" + d.city + "</span><br />";
            }

            return smallName + "<strong>Population:</strong> <span style='color:pink'>" + thePop + "</span>";
        });

    var svg=d3.select("body").append("svg")
        .attr("width", 700)
        .attr("height", 550);

    svg.call(tip);

    svg.selectAll(".city-label")
        .data(data)
        .enter()
        .append("circle")
        .filter(function(d) {
            return d.eu == "true";
        })
        .attr("fill", "lightgreen")
        .attr("cy", function(d){
            d.y = parseInt(d.y) + 40; //simple hack to move viz down 40px to keep on svg canvas
            return d.y;
        })
        .attr("cx", function(d, index) {
            d.x = parseInt(d.x) + 40; //simple hack to move viz right 40px to keep on svg canvas
            return d.x;
        })
        .attr("r", function(d){

            var newRadius = 0;
            if(parseInt(d.population) < 1000000 ){
                newRadius = 4;
            } else {
                newRadius = 8;
            }
            return newRadius;

        })
        //.on('mouseover',tip.show)
        //.on('mouseout', tip.hide)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "pink");
            tip.show(d, document.getElementById("head"));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "lightgreen");
            tip.hide(d, document.getElementById("head"))
        })
        .on("click", function(d) {
            alert("Population: " + d.population.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .filter(function(d) {
            return d.eu == "true";
        })
        .attr("class", "city-label")
        .text(function(d) {
            if(parseInt(d.population) > 1000000) {
                return d.city;
            }
        })
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            if(d.city == "Tokyo") {
                d.y = d.y + 20;
            }

            return d.y;
        });

});