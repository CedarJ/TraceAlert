const firebase = require('firebase')
require("firebase/firestore");


// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCyAHMfKLXjp9bpxEkBH0vS6dux21HKTJ0",
    authDomain: "tracealert-94669.firebaseapp.com",
    databaseURL: "https://tracealert-94669-default-rtdb.firebaseio.com",
    projectId: "tracealert-94669",
    storageBucket: "tracealert-94669.appspot.com",
    messagingSenderId: "529576902686",
    appId: "1:529576902686:web:e1b9e70671527112cfae0f"
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();



// userId: the unique _id used to identify the user in database
// atRisk: boolean value for indicating whether the user is of high risk
function updateRiskStatus(userId, atRisk){
    
}


// **** Run every 24 hours ****
function deleteAllOutdatedLocations(){

}


function deleteOutdatedLocation(userId){
    let user = db.collection('users').findOne({_id: userId})
    let places = user.placesAndContacts
    let today = Date.now()
    let newPlaces = places.filter((place) => {
        const msPassed = Math.abs(today - place.time)
        const daysPassed = Math.ceil(msPassed / (1000 * 60 * 60 * 24))
        return daysPassed > 14
    })
    db.collection('users').updateOne({_id: userId}, {$set: {placesAndContacts: newPlaces}}, (err, res) => {
        if (err){
            console.log('Error occurred when deleting outdated locations: ' + err)
        } else {
            console.log(`Outdated locations deleted!`)
        }
    })
}