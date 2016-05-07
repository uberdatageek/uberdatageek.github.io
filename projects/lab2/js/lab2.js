
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

function dataFiltering() {
	var attractions = attractionData;
	attractions = attractions.sort(function(a,b){
		return b.Visitors - a.Visitors;
	});

	attractions = attractions.slice(0,4);
	renderBarChart(attractions);
	/* **************************************************
	 *
	 * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 * renderBarChart(data)
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/


}

dataManipulation()

function dataManipulation() {
	var selectBox = document.getElementById("attraction-category");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	var attractions = attractionData;
	var filteredResults = "filtered by: All"
	if (selectedValue != "all"){

		attractions = attractions.filter(function (el) {

			return (el.Category === selectedValue);

		});

		filteredResults="filtered by: " + selectedValue;
	}


	document.getElementById("title-div").innerHTML=filteredResults;

	attractions = attractions.slice(0,4);
	renderBarChart(attractions);

}