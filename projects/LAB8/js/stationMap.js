
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.mapPosition = _mapPosition;

  this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {

  var vis = this;
  vis.map = L.map('station-map').setView(this.mapPosition,13);
  L.Icon.Default.imagePath = 'img';

  /* original OpenStreetMap
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(vis.map);
  */

  //Bonus Activity 2 -
  //
  /* // used Stamen.Terrain
  var Stamen_Terrain = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 4,
    maxZoom: 18,
    ext: 'png',
    bounds: [[22, -132], [70, -56]]
  }).addTo(vis.map);
  */

  //used Stamen.TonerLite
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(vis.map);



  vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
  var vis = this;

  // Currently no data wrangling/filtering needed
  vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();
}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
  var vis = this;
  /*Initial test marker - Maxwell Dworkin
  L.marker([42.378774,-71.117303]).addTo(this.map)
      .bindPopup('Maxwell Dworkin')
      .openPopup();
  */

  var LeafIcon = L.Icon.extend({
    options: {
      shadowUrl: 'img/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28]
    }
  });

  var redMarker = new LeafIcon({ iconUrl: 'img/marker-red.png'});
  var blueMarker = new LeafIcon({ iconUrl: 'img/marker-blue.png'});
  var greenMarker = new LeafIcon({ iconUrl: 'img/marker-green.png'});
  var yellowMarker = new LeafIcon({ iconUrl: 'img/marker-yellow.png'});

  for(x=0; x<vis.data.length; x++){

    /*
    console.log(parseFloat(this.data[x].lat));
    console.log(parseFloat(this.data[x].long));
    */


    var info = "<b>Name:</b> " + vis.data[x].name + "<br /><b>Available Bikes:</b> " + vis.data[x].nbBikes + "<br /><b>Available Docks:</b> " + vis.data[x].nbEmptyDocks;

    /* Markers to show Available Bikes, Available Docks and Name of Station - Activity III

    L.marker([vis.data[x].lat,vis.data[x].long]).addTo(vis.map)
        .bindPopup(info)
    */

    //Bonus question... Dynammic Markers
    if(vis.data[x].nbBikes == 0 | vis.data[x].nbEmptyDocks == 0) {  //Critical

      var marker = L.marker([vis.data[x].lat,vis.data[x].long], { icon: redMarker }).addTo(vis.map)
                      .bindPopup(info);
    } else { //Regular

      var marker = L.marker([vis.data[x].lat,vis.data[x].long], { icon: greenMarker }).addTo(vis.map)
                      .bindPopup(info);

    }

  }

  console.log(vis.data);


  $.getJSON('data/MBTA-Lines.json', function(data){

    console.log(data);

    var mbta = L.geoJson(data, {

      style: mbtaStyle,
      weight: 6,
      fillOpacity: 0.9

    }).addTo(vis.map);

    function mbtaStyle(feature) {

        return { color: feature.properties.LINE };

    }

  });

}
