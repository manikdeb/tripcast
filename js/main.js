jQuery(document).ready(function(){

	// CAROUSEL
	var $ = jQuery;
	var $carousel = $('#places-carousel');
	if($carousel.find('.carousel-inner > .item').size() <= 1) {
		$carousel.find('.carousel-control').remove();
		$carousel.find('.carousel-indicators').remove();
	}

	$carousel.find('.carousel-inner > .item').each(function(i) {
		(i === 0) ? $carousel.find('.carousel-indicators').append("<li data-target='#"+$carousel.attr('id')+"' data-slide-to='"+i+"' class='active'></li>") : $carousel.find('.carousel-indicators').append("<li data-target='#"+$carousel.attr('id')+"' data-slide-to='"+i+"'></li>");
		var src = $(this).find('img').attr('src');
		if(src) {
			$(this).css('background','url('+src+')');
		}
	});
	$carousel.find('.carousel-inner > .item').first().addClass('active');


	// NAVBAR
	$('#menu-item li a').on('click', function() {
		$('#menu-item li a').removeClass('active');
		$(this).addClass('active');
	});

	// CLOUDS
	var cloud_xpos = -100;
	$(window).on("load resize", function(e) {
		cloud_xpos = -($(window).width() / 10);
	});
	var cloud_scroll = 0;
	setInterval(function() {
		cloud_scroll -= 1;
		$('#header-foreground').css('background-position', cloud_scroll + 'px ' + cloud_xpos + 'px');
	}, 40);

	// CENTER ELEMENTS
	$('.hc-content').each(function() {
		$(this).css({ 'top': '50%', 'margin-top': -($(this).height() / 2) });
	});

	// MENU
	$('#menu-icon').click(function() {
		$(this).hide();
		$('#menu').fadeIn('slow');
	});
	$('#menu-close').click(function() {
		$('#menu-icon').show();
		$('#menu').fadeOut('slow');
	});

	// NAVTAB
	$('.places-name').click(function() {
		$('.places-name').removeClass('active');
		$(this).addClass('active');
	});

	// WEATHER INFO
	var getJSON = function(url) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', url, true);
			xhr.responseType = 'json';
			xhr.onload = function() {
				var status = xhr.status;
				if (status == 200) {
					resolve(xhr.response);
				} else {
					reject(status);
				}
			};
			xhr.send();
		});
	};
	var jsonUrl = 'https://api.openweathermap.org/data/2.5/weather?id=1205733&units=metric&appid=ba4f52c9ce9c222b8a6490b4c3ae857d';
	getJSON(jsonUrl).then(function(data) {
		// WEATHER INFO
		$('#weather-info-location').html(data.name);
		$('#weather-info-temp').html(Math.ceil(parseInt(data.main.temp))+'°C');
		$('#weather-info-icon').append("<img src='https://openweathermap.org/img/w/"+data.weather[0].icon+".png'>")
		// COORDS
		$('#focus-coords').html(data.coord.lat + "'&nbsp;&nbsp;" + data.coord.lon+ "'");
	});
});

// MAIN FOCUS MAP DATA
function initMap() {
	var markerArray = [];
	var directionsService = new google.maps.DirectionsService;
	var map = new google.maps.Map(document.getElementById('focus-map'), {
		center: {lat: 22.199808, lng: 91.9507763},
		// zoom: 20,
		disableDefaultUI: true,
		backgroundColor: 'transparent',
		styles: [
		{elementType: 'geometry', stylers: [{ "visibility": "off" }]},
		{elementType: 'labels.text.stroke', stylers: [{ "visibility": "off" }]},
		{elementType: 'labels.text.fill', stylers: [{ "visibility": "off" }]},
		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [
			{ "visibility": "off" }
			]
		},
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'transit.station',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ "visibility": "off" }]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [{ "visibility": "off" }]
		},
		{ featureType: "road", stylers: [ { visibility: "off" } ] },{ }
		]
	});

	var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
	var stepDisplay = new google.maps.InfoWindow;
	calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
	var onChangeHandler = function() {
		calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
	};
}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
	markerArray, stepDisplay, map) {
	for (var i = 0; i < markerArray.length; i++) {
		markerArray[i].setMap(null);
	}
	directionsService.route({
		origin: 'khulna, khulna, bangladesh',
		destination: 'kaptai, chittagong, bangladesh',
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
			showSteps(response, markerArray, stepDisplay, map);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
	var myRoute = directionResult.routes[0].legs[0];
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
		attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
	}
}

function attachInstructionText(stepDisplay, marker, text, map) {
	google.maps.event.addListener(marker, 'click', function() {
		stepDisplay.setContent(text);
	    stepDisplay.open(map, marker);
	});
}