$(function()
{
	var websocket = io.connect();
	var map;
	var taxis = [];
	var zoomMapa = 16;

	websocket.on('newTaxi', function(data){
		console.log(data);
		taxis = data;
		if(data.length > 0){
			addTaxi(data);
		};
		
	});

	websocket.on('taxiMove', function(data){
		console.log(data);
		updatePosTaxi(data);
	});

	websocket.on('deleteTaxi',function(posTaxi){
		deleteTaxi(posTaxi);
	});
	

	function getLocation() {

		var options = {
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
		};

	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition, error,options);
	    } else {
	       showPosition({coords: {latitude: 4.6482837 , longitude: -74.2478934}});
	    }
	};getLocation();

	function showPosition(position){
		map = new google.maps.Map(document.getElementById('mapDir'), {
		    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		    zoom: zoomMapa,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: styles()
		});
		
		trafico();
		websocket.emit('getTaxis');
	};

	function error(err){
		if(err){
			zoomMapa = 11;
			showPosition({coords: {latitude: 4.6482837 , longitude: -74.2478934}});
		}
	};

	var interval;
	function trafico(){
		interval = 	setInterval(function(){
						var trafficLayer = new google.maps.TrafficLayer();
						trafficLayer.setMap(map);
					}, 40000);
	};

	function addTaxi(data){
		var image = {
			        url : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFvElEQVR42u2VaWwUZRjH/+/cM3u2BdqFXhRry2ULiBwSEbwwgEc0GhSICJJIDIQQIJHEaFASIxCJETGooCSEGExAEYQgcoqAUuSsyH223Xa7bbe7O7Mz8/rMNH7ykx+QmHSSZze7mfd5fs//OV6Gu/ywboBugG6A/xVAZrVhKCEtJ05L5O4YgPOpLDDGy8liAC8A52H6O5iyRC3V6k4zSnsl4u38gKExWVYEiT4hSCIEUYKgkImib0wg5+RdBCQG1xG5w+HYLs/ZKbPVvNryp7m9eGk86QN8t7gyHJTa5o+qcp6VZGkwIx/MMsGtLAQ7hwzXsfeCjINXDLTZBuJmGOdvA61tKViZDliWhdF9LdS3hpEfDSMvL4L8gigikSDKwnEsmtwBxm3wnEMZ5nD68yZYGr8Wru1RxfYvjKiXxSGnHhmarSwKJsCbGuCkUhACBZCChYBagDc2OrjckUdOXIx9eCwizhWMjO6DIaVwu11AS0ZAUBXRbOlQdA3BgIL8iIjSHg4kUmLF92UEmsTsMTdQWa6Dqxrix5NIidZr7PclxisNrPe6MbFrcCQDco9SqJFeYK5XDxe7T1lYsTfiB/cyrampgREIokr5GVNHxgE5SJAafaskNgkuerqL4AKVARy/nOzEh9/2RjzehEL1Oja+FQGnd7lWittH9n3F6pfF1kLIzCodUQstEALMHFiOeixn+3It3QJsPZ6jmgDZbBbl5X1RWBjDqKIzeHUcSaqFsOvGEAwoakafgrRfdIjch6DaY8e+BFZuktBEyiZbE7j4dSlEQwcCxWirO3SI7VxcvqNgeL8JQ+8JUHALnAAEyhQeBNX/yfcSuNyq0U+TzEYoFEJlZRUm9b+OWRO87EN4//gLeL72EiqilwCBpGN0ljk+wOZdzVi2Lk0KNCCTMfHrugqUlecBRk9kzv1Wz1bPKN4z8onicbUVRGW51Ch2F4BnpEDNoiQa2+h/zuG63reL6uoBmDG6HTMn9gT0CFYcm4wpI5oR085S+t6EZmmAMn4JNmxrwptr4kh3puDQIBxYU4FB/QlAjSJ74cxl9tH02J4HHysaV9tXoXMZ6nwTgp+97VvF/E60m7IPwGiuRBq3aF4+FkxkmD2pl+9oed3TeGl4I2LKaQpsAm6GLO0DrN8Wx4KPG/wSMprNH1cVY1BVBFAiyF4kgC3zSnYUDw5NGNaPglDWzKLDNH7IkiPbxH1vS2jo1CFJEiRZgeybijnjc5j7lOcohGWnpuLFgX+gInAO3DWpgcmHTQpQ1A07m7FgbQcU2dsRMvavjKKsxCDwXkifr6tnJ98p/kywGmaWVuYjEDWohF4DWl0QtoVp68M4eCMPqkKBFRWK6pmOKTVNmPu440/BT033ozrvFmLBJCmQA3cIALav2DcHO7DgS+pV1QOXULdKgkjLC4EyJE8eOMAOL+kzI2FrXzzU5zpyaQtySIWqy7S+XDBSYPMJHe8eqYGuyRRYg6bTqBLAxPILeP2B63ClAG1CBZy2F80qAdje/JL4XWt275ks5m0qQIA6v7bEwiez0/SuBCdQjcajO9az7Yv7qzfdsrOPVl6rKIm0wE4k4Zimv0YVAqU9gjm7a3GVD4SuqzTqAvrqt/Fyv2PIl9vRkFaRzEpQaPQaUwwCHTAUjgIakMpCmgMiWbi1FIbOMH98HBV9qNdIiRsnTDhC4wx/FW+cWx3KFxrmjSrPPEPq1IiCK/ml4F33g0VKH74VxdGbBhJpBVc7gqiPK8hYHGY6Te2SxbCiFOpukm+BQ6Xtb6gCVFnA2HsdLH/OKwk5oyny7NRmF1ndvdKzP6r+cRmllvu9U0KZxMh6UOOGSY1AyoTW2obpwd7RltaWzsPccwYvGJAfpFgiozuI+YfpNuu6jP52ynkXAOcWbdcOO8OvJW6yHwo/4O3/6jrOfqLrSlDNCdOS9h27jv/rpxugG6Ab4K4D/AW081gLS8YuZAAAAABJRU5ErkJggg==",
			        size : new google.maps.Size(32,32),
			        anchor : new google.maps.Point(20,15)
     			};
     	for(i in data){
     		var marcadorUsuario = new google.maps.Marker({
		      position:  new google.maps.LatLng(data[i].pos.lat, data[i].pos.lng),
		      map: map,
		      animation: google.maps.Animation.DROP,
		      icon: image
			});
			taxis[i].Marker = marcadorUsuario;
     	}  	
	};

	function updatePosTaxi(data){
		taxis[data.id].Marker.setPosition(data.pos);
	};

	function deleteTaxi(posTaxi){
		taxis[posTaxi].Marker.setMap(null);
	}

		// Sets the map on all markers in the array.
	function setMapOnAll(map) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	  }
	}

	// Removes the markers from the map, but keeps them in the array.
	function clearMarkers() {
	  setMapOnAll(null);
	}

	// Shows any markers currently in the array.
	function showMarkers() {
	  setMapOnAll(map);
	}


	function styles(){
		return [{
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#8bc5c5"
							}
							]
						},
						{
							"elementType": "geometry.fill",
							"stylers": [
							{
								"color": "#e4f1f1"
							}
							]
						},
						{
							"elementType": "labels.icon",
							"stylers": [
							{
								"visibility": "off"
							}
							]
						},
						{
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#616161"
							}
							]
						},
						{
							"elementType": "labels.text.stroke",
							"stylers": [
							{
								"color": "#f5f5f5"
							}
							]
						},
						{
							"featureType": "administrative.land_parcel",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#bdbdbd"
							}
							]
						},
						{
							"featureType": "administrative.locality",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"weight": 1
							}
							]
						},
						{
							"featureType": "poi",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#eeeeee"
							}
							]
						},
						{
							"featureType": "poi",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#757575"
							}
							]
						},
						{
							"featureType": "poi.business",
							"stylers": [
							{
								"visibility": "off"
							}
							]
						},
						{
							"featureType": "poi.park",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#e5e5e5"
							}
							]
						},
						{
							"featureType": "poi.park",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#9e9e9e"
							}
							]
						},
						{
							"featureType": "road",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#ffffff"
							}
							]
						},
						{
							"featureType": "road",
							"elementType": "geometry.stroke",
							"stylers": [
							{
								"color": "#408080"
							}
							]
						},
						{
							"featureType": "road",
							"elementType": "labels.icon",
							"stylers": [
							{
								"visibility": "off"
							}
							]
						},
						{
							"featureType": "road.arterial",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#757575"
							}
							]
						},
						{
							"featureType": "road.highway",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#dadada"
							}
							]
						},
						{
							"featureType": "road.highway",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#616161"
							}
							]
						},
						{
							"featureType": "road.local",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#9e9e9e"
							}
							]
						},
						{
							"featureType": "transit",
							"stylers": [
							{
								"visibility": "off"
							}
							]
						},
						{
							"featureType": "transit.line",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#e5e5e5"
							}
							]
						},
						{
							"featureType": "transit.station",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#eeeeee"
							}
							]
						},
						{
							"featureType": "water",
							"elementType": "geometry",
							"stylers": [
							{
								"color": "#c9c9c9"
							}
							]
						},
						{
							"featureType": "water",
							"elementType": "labels.text.fill",
							"stylers": [
							{
								"color": "#9e9e9e"
							}
							]
						}
						]
	}

});
