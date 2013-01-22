/**
 * 
 */
var PF = PF || {};


(function(namespace)
{
	"use strict";

	var _map = null;

	var _poly = null;
	var _path = null;
	var _infoWindow = null;
	var _totalDistance = null;

	// Map
	namespace.Map = function () 
	{

		return {			
			init : function ()
			{
				var mapOptions = {
			    	center: new google.maps.LatLng(14.586961, 121.063491), // Home coordinate
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP
			  	};

			  	namespace._map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);			  	

			  	// Polyline
			  	var polyOptions = {
					strokeColor : "#f90206",
					strokeOpacity : 0.25,
					strokeWeight : 5,
					geodesic : true
				};
				
				namespace._poly = new google.maps.Polyline(polyOptions);
				namespace._poly.setMap(namespace._map);

				google.maps.event.addListener(namespace._map, 'click', function (event)
			  	{
			  		namespace.Map().addPath(event.latLng);

			  		if (namespace._path.length === 1)
			  		{
			  			namespace.Map().addMarker(event.latLng, { 
							title : "Start of Route",
							description : "Start of Route",
						});
			  		}

			  		namespace._totalDistance = (namespace._path === undefined) 
						? 0
						: google.maps.geometry.spherical.computeLength(namespace._path);
			  	});

			  	google.maps.event.addListener(namespace._poly, 'mouseover', function (event)
		  		{
		  			// Polyline
				  	var polyOptions = {
						strokeColor : "#000000",
						strokeOpacity : 1,
						strokeWeight : 5
					};
		  			namespace._poly.setOptions(polyOptions);
		  		});

		  		google.maps.event.addListener(namespace._poly, 'mouseout', function (event)
		  		{
		  			// Polyline
				  	var polyOptions = {
						strokeColor : "#f90206",
						strokeOpacity : 0.25,
						strokeWeight : 5
					};
		  			namespace._poly.setOptions(polyOptions);
		  		});
			},

			showLocation : function ()
			{
				if (navigator.geolocation)
				{
					var successFunc = this.showLocationSuccess;
					var failureFunc = this.showLocationFailed;
					navigator.geolocation.getCurrentPosition(successFunc, failureFunc, {timeout:10000});
				}
				else
				{
					alert("Geolocation is not supported by this browser.");
				}
			}, 

			showLocationSuccess : function (position)
			{				
				var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);				

				namespace._map.setZoom(17);
				namespace._map.setCenter(latLng);
				namespace.Map().addMarker(latLng, { 
					title : "Your location was detected here.",
					description : "Your location was detected here.",
					iconType : "house"
				});
			},

			showLocationFailed : function (error)
			{
				switch (error.code)
				{
					case error.PERMISSION_DENIED:
						alert('Permission Denied');
						break;
					case error.POSITION_UNAVAILABLE:
						alert('Position Unavailable');
						break;
					case error.TIMEOUT:
						alert('Timeout');
						break;
					case error.UNKNOWN_ERROR:
						alert('Unknown Error');
						break;
				}
			},

			addMarker : function (location, params)
			{
				var image = new google.maps.MarkerImage('assets/img/house.png');
				var marker = new google.maps.Marker({
					position : location,
					map : namespace._map,
					title : params.title,
					icon : image,
					animation : google.maps.Animation.DROP,
					description : params.description
				});

				var infoWindow = new google.maps.InfoWindow(); 
				google.maps.event.addListener(marker, "click", function (e){
					infoWindow.setContent(params.description);
					infoWindow.open(namespace._map, marker);
				});
			},

			addPath : function (location, $scope)
			{
				namespace._path = namespace._poly.getPath();
				namespace._path.push(location);

				var totalDistance = (namespace._path === undefined) 
					? 0
					: google.maps.geometry.spherical.computeLength(namespace._path);				

				totalDistance = parseFloat(totalDistance / 1000);
				totalDistance = totalDistance.toFixed(3) + ' km';
			

				$('#total_distance').html(totalDistance);
			},

			getTotalDistance : function ()
			{
				namespace._totalDistance = (namespace._path === undefined) 
					? 0
					: google.maps.geometry.spherical.computeLength(namespace._path);
			}
		};
	}
})(PF);

$(document).ready(function(namespace)
{
	var map = new PF.Map();
	map.init();

	$('#get_current_location').click(function() {
		map.showLocation();
	});
});
