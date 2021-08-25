mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, 
    zoom: 8 
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset:25 })
            .setHTML(
                `<h2>${campground.title}</h2><p>${campground.location}</p>`
            )
    )
        
    .addTo(map)