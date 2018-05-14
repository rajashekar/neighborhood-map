var map;
var latitude = 37.5482697;
var longitude = -121.9885719;
var foursquare_client_id = 'X5KWTNLJAK1RVX23B3JBBKNCG4BPWNQ155WDH34X5Y3T3ARF';
var foursquare_client_secret = 'FKL3ZKR22ZREWTFJCUH2UA2QQZQFWUKRT1XLHFXDTTJE5GQQ';


function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: latitude, lng: longitude},
            zoom: 10
        }
    );
}

function getFourSquareResults(query) {
    var fq_url = "https://api.foursquare.com/v2/venues/search?client_id="+foursquare_client_id + 
                 "&client_secret="+foursquare_client_secret +
                 "&v=20130815" + 
                 "&ll="+latitude+ ","+ longitude +
                 "&query="+query;

    console.log(fq_url);
    $.get(fq_url, displayResults);              
} 

function displayResults(data) {
    var venues = data.response.venues;
    console.log(venues);
    console.log(data);
    // display the results in side bar
    $('#results').html(venues.map(x => `<li><a href="#">${x.name}</a></li>`));
    // making map markers
    for (var i = 0; i < venues.length; i++) {
        var location = venues[i].location;
        var marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            title: venues[i].name
        });
        var infoText = venues[i].name;
        var infowindow = new google.maps.InfoWindow({
            content: infoText
        });
        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow)
        });
    }
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
});