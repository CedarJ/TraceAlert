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
    // Cordova is now initialized. Have fun!

    console.log('bluetoothle');
    document.getElementById('deviceready').classList.add('ready');
    new Promise(function (resolve) {
        bluetoothle.initialize(resolve, {
            request: true,
            statusReceiver: false
        });
    }).then(function (result) {
        if (result.status === "enabled") {
            console.log('yyyyyyyyyyyy')
            // log("Bluetooth is enabled.");
            // log(result);
        } else {
            console.log('nnnnnnnnnn')
            // log("Bluetooth is not enabled:", "status");
            // log(result, "status");
        }
    }, handleError);
}



function handleError(error) {
    console.log(error)
    // var msg;
    // if (error.error && error.message) {

    //     var errorItems = [];

    //     if (error.service) {

    //         errorItems.push("service: " + (uuids[error.service] || error.service));
    //     }

    //     if (error.characteristic) {

    //         errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
    //     }

    //     msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    // } else {
    //     msg = error;
    // }

    // log(msg, "error");

    // if (error.error === "read" && error.service && error.characteristic) {

    //     reportValue(error.service, error.characteristic, "Error: " + error.message);
    // }
}
