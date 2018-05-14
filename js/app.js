var map;
var latitude = 37.5482697;
var longitude = -121.9885719;
var foursquare_client_id = 'X5KWTNLJAK1RVX23B3JBBKNCG4BPWNQ155WDH34X5Y3T3ARF';
var foursquare_client_secret = 'FKL3ZKR22ZREWTFJCUH2UA2QQZQFWUKRT1XLHFXDTTJE5GQQ';
var venues;
var markers = [];

function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: latitude, lng: longitude},
            zoom: 11
        }
    );
}

function getFourSquareResults(query) {
    var fq_url = "https://api.foursquare.com/v2/venues/search?client_id=" + 
                 foursquare_client_id + 
                 "&client_secret=" + foursquare_client_secret +
                 "&v=20130815" + 
                 "&ll="+latitude + "," + longitude +
                 "&query=" + query;
    console.log(fq_url);
    $.get(fq_url, displayInitialResults);              
} 

function displayInitialResults(data) {
    venues = data.response.venues;
    console.log(data);
    console.log(venues);
    displayVenues(venues);
}
function displayVenues(results) {
    // first clear any old markers
    clearMarkers();
    // display the results in side bar
    $('#results').html(results.map(x => `<li><a href="#">${x.name}</a></li>`));
    // making map markers
    for (var i = 0; i < results.length; i++) {
        var location = results[i].location;
        var marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            title: results[i].name
        });
        var infoText = results[i].name;
        var infowindow = new google.maps.InfoWindow({
            content: infoText
        });
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow)
        });
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function onFilter() {
    var search = $('.search').val();
    var filtered_results;
    if(search.length > 0) {
        filtered_results = venues.filter(x => x.name.includes(search));
    } else {
        filtered_results = venues;
    }
    displayVenues(filtered_results);
}

function populateInfoWindow(marker, infowindow) {
    if(infowindow.marker != marker) {
       infowindow.setContent('');
       infowindow.marker = marker;
       infowindow.addListener('closeclick',function(){
           infowindow.setMarker(null);
       });
       infowindow.setContent('<div>'+marker.title+'</div>');
       infowindow.open(map, marker);
    }
}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    getFourSquareResults("Movie Theaters");
    $('.filter').on('click',onFilter);
});