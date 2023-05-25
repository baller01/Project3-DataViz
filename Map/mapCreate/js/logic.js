// logic.js

// Initialize the map
var map = L.map('map').setView([47.238138, -120.289762], 7);

// Add a base layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(map);

// Fetch the GeoJSON data and create features
var queryUrl = 'https://data.wa.gov/resource/f6w7-q2d2.geojson';

var elecVehicleData;
var elecVehicle;
var colorMappings = {
  'TESLA': "#ff0000",       // RED
  'HONDA': "#00ff00",       // GREEN
  'NISSAN': "#0000ff",      // BLUE
  'VOLKSWAGEN': "#ff8000",  // ORANGE
  'AUDI': "#ff00aa",        // PINK
  'FORD': "#5500ff",        // PURPLE
  'KIA': "#ffff00",         // YELLOW
  'BMW': "#000000",         // red
  'CHEVROLET': "#8c0044",   // Pink
  'JEEP': "#470024",        // DEEP RED
  'CHRYSLER': "#66dd00",    // Very green
  'TOYOTA': "#00ffff",      // Pure (or mostly pure) cyan.
  'PORSCHE': "#274e13",     // DEEP GREEN
  'VOLVO': "#0f3c64",       // DEEP BLUE
  'POLESTAR': "#cc9a00",    // Strong yellow
  'HYUNDAI': "#ccd000",     // Random
};

d3.json(queryUrl).then(function(data) {
  elecVehicleData = data.features;
  createFeatures(elecVehicleData);
});

///////////////////////////////////////////////////////////////////
// Make filter
fetch(queryUrl)
  .then(response => response.json())
  .then(data => {
    const features = data.features;
    const uniqueMakes = new Set();
    const uniqueEv_type = new Set();
    const uniqueYear = new Set();
    const uniqueCityCounty = new Set();

    features.forEach(feature => {
      const properties = feature.properties;
      const make = properties.make;
      const ev_type = properties.ev_type;
      const year = properties.model_year;
      const city = properties.city;
      const county = properties.county;
      uniqueMakes.add(make);
      uniqueEv_type.add(ev_type);
      uniqueYear.add(year);
      uniqueCityCounty.add(city);
      uniqueCityCounty.add(county);
    });

    const makerFilter = document.getElementById('makerFilter-option');
    uniqueMakes.forEach(make => {
      const option = document.createElement('option');
      option.value = make;
      option.text = make;
      makerFilter.appendChild(option);
    });

    const ev_typeFilter = document.getElementById('ev_typeFilter-option');
    uniqueEv_type.forEach(ev_type => {
      const option = document.createElement('option');
      option.value =ev_type;
      option.text = ev_type;
      ev_typeFilter.appendChild(option);
    });

    const yearFilter = document.getElementById('yearFilter-option');
    uniqueYear.forEach(year => {
      const option = document.createElement('option');
      option.value =year;
      option.text = year;
      yearFilter.appendChild(option);
    });

    const cityCountyFilter = document.getElementById('cityCountyFilter-option');
    uniqueCityCounty.forEach(cityCounty => {
      const option = document.createElement('option');
      option.value =cityCounty;
      option.text = cityCounty;
      cityCountyFilter.appendChild(option);
    });
  })
  .catch(error => console.error('Error:', error));

////////////////////////////////////////////////////////////////
// Create main map
function createFeatures(elecVehicleData) { 
  // Create the feature layer and set the style and interaction
  elecVehicle = L.geoJSON(elecVehicleData, {
    pointToLayer: function (feature, latlng) {

      var colorIndex = feature.properties.make;

      var color = colorMappings[colorIndex] || "#wcd123"; // default

      return L.circleMarker(latlng, {
        color: color,
        weight: 0.3,
        radius : 6,
        opacity: 0.5,
        fillOpacity: 0.6
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + "VEHICLE ID: " + feature.properties.dol_vehicle_id + "</h3><hr><p>" + "MODEL: " + feature.properties.make + " / " + feature.properties.model + "</p><hr><p>"  + "Ev_type: " + feature.properties.ev_type + "</p><hr><p>" + "Year: " + feature.properties.model_year+ "</p><hr><p>" + "Location: " + feature.properties.city + " / " + feature.properties.county + "</p>");
    }
  }).addTo(map);
  updateMap();
}

//////////////////////////////////////////////////////////////////
// update Year and City/County filter
function updateYearLocation() {
  var makerSelectedValue = document.getElementById('makerFilter-option').value;
  var ev_typeSelectedValue = document.getElementById('ev_typeFilter-option').value;
  var cityCountySelectedValue = document.getElementById('cityCountyFilter-option').value;

  if(makerSelectedValue !== "") {
    var filteredFeatures = elecVehicleData.filter(function(feature) {
      return feature.properties.make === makerSelectedValue;
    });
  }
  else{
    var filteredFeatures = elecVehicleData
  };
  if(ev_typeSelectedValue !== "") {
    filteredFeatures = filteredFeatures.filter(function(feature) {
      return feature.properties.ev_type === ev_typeSelectedValue;
    });
  }
  else{
    filteredFeatures = filteredFeatures
  };
  if (cityCountySelectedValue !== "") {
    filteredFeatures = filteredFeatures.filter(function (feature) {
      return (
        feature.properties.city === cityCountySelectedValue ||
        feature.properties.county === cityCountySelectedValue
      );
    });
  };

  const newYear = new Set();
  const newCityCounty = new Set();

  filteredFeatures.forEach(feature => {
    const year = feature.properties.model_year;
    const city = feature.properties.city;
    const county = feature.properties.county;
    newYear.add(year)
    newCityCounty.add(city);
    newCityCounty.add(county);
  });

  const yearFilter= document.getElementById('yearFilter-option');
    yearFilter.innerHTML = '';
    const option1 = document.createElement('option');
    option1.value = "";
    option1.text = "All Year";
    yearFilter.appendChild(option1);
    newYear.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.text = year;
      yearFilter.appendChild(option);
    });

    const cityCountyFilter= document.getElementById('cityCountyFilter-option');
    cityCountyFilter.innerHTML = '';
    const option2 = document.createElement('option');
    option2.value = "";
    option2.text = "All City/County";
    cityCountyFilter.appendChild(option2);
    newCityCounty.forEach(cityCounty => {
      const option = document.createElement('option');
      option.value = cityCounty;
      option.text = cityCounty;
      cityCountyFilter.appendChild(option);
    });
    
}

/////////////////////////////////////////////////////////////////
// Update map
function updateMap() {
  // select
  var makerSelectedValue = document.getElementById('makerFilter-option').value;
  var ev_typeSelectedValue = document.getElementById('ev_typeFilter-option').value;
  var yearSelectedValue = document.getElementById('yearFilter-option').value;
  var cityCountySelectedValue = document.getElementById('cityCountyFilter-option').value;

  // remove
  if (map.hasLayer(elecVehicle)) {
    map.removeLayer(elecVehicle);
  }
  
  // build filter
  // filter by marker
  if(makerSelectedValue !== "") {
    var filteredFeatures = elecVehicleData.filter(function(feature) {
      return feature.properties.make === makerSelectedValue;
    });
  }
  else{
    var filteredFeatures = elecVehicleData
  };
  // filter by ev_type
  if(ev_typeSelectedValue !== "") {
    filteredFeatures = filteredFeatures.filter(function(feature) {
      return feature.properties.ev_type === ev_typeSelectedValue;
    });
  }
  else{
    filteredFeatures = filteredFeatures
  };
  // filter by year
  if(yearSelectedValue !== "") {
    filteredFeatures = filteredFeatures.filter(function(feature) {
      return feature.properties.model_year === yearSelectedValue;
    });
  }
  else{
    filteredFeatures = filteredFeatures
  };
  // filter by city/county

if (cityCountySelectedValue !== "") {
  filteredFeatures = filteredFeatures.filter(function (feature) {
    return (
      feature.properties.city === cityCountySelectedValue ||
      feature.properties.county === cityCountySelectedValue
    );
  });
  }
  
  var text = document.getElementById("text-container");
    if(cityCountySelectedValue === "" ) {
      cityCountySelectedValue = "Washington" ;
    };
    if(yearSelectedValue === "" ) {
      yearSelectedValue = "all years" ;
    };
    if(ev_typeSelectedValue === "" ) {
      ev_typeSelectedValue = "" ;
    };
      text.textContent = `In ${cityCountySelectedValue}, we find ${filteredFeatures.length} ${ev_typeSelectedValue} ${makerSelectedValue} elecVehicle car(s) built in ${yearSelectedValue}` ;
  // create new map
  elecVehicle = L.geoJSON(filteredFeatures, {
    pointToLayer: function (feature, latlng) {
      var colorIndex = feature.properties.make;

      var color = colorMappings[colorIndex] || "#wcd123"; // default

      return L.circleMarker(latlng, {
        color: color,
        weight: 0.3,
        radius : 6,
        opacity: 0.5,
        fillOpacity: 0.6
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + "VEHICLE ID: " + feature.properties.dol_vehicle_id + "</h3><hr><p>" + "MODEL: " + feature.properties.make + " / " + feature.properties.model + "</p><hr><p>"  + "Ev_type: " + feature.properties.ev_type + "</p><hr><p>" + "Year: " + feature.properties.model_year+ "</p><hr><p>" + "Location: " + feature.properties.city + " / " + feature.properties.county + "</p>");
    }
  }).addTo(map);

 }