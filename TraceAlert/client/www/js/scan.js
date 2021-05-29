/*----------------Start Here-----------------*/
function startQRScan(){
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

function QRStop(){
    QRScanner.destroy(function(status){
      console.log(status);
    });
    console.log('Finished');
}
 
function displayContents(err, text){
  if(err){
    // an error occurred, or the scan was canceled (error code `6`)
    console.log('Failed to read')
  } else {
    // The scan completed, display the contents of the QR code:
    setContact(text);
    console.log('Done');
    /*
    QRScanner.destroy(function(status){
      console.log(status);
    });
    console.log('Finished');*/
  }
}

var road_qr = "";
var areas_qr = "";
var city_qr = "";
var states_qr = "";

function setContact(text){
  
  contact_qr = {
    locationInfo: {
        name: "",
        city: "",
        state: "",
    },
    contact: []
  }

  if (text.substring(0,7) === "Tracing") {
    
    receiveLocation();
    contact_qr = {
      locationInfo: {
        name: road_qr,
        city: city_qr,
        state: states_qr,
      },
      contact: []
    }

    var infoma = {
        contactId: (text.substring(7)),
        time: new Date(),
        preciseLocation: (areas_qr),
    }
    contact_qr.contact.push(infoma);
    if (contact_qr.locationInfo.name == "") {
      alert("Please scan again!");
      alert(JSON.stringify(contact_qr));
      setTimeout(QRScanner.scan(displayContents), 1000);
    }
    else
    {
      //addNewContact(contact_qr);
      alert(JSON.stringify(contact_qr));
      alert('Add success');
      pageTransition(qr_page);
    }
  }
  else
  {
    alert('Unrecognized text: ' + text);
    setTimeout(QRScanner.scan(displayContents), 1000);
  }
}

function receiveLocation(){
    navigator.geolocation.getCurrentPosition(onqrSuccess, onqrError, {enableHighAccuracy: true});
}

function onqrSuccess(qrposition) {
  function qrsuccess(qrresult) {
    var qrcodeResult = qrresult[0];
    road_qr = qrcodeResult.thoroughfare +  ' ' + qrcodeResult.subThoroughfare;
    areas_qr = qrcodeResult.areasOfInterest;
    city_qr = qrcodeResult.locality;
    states_qr = qrcodeResult.administrativeArea;
    console.log("Result: " + JSON.stringify(qrcodeResult));
  }

  function qrfailure(err) {
    console.log(err);
  }

  nativegeocoder.reverseGeocode(qrsuccess, qrfailure, qrposition.coords.latitude, qrposition.coords.longitude, { useLocale: true, maxResults: 1 });

  console.log("navigator.geolocation works well");

}

// onError Callback receives a PositionError object
function onqrError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}
