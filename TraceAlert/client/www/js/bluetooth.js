function bluetoothIntialize(){
    alert(currentUser.uid.substring(0,10));
    new Promise(function (resolve) {

        bluetoothle.initialize(resolve, { 
            request: true, 
            statusReceiver: true,
            restoreKey : "bluetoothleplugin" 
        });

    }).then(initializeSuccess, handleError);
}

function initializeSuccess(result) {

    if (result.status === "enabled") {

        log("Bluetooth is enabled.");
        log(result);
    }

    else {

        document.getElementById("start-scan").disabled = true;

        log("Bluetooth is not enabled:", "status");
        log(result, "status");
    }
    initializePeripheral();
}

function handleError(error) {

    var msg;

    if (error.error && error.message) {

        var errorItems = [];

        if (error.service) {

            errorItems.push("service: " + (uuids[error.service] || error.service));
        }

        if (error.characteristic) {

            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
        }

        msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    }

    else {

        msg = error;
    }

    log(msg, "error");

    if (error.error === "read" && error.service && error.characteristic) {

        reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
}

function log(msg, level) {

    level = level || "log";

    if (typeof msg === "object") {

        msg = JSON.stringify(msg, null, "  ");
    }

    console.log(msg);

    if (level === "status" || level === "error") {

        var msgDiv = document.createElement("div");
        msgDiv.textContent = msg;

        if (level === "error") {

            msgDiv.style.color = "red";
        }

        msgDiv.style.padding = "5px 0";
        msgDiv.style.borderBottom = "rgb(192,192,192) solid 1px";
        document.getElementById("output").appendChild(msgDiv);
    }
}

function initializePeripheral(){

        new Promise(function (resolve) {

        bluetoothle.initializePeripheral(resolve, { 
            request: true, 
            restoreKey : "bluetoothleplugin" 
        });

    }).then(initializePeripheralSuccess, handleError);
}

function initializePeripheralSuccess(result) {

    if (result.status === "enabled") {

        log("Bluetooth peripheral is enabled.");
        log(result);
    }

    else {

        document.getElementById("start-scan").disabled = true;

        log("Bluetooth peripheral is not enabled:", "status");
        log(result, "status");
    }
    startAdvertising();
}

var id = currentUser.uid.substring(0,10);

//Advertising through bluetooth
function startAdvertising(){
    var naid = "Tracing" + id;

    bluetoothle.startAdvertising(startAdvertisingSuccess, handleError, {  
    services:["1821"], //iOS
    service:"1821", //Android
    name:naid})
}

function startAdvertisingSuccess(result){
    log('Advertising succeed');
    log(result.status);

    setTimeout(stopAdvertising, 1170000);
}

function stopAdvertising(){
    bluetoothle.stopAdvertising(stopAdvertisingsuccess, handleError);
}

function stopAdvertisingsuccess(result){
    log('Advertising stopped');
    log(result.status);

    //setTimeout(startAdvertising, 5000);
    startBlScan();
}

//Initialize object
var foundDevices = [];
var road_bl = "";
var areas_bl = "";
var city_bl = "";
var states_bl = "";

function startBlScan() {

    log("Starting scan for devices...");//, "status");
    foundDevices = [];
    contact_bl = {
            locationInfo: {
                name: "",
                city: "",
                state: "",
            },
        contact: []
    }

    getLocation();
    
    bluetoothle.startScan(startScanSuccess, handleError, { services: [] });

    setTimeout(function() {
        stopScan();

        contact_bl = {
            locationInfo: {
                name: road_bl,
                city: city_bl,
                state: states_bl,
            },
            contact: []
        }

        log("Stopped");
        if (contact_bl.contact.length != 0) {
            //addNewContact(contact_bl);
            alert(JSON.stringify(contact_bl));
        }
        alert("BT test: " + JSON.stringify(contact_bl));
        contact_bl = {
        locationInfo: {
            name: "",
            city: "",
            state: "",
        },
            contact: []
        }
    }, 30000);
}

//Scan for other devices
function startScanSuccess(result) {
    log("startScanSuccess");
	
// Push in the user id with same app
    var rena = result.name;
    if (result.rssi >= -80) {
        if (rena.substring(0,7) === "Tracing") {

            var infoma_bl = {
                        contactId: (rena.substring(7)),
                        time: new Date(),
                        preciseLocation: (areas_bl),
                    }
            var duplicate = true;

            for (var i = 0; i < contact_bl.contact.length; i++) {
                if (rena.substring(7) = contact_bl.contact[i].name) {
                    duplicate = false;
                    break;
                }
            }
            if (duplicate) {
                contact_bl.contact.push(infoma_bl);
            }
        }
        /*------------------------------------------------
        var infoma = {
                        contactId: (rena.substring(7)),
                        time: new Date(),
                        preciseLocation: (areas_bl),
                    }
            var duplicate = true;

            for (var i = 0; i < contact_bl.contact.length; i++) {
                if (rena.substring(7) = contact_bl.contact[i].name) {
                    duplicate = false;
                    break;
                }
            }
            if (duplicate) {
                contact_bl.contact.push(infoma);
            }
        ------------------------------------------------*/
    }

    if (result.status === "scanStarted") {

        log("Scanning for devices (will continue to scan until you select a device)...");
    }
    else if (result.status === "scanResult") {

        if (!foundDevices.some(function (device) {

            return device.address === result.address;

        })) {

            log('FOUND DEVICE:');
            log(result);
            foundDevices.push(result);
        }
    }
}

function stopScan() {

    new Promise(function (resolve, reject) {

        bluetoothle.stopScan(resolve, reject);

    }).then(stopScanSuccess, handleError);
}

function stopScanSuccess() {

    if (!foundDevices.length) {

        log("NO DEVICES FOUND");
    }
    else {

        log("Found " + foundDevices.length + " devices.");
    }

    startAdvertising();
}

function getLocation(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

//Get location
function onSuccess(position) {

    function success(result) {
    var codeResult = result[0];
    road_bl = codeResult.thoroughfare +  ' ' + codeResult.subThoroughfare;
    areas_bl = codeResult.areasOfInterest;
    city_bl = codeResult.locality;
    states_bl = codeResult.administrativeArea;
    
    console.log("Result: " + JSON.stringify(codeResult));
    }

    function failure(err) {
    console.log(err);
    }

    nativegeocoder.reverseGeocode(success, failure, position.coords.latitude, position.coords.longitude, { useLocale: true, maxResults: 1 });

    log("navigator.geolocation works well");

}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}
