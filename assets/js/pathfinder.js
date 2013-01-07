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


	// Controllers
	namespace.Controllers = function ()
	{
		return {

			// Navbar
			Navbar : function ($scope)
			{
				$scope.projectName = "Pathfinder";
			},

			// Home Page
			Home : function ($scope)
			{
				$scope.initMap = function ()
				{					
					namespace.Map().init();
				};

				$scope.showLocation = function ()
				{
					namespace.Map().showLocation();
				};

				$scope.transpoTypes = [
					'Jeepney', 'Bus', 'MRT', 'LRT-1', 'LRT-2',
					'Trike', 'Pedicab', 'Fx', 'Walk'
				];
			}
		};
	}

	// Models
	namespace.Models = function ()
	{

	}

	// Map
	namespace.Map = function () 
	{

		return {			
			init : function ()
			{
				var mapOptions = {
			    	center: new google.maps.LatLng(14.561588, 121.033509), // Home coordinate
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP
			  	};

			  	namespace._map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);			  	

			  	// Polyline
			  	var polyOptions = {
					strokeColor : "#f90206",
					strokeOpacity : 0.80,
					strokeWeight : 5
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
					infoWindow.setContent(description);
					infoWindow.open(namespace._map, marker);
				});
			},

			addPath : function (location)
			{
				namespace._path = namespace._poly.getPath();
				namespace._path.push(location);
			}
		};
	}
})(PF);

var ctrl = new PF.Controllers();
var map = new PF.Map();