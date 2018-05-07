var map;
function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: -33.9, lng: 151.2},
            zoom: 10
        }
    );
}