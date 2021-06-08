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
    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    alert('Running cordova-' + cordova.platformId + '@' + cordova.version)
    firebase.auth().onAuthStateChanged(function(user) {
        if (user != null) {
            currentUser = user
            console.log('logged in')
            pageTransition(qr_page)
            bluetoothIntialize();
        } else {
            console.log('logged out')
            pageTransition(home_page)
        }
    });
}



function processLogin(){
    userEmail = document.getElementById('email-login').value
    userPassword = document.getElementById('password-login').value
    login(userEmail, userPassword).then(() => {
        pageTransition(qr_page)
    }).catch(err => alert(err))
}

function processSignup(){
    let user = {
        firstname: document.getElementById('firstname-signup').value,
        surname: document.getElementById('lastname-signup').value,
        dateOfBirth: new Date(document.getElementById('birth-signup').value),
        phone: document.getElementById('phone-signup').value,
        email: document.getElementById('email-signup').value,
        password: document.getElementById('password-signup').value,
        address: document.getElementById('address-signup').value,
        city: document.getElementById('city-signup').value,
        state: document.getElementById('state-signup').value,
        postalCode: document.getElementById('postalCode-signup').value,
    }
    console.log(user)
    createNewUser(user).then(() => {
        pageTransition(qr_page)
    }).catch(err => {
        alert(err)
    })
}

function processInformationUpdate(){
    let user = {
        firstname: document.getElementById('firstname-edit').value,
        surname: document.getElementById('lastname-edit').value,
        dateOfBirth: new Date(document.getElementById('birth-edit').value),
        phone: document.getElementById('phone-edit').value,
        email: document.getElementById('email-edit').value,
        address: document.getElementById('address-edit').value,
        city: document.getElementById('city-edit').value,
        state: document.getElementById('state-edit').value,
        postalCode: document.getElementById('postalCode-edit').value,
    }
    updateUserInfo(user).then((data) => {
        pageTransition(information_page)
        goBack()
    }).catch(err => {
        alert(err)
    })
}
