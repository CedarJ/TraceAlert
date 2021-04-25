document.addEventListener('locationready', onSuccess, false);
var i = 1;
var timesp = 0;
function onSuccess(position) {
	  var tm = position.timestamp - timesp;
    if (tm > 5000) {
    timesp = position.timestamp ;
    console.log(i);
    i++;
  var element=document.getElementById('geolocation');
	element.innerHTML = 'Latitude: '          + position.coords.latitude          + '<br />' +
      'Longitude: '         + position.coords.longitude         + '<br />' +
      'Altitude: '          + position.coords.altitude          + '<br />' +
      'Accuracy: '          + position.coords.accuracy          + '<br />' +
      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br />' +
      'Heading: '           + position.coords.heading           + '<br />' +
      'Speed: '             + position.coords.speed             + '<br />' +
      'Timestamp: '         + position.timestamp                + '<br />' + '<hr />';
  function success(result) {
  var firstResult = result[0];
  var element=document.getElementById('geocode');

  element.innerHTML = 'Address: ' + firstResult.thoroughfare +  ' ' + firstResult.subThoroughfare + '<br />' + firstResult.areasOfInterest + '<br />' + firstResult.subLocality + '<br />' +firstResult.locality + '<br />' +  firstResult.administrativeArea + '<br />' + firstResult.countryName + '<br />';
  console.log("First Result: " + JSON.stringify(firstResult));
	}

	function failure(err) {
  	console.log(err);
	}

	nativegeocoder.reverseGeocode(success, failure, position.coords.latitude, position.coords.longitude, { useLocale: true, maxResults: 1 });

	console.log("navigator.geolocation works well");
}
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}


  //document.addEventListener('locationready', onSuccess, false);
  navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true});
  
 /* function locatinggg(){
    alert('aaaa');
}*/
//navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});


