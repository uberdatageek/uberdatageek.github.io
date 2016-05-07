
// SVG Size
//var width = 700,
		//height = 500;

//Padding applied
var padding = 0;
// Margin object with properties for the four directions
var margin = {top: 20, right: 10, bottom: 20, left: 10};

// Width and height as the inner dimensions of the chart area
var width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	//Note: Country, Population and Region -> Nominal Data
	//Note: Income, LifeExpectancy & Population -> quantitative

	for(var i=0; i<data.length; i++) {

		//Country,LifeExpectancy,Income,Population,Region
		data[i].LifeExpectancy=parseFloat(data[i].LifeExpectancy);
		//console.log(data[i].LifeExpectancy);
		data[i].Income=parseInt(data[i].Income);
		//console.log(data[i].Income);
		data[i].Population=parseInt(data[i].Population);
		//console.log(data[i].Population);

	}
	data.filter(function(d,i){
		d.LifeExpectancy = +d.LifeExpectancy;
		d.Income = +d.Income;
		d.Population = +d.Population;
	})

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10,0])
		.html(function(d) {
			var theName = d.Country;
			//convert to string so func can work
			var thePop = d.Population.toString();
			thePop = thePop.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

			return theName + "&nbsp;&nbsp;<br /><strong>Population:</strong> <span style='color:orange'>" + thePop + "</span>";
		});


	var svg = d3.select("#chart-area").append("svg")
		//.attr("width", width)
		//.attr("height", height);
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	//Scales.... x & y respectively////////////////////////////////////////////////////////////////////////////////////////////////////
	var iMin = d3.min(data, function(d) { return d.Income - 80; });
	var iMax = d3.max(data, function(d) { return d.Income; });

	var incomeScale = d3.scale.log() //linear()
		.domain([iMin, iMax])
		//.range([padding, width]);
		.range([margin.left,width - margin.right]);

	console.log("MIN " + iMin + " AND MAX " + iMax);

	var lMin = d3.min(data, function(d) { return d.LifeExpectancy - 2; });
	var lMax = d3.max(data, function(d) { return d.LifeExpectancy; });

	console.log("MIN " + lMin + " AND MAX " + lMax);


	var lifeExpectancyScale = d3.scale.linear()
		.domain([lMin, lMax])
		//.range([height - 10, 20]);
		//.nice();
		.range([height - margin.bottom + 10, margin.top + 20]);

	var rMin = d3.min(data, function(d) { return d.Population; });
	var rMax = d3.max(data, function(d) { return d.Population; });

	var populationScale = d3.scale.linear()
		.domain([rMin, rMax])
		.range([4,30]);


	var colorScale = d3.scale.category20()
		.domain(data.map(function(d) { return d.Region;}));
		//.range(["darkgreen","lightgreen"]);


	var xAxis = d3.svg.axis()
		.scale(incomeScale)
		.orient("bottom")
		.tickValues([1000,2000,4000,8000,16000,32000,100000])
		.tickFormat(function(d){
			return incomeScale.tickFormat(20,d3.format(",d"))(d)
		});

	var yAxis = d3.svg.axis()
		.scale(lifeExpectancyScale)
		.orient("left")
		.tickValues([50,55,60,65,70,75,80]);

	//test
	//console.log(incomeScale(5000));
	//console.log(lifeExpectancyScale(68));

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	svg.selectAll(".pop-label")
		.data(data)
		.enter()
		.append("circle")
		.sort(function(a,b){
			return b.Population - a.Population;
		})
		//.attr("fill", "red")
		.attr("fill", function(d){
			return colorScale(d.Region);
		})
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.attr("cy", function(d){
			return lifeExpectancyScale(d.LifeExpectancy);
		})
		.attr("cx", function(d) {
			return incomeScale(d.Income);
		})
		.attr("r", function(d){
			return populationScale(d.Population);
		})
		.on("mouseover", function(d) {
			//d3.select(this).style("fill", "green");
			tip.show(d, document.getElementById("head"));
		})
		.on("mouseout", function(d) {
			//d3.select(this).style("fill", "red");
			tip.hide(d, document.getElementById("head"))
		});

	// Draw the axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate(5, 460)")
		.call(xAxis);

	//label for X Axis
	svg.append("text")
		.attr("class", "axis-label")
		.attr("transform", "translate(" + (width - 210) + " ," + (height - 10) + ")")
		.text("Income per Person (GDP per Capita)");

	svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", "translate(15, 10)")
		.call(yAxis);

	//label for Y Axis
	svg.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("y", 25)
		.attr("x",0 - (height - 365))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Life Expectancy");


});
