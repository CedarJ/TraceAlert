/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	document.getElementById('deviceready').classList.add('ready');
    console.log(device.uuid);

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
    console.log('Advertising succeed');
    log(result.status);

    setTimeout(stopAdvertising, 1170000);
}

function stopAdvertising(){
    bluetoothle.stopAdvertising(stopAdvertisingsuccess, handleError);
}

function stopAdvertisingsuccess(result){
    console.log('Advertising stopped');
    log(result.status);

    startScan();
}
//Initialize object
var foundDevices = [];

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


function startScan() {

    log("Starting scan for devices...", "status");

    foundDevices = [];

    location();

    contact.locationInfo.name = road;
    contact.locationInfo.city = city;
    contact.locationInfo.state = states;

    bluetoothle.startScan(startScanSuccess, handleError, { services: [] });

    setTimeout(function() {
        stopScan();
        console.log('Stopped');
        if (contact.locationInfo.name != "") {
            addNewContact(contact);
        }
    }, 30000);
}

//Scan for other devices
function startScanSuccess(result) {

    log("startScanSuccess(" + result.status + ")");
	
// Push in the user id with same app
    var rena = result.name;
    if (result.rssi >= -80) {
        if (rena.substring(0,7) === "Tracing") {

            var infoma = {
                        contactId: (rena.substring(7)),
                        time: new Date(),
                        preciseLocation: (areas),
                    }
            var duplicate = true;

            for (var i = 0; i < contact.contact.length; i++) {
                if (rena.substring(7) = contact.contact[i].name) {
                    duplicate = false;
                    break;
                }
            }
            if (duplicate) {
                contact.contact.push(infoma);
            }
        }
    }

    if (result.status === "scanStarted") {

        log("Scanning for devices (will continue to scan until you select a device)...", "status");
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

        log("Found " + foundDevices.length + " devices.", "status");
    }

    startAdvertising();
}

function location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

//Get location
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
//
function onError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}
