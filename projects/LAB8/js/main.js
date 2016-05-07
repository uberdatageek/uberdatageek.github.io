
var allData = [];

// Variable for the visualization instance
var stationMap;

var boston;

// Start application by loading the data
loadData();


function loadData() {

  // Hubway XML station feed
  var url = "https://www.thehubway.com/data/stations/bikeStations.xml";

  // TO-DO: LOAD DATA


  var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('SELECT * FROM xml WHERE url="' + url + '"') + '&format=json&callback=?';

  $.getJSON(yql, function(jsonData){

    //#2
    console.log(jsonData);

    var stations = jsonData.query.results.stations.station;

    //loop through all elements of json object
    for (x=0; x< stations.length; x++){

      stations[x].id = parseInt(stations[x].id);
      stations[x].nbBikes = parseInt(stations[x].nbBikes);
      stations[x].nbEmptyDocks = parseInt(stations[x].nbEmptyDocks );
      stations[x].lat = parseFloat(stations[x].lat );
      stations[x].long = parseFloat(stations[x].long );

    }

    allData = stations;


    console.log(stations.length);

    $("#station-count").html(stations.length);

    createVis();


  });


}


function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  boston = new StationMap("station-map",allData, [42.360082,-71.058880]);

  console.log(boston);

}

