/**
 * 
 */
var PF = PF || {};

(function(namespace)
{
	"use strict";

	var _map = null;

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
			}
		};
	}

	// Map
	namespace.Map = function () 
	{

		return {			
			init : function ()
			{
				var mapOptions = {
			    	center: new google.maps.LatLng(14.561588, 121.033509), // Home coordinate
					zoom: 12,
					mapTypeId: google.maps.MapTypeId.ROADMAP
			  	};

			  	namespace._map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
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

			showLocationFailed : function ()
			{
				alert('failed');
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
			}
		};
	}
})(PF);

var ctrl = new PF.Controllers();
var map = PF.Map();