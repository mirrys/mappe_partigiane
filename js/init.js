var map = null;
var infoPopup = null;
var magDisplay = document.getElementById('name');
var filterEl = document.getElementById('feature-filter');
var streets = []
var hoveredStateId = null;

var defaults = {
    zoom: 7,
    pitch: 0,
    bearing: 0,
    lon:45.29411,
    lat:9.678392,
    style:'mapbox://styles/mirrys/ck9bt2acf0cmz1ip5tj0jxlkr',
    accessToken: 'pk.eyJ1IjoibWlycnlzIiwiYSI6ImNrOHVyYnJ6NTA4cGYzZnBobDkzbHQ1Y2UifQ.J36wvZX0l3JFsEJE5gsG6w',
    mapContainer: 'map'
}

// function renderListings(features) {
//     var empty = document.createElement('p');
//     // Clear any existing listings
//     if (features.length) {
//     // Show the filter input
//     filterEl.parentNode.style.display = 'block';
//     } else  {

//     empty.textContent = 'No results found';
//     // remove features filter
//     map.setFilter('25april-layer', ['has', 'name']);
//     }
//     }
     

// function getUniqueFeatures(array, comparatorProperty) {
//     var existingFeatureKeys = {};
//     // Because features come from tiled vector data, feature geometries may be split
//     // or duplicated across tile boundaries and, as a result, features may appear
//     // multiple times in query results.
//     var uniqueFeatures = array.filter(function(el) {
//     if (existingFeatureKeys[el.properties[comparatorProperty]]) {
//     return false;
//     } else {
//     existingFeatureKeys[el.properties[comparatorProperty]] = true;
//     return true;
//     }
//     });
//     console.log(uniqueFeatures[0])

//     return uniqueFeatures;
//     }
     

// function normalize(string) {
// return string.trim().toLowerCase();
// }
mapboxgl.accessToken = defaults.accessToken;

map = new mapboxgl.Map({
    container: defaults.mapContainer,
    style: defaults.style, 
    center: [defaults.lat, defaults.lon],
    pitch: defaults.pitch,
    bearing: defaults.bearing,
    zoom: defaults.zoom
});


map.on('load', () => {
        

    map.addSource("25april-source",
        {
        "type": "vector",
        "url": "mapbox://mirrys.43r8z6a7"
    });

    map.addSource("street-source",
        {
        "type": "vector",
        "url": "mapbox://mapbox.mapbox-streets-v8"
    });



    map.addLayer(
        {
        "id": "25april-layer",
        "type":"line",
        "source": "25april-source",
        "source-layer": "final_tile-al5fxc",
      
        "paint": {
             "line-color": [
             'case',
             ['boolean', ['feature-state', 'hover'], false],
             '#00acee',
             'red'
             ],
            'line-width': [
                'interpolate', 
                ['exponential', 2], 
                ['zoom'],
                5, 3, 
                10, 10,
            ],
            "line-opacity": 0.5,   
        }
    });


    // Create a popup, but don't add it to the map yet.
    infoPopup = new mapboxgl.Popup({
        //closeButton: false,
        //closeOnClick: false, 
        className:"infopopup"
        });
 

    map.on('click', '25april-layer', (e) => {


        if (e.features && e.features.length >0){


            var current_feature = e.features[0]
            var name = current_feature.properties.wikipedia_link
            var coordinates = [e.lngLat.lng, e.lngLat.lat]
            
            console.log(current_feature.properties, current_feature.geometry)

            // Personalize popup
            popupHTML = "<div><object type=\"text/html\" data=\""+name+"\" width=\"400px\" height=\"600px\" style=\"overflow:auto;\"></object></div>"


        infoPopup.setLngLat(coordinates)
            .setHTML(popupHTML)
            .setMaxWidth("700px")
            .addTo(map);

        }
        


    });


    map.on('mousemove', '25april-layer',  (e) => {
        if (hoveredStateId) {
            map.setFeatureState(
                { source: '25april-source', sourceLayer:'final_tile-al5fxc', id: hoveredStateId,},
                { hover: false }
            );
        }
        current_feature=e.features[0]
        hoveredStateId = current_feature.id;
        map.setFeatureState(
            { source: '25april-source', sourceLayer:'final_tile-al5fxc', id: hoveredStateId,},
            { hover: true }
        )
        magDisplay.textContent = current_feature.properties.name
        map.getCanvas().style.cursor = 'pointer';
        });
    // Change the cursor to a pointer when the mouse is over the places layer.

     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', '25april-layer' , (e) => {
    if (hoveredStateId) {
        map.setFeatureState(
        { source: '25april-source', sourceLayer:'final_tile-al5fxc', id: hoveredStateId,},
        { hover: false }
        );
        magDisplay.textContent=''
        }
    map.getCanvas().style.cursor = '';
    });

    map.addControl(new mapboxgl.NavigationControl(),'top-right');

    // map.on('moveend', function() {
    //     var features = map.queryRenderedFeatures({ layers: ['25april-layer'] });
         
    //     if (features) {
    //     var uniqueFeatures = getUniqueFeatures(features, 'name');
         
    //     // Clear the input container
    //     // Store the current features in sn `airports` variable to
    //     // later use for filtering on `keyup`.
    //     streets = uniqueFeatures;
    //     }
    //     });

    // filterEl.addEventListener('keyup', function(e) {
    //     var value = normalize(e.target.value);
    //     console.log(value)
    //     // Filter visible features that don't match the input value.
    //     var filtered = streets.filter(function(feature) {
    //     var name = normalize(feature.properties.name);
    //     return name.indexOf(value) > -1;
    //     });
    //     console.log(name)

    //     renderListings(filtered);

    //     // Set the filter to populate features into the layer.
    //     if (filtered.length) {
    //     map.setFilter('25april-layer', [
    //     'match',
    //     ['get', 'name'],
    //     filtered.map(function(feature) {
    //     return feature.properties.name;
    //     }),
    //     true,
    //     false
    //     ]);
    //     }
    //     });

    var geocoderSearchbar = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder:"Search",
        flyTo: {
            bearing: 0,
            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 2, // make the flying slow
            curve: 0.5, // change the speed at which it zooms out
            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            // easing: function (t) { return t; },
            zoom: 11
            }
    })

    map.addControl(geocoderSearchbar, 'top-right');
  //  renderListings([]);

});