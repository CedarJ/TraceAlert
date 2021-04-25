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
//document.addEventListener('deviceready', onDeviceReady, false);
console.log('bluetooth');
document.addEventListener('bluetoothready', onDeviceReady, false);

function onDeviceReady() {

    new Promise(function (resolve) {

        bluetoothle.initialize(resolve, { request: true, statusReceiver: false });

    }).then(initializeSuccess, handleError);
    console.log('Bluetooth Works');

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
    alert('Bluetooth Error');
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

var foundDevices = [];

function startScan() {

    log("Starting scan for devices...", "status");

    foundDevices = [];

    document.getElementById("devices").innerHTML = "";
    document.getElementById("services").innerHTML = "";
    document.getElementById("output").innerHTML = "";

    if (window.cordova.platformId === "windows") {

        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }
    else {

        bluetoothle.startScan(startScanSuccess, handleError, { services: [] });
    }
}

function startScanSuccess(result) {

    log("startScanSuccess(" + result.status + ")");

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
            addDevice(result.name, result.address);
        }
    }
}