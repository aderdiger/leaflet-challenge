// We create the tile layer that will be the background of our map.
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'"
    );
  
  
  // We create the map object.
  let map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  
  // Then we add our 'basemap' tile layer to the map.
  basemap.addTo(map);
  
  // Here we make a call that retrieves our earthquake geoJSON data.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  
    // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(depth) {
      switch (true) {
        case depth > 90:
          return "#ea2c2c";
        case depth > 70:
          return "#ea822c";
        case depth > 50:
          return "#ee9c00";
        case depth > 30:
          return "#eecc00";
        case depth > 10:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    }
  
    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
    }
  
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
      return {
          // USE STYLE ATTRIBUTES (e.g., opacity, fillOpacity, stroke, weight) 
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        opacity: 1,
        fillOpacity: 1 
      };
    }
  
    // Add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
      
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      
      // We set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
      
      // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
            `<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}`
            );
      }
    }).addTo(map);
  
    // Create a legend control object.
    let legend = L.control({
      position: "bottomright"
    });
  
    // Then add all the details for the legend
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // Looping through our intervals to generate a label with a colored square for each interval.
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' +
            colors[i] + 
            '"></i> ' +
            grades[i] + 
            (grades[i + 1] ? '&ndash;' + 
            grades[i + 1] + 
            '<br>' : '+');
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(map);
  });