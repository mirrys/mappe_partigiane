var map = null;
var infoPopup = null;

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
        "url": "mapbox://mirrys.6rxgf8bg"
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
        "source-layer": "final_tile-aatjzg",
      
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
            popupHTML = "<p>"+name+"</p>"


        infoPopup.setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map);

        }
        


    });


    map.on('mouseenter', '25april-layer',  (e) => {
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
    { source: '25april-source', sourceLayer:'25april', id: hoveredStateId,},
    { hover: true }
    )
    map.getCanvas().style.cursor = 'pointer';

    });
    // Change the cursor to a pointer when the mouse is over the places layer.

     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', '25april-layer' , (e) => {
    if (hoveredStateId) {
        map.setFeatureState(
        { source: '25april-source', sourceLayer:'25april', id: hoveredStateId,},
        { hover: false }
        );
        }
    map.getCanvas().style.cursor = '';
    });

    map.addControl(new mapboxgl.NavigationControl(),'top-right');




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

});