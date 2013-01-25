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
					geodesic : true,
					editable : true
				};
				
				namespace._poly = new google.maps.Polyline(polyOptions);
				namespace._poly.setMap(namespace._map);				

				google.maps.event.addListener(namespace._map, 'click', function (event)
			  	{
			  		namespace.Map().addPath(event.latLng);
			  		namespace.Map().displayTotalDistance();
			  		namespace.Map().addInstructionDetails(event.latLng);		  		

			  		if (namespace._path.length === 1)
			  		{
			  			namespace.Map().addMarker(event.latLng, { 
							title : "Start of Route",
							description : "Start of Route",
						});
			  		}
			  	});

				// Polyline listeners
			  	google.maps.event.addListener(namespace._poly, 'mouseover', function (event)
		  		{
				  	var polyOptions = {
						strokeColor : "#000000",
						strokeOpacity : 1,
						strokeWeight : 5
					};
		  			namespace._poly.setOptions(polyOptions);
		  		});

		  		google.maps.event.addListener(namespace._poly, 'mouseout', function (event)
		  		{
				  	var polyOptions = {
						strokeColor : "#f90206",
						strokeOpacity : 0.25,
						strokeWeight : 5
					};
		  			namespace._poly.setOptions(polyOptions);
		  		});

		  		// Path listeners
		  		google.maps.event.addListener(namespace._poly.getPath(), 'insert_at', function (event)
		  		{
		  			namespace.Map().displayTotalDistance();
		  		});

		  		google.maps.event.addListener(namespace._poly.getPath(), 'remove_at', function (event)
		  		{
		  			namespace.Map().displayTotalDistance();
		  		});

		  		google.maps.event.addListener(namespace._poly.getPath(), 'set_at', function (event)
		  		{
		  			namespace.Map().displayTotalDistance();
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

			addPath : function (location)
			{
				console.log(location);
				namespace._path = namespace._poly.getPath();
				namespace._path.push(location);				
			},

			displayTotalDistance : function ()
			{
				$('#total_distance').html(namespace.Map().getTotalDistance());
				//namespace.Map().getReverseGeocodingLocation(location);
			},

			getTotalDistance : function ()
			{
				var totalDistance = (namespace._path === undefined) 
					? 0
					: google.maps.geometry.spherical.computeLength(namespace._path);				

				totalDistance = parseFloat(totalDistance / 1000);
				totalDistance = totalDistance.toFixed(3) + ' km';

				return totalDistance;								
			},

			addInstructionDetails : function(location)
			{
				var geocoder = new google.maps.Geocoder();			
				var street = '';

				geocoder.geocode({'latLng':location}, function (results, status)
				{
					if (status == google.maps.GeocoderStatus.OK) 
					{
				        if (results[1]) 
				        {				     				           
				          	var tmp = results[0].formatted_address.split(',');
				          	var address = tmp[0] + ', ' + tmp[1];
				          	var rowCount = $('#route_path_details tr').length;

				          	$('#route_path_details tr:last').after('<tr><td>' + parseInt(rowCount) + '</td><td>' + address + '</td></tr>');
				        }
				      } 
				      else 
				      {
				        alert("Geocoder failed due to: " + status);
				      }
				});
			}
		};
	}
})(PF);

$(document).ready(function(namespace)
{
	var map = new PF.Map();
	map.init();

	$('#get_current_location').click(function() 
	{
		map.showLocation();
	});

	$('#add_route_label').click(function() 
	{
		var routeInput = $('#route_labels_group > .controls');
		var removeButton = $('<span class="add-on btn btn-danger" id="delete_route_label"><i class="icon-remove icon-white"></i></span>');		
		removeButton.click(function()
		{
			$(this).parent().remove();
		})

		var inputPrependDiv = $('<div class="input-prepend input-append" id="route_input_group" style="margin-bottom: 5px;">');
		var spanAddOn = $('<span class="add-on"><i class="icon-road"></i></span>');
		var inputRouteName = $('<input class="span3" type="text" placeholder="Enter Route Name" name="routeInputName[]" />');
		
		inputPrependDiv.append(spanAddOn);
		inputPrependDiv.append(inputRouteName);
		inputPrependDiv.append(removeButton);
		routeInput.append(inputPrependDiv);
	})
});