/*----------------Start Here-----------------*/
function startScan(){
  QRScanner.prepare(onDone); // show the prompt
}
/*-------------------------------------------*/
function onDone(err, status){
  if (err) {
   // here we can handle errors and clean up any loose ends.
   console.error(err);
  }
  if (status.authorized) {
    // W00t, you have camera access and the scanner is initialized.
    // QRscanner.show() should feel very fast.
    QRScanner.show(function(status){
      console.log('Show: '+status.showing);
    });
    QRScanner.scan(displayContents);
  } else if (status.denied) {
   // The video preview will remain black, and scanning is disabled. We can
   // try to ask the user to change their mind, but we'll have to send them
   // to their device settings with `QRScanner.openSettings()`.
   alert('Please allow the camera function')
  } else {
    // we didn't get permission, but we didn't get permanently denied. (On
    // Android, a denial isn't permanent unless the user checks the "Don't
    // ask again" box.) We can ask again at the next relevant opportunity.
    alert('Please check the privacy selections')
  }
}
 
function displayContents(err, text){
  if(err){
    // an error occurred, or the scan was canceled (error code `6`)
    console.log('Failed to read')
  } else {
    // The scan completed, display the contents of the QR code:
    setContact(text);
    console.log('Done');
    QRScanner.destroy(function(status){
  console.log(status);
});
    console.log('Finished');
  }
}

let contact = {
        locationInfo: {
            name: "",
            city: "",
            state: "",
        },
        contact: []
    }

var road = "";
var areas = "";
var city = "";
var states = "";

function setContact(text){
  if (text.substring(0,7) === "Tracing") {

    location();
    setTimeout(function() {
      contact.locationInfo.name = road;
      contact.locationInfo.city = city;
      contact.locationInfo.state = states;

      var infoma = {
          contactId: (text.substring(7)),
          time: new Date(),
          preciseLocation: (areas),
      }
      contact.contact.push(infoma);

        addNewContact(contact);
        alert('Add success');
          contact = {
            locationInfo: {
            name: "",
            city: "",
            state: "",
          },
          contact: []
      }
    }, 1000);
  }
  else
  {
    alert('Unrecognized text: ' + text);
  }
}

function location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

function onSuccess(position) {

    function success(result) {
    var codeResult = result[0];
    road = codeResult.thoroughfare +  ' ' + codeResult.subThoroughfare;
    areas = codeResult.areasOfInterest;
    city = codeResult.locality;
    states = codeResult.administrativeArea;
    
    console.log("Result: " + JSON.stringify(codeResult));
    }

    function failure(err) {
    console.log(err);
    }

    nativegeocoder.reverseGeocode(success, failure, position.coords.latitude, position.coords.longitude, { useLocale: true, maxResults: 1 });

    console.log("navigator.geolocation works well");

}

// onError Callback receives a PositionError object
function onError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}
