// google map api details
var map;
var latitude = 37.5482697;
var longitude = -121.9885719;
// foursquare api details
var fq_cli_id = 'X5KWTNLJAK1RVX23B3JBBKNCG4BPWNQ155WDH34X5Y3T3ARF';
var fq_sec = 'FKL3ZKR22ZREWTFJCUH2UA2QQZQFWUKRT1XLHFXDTTJE5GQQ';
var fq_url = 'https://api.foursquare.com/v2/venues/search';
// data
var venues;
var markers = [];
var activeInfoWindow;
var appName = "Movie Theaters";

function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: latitude, lng: longitude},
            zoom: 11
        }
    );
}

function getFourSquareResults(q) {
    fq_url = `${fq_url}?client_id=${fq_cli_id}&client_secret=${fq_sec}&v=20130815&ll=${latitude},${longitude}&query=${q}`;
    console.log(fq_url);
    $.get(fq_url, displayInitialResults).fail(displayError);              
} 

function displayError() {
    viewModel.venues([{name: "We are sorry our systems are down, please try again."}]);
}

function displayInitialResults(data) {
    venues = data.response.venues;
    console.log(data);
    console.log(venues);
    displayVenues(venues);
}

function displayVenues(results) {
    viewModel.venues(results);
    // first clear any old markers
    clearMarkers();
    // making map markers
    for (let i = 0; i < results.length; i++) {
        let location = results[i].location;
        let marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            title: results[i].name,
            id: results[i].id
        });
        viewModel.venues()[i].marker = marker;
        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this)
        });
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function onFilter() {
    var search = viewModel.search();
    var filtered_results;
    if(search.length > 0) {
        filtered_results = venues.filter(x => x.name.includes(search));
    } else {
        filtered_results = venues;
    }
    if(filtered_results.length > 0) {
        displayVenues(filtered_results);
    } else {
        displayVenues(filtered_results);
        viewModel.venues([{name: "No Results Found"}]);
    }
}

function populateInfoWindow(data) {
    let marker = data.marker? data.marker : data;
    if(activeInfoWindow) { 
        activeInfoWindow.close();
    }
    let infoText = marker.title
    let infowindow = new google.maps.InfoWindow({
        content: infoText
    });
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick',function(){
        infowindow.marker = null;
    });
    infowindow.setContent('<div>'+marker.title+'</div>');
    infowindow.open(map, marker);
    activeInfoWindow = infowindow;
}

// view
var ViewModel = function() {
    var self = this;
    this.appName = appName;
    this.sbar = ko.observable(true);
    this.search = ko.observable("");
    this.venues = ko.observableArray([]);
    getFourSquareResults(appName);
    this.populateInfoWindow = populateInfoWindow;
    this.onFilter = onFilter;
    this.toggle = function(){
        this.sbar(!this.sbar());
    };
}
var viewModel = new ViewModel();
ko.applyBindings(viewModel);