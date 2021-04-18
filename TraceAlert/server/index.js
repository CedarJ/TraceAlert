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
    db.collection('users').doc(userId)
    .update({atRisk: atRisk})
    .then(() => {
        console.log(`Risk status of user ${userId} updated to: ${atRisk ? 'dangerous' : 'safe'}`)
    })
    .catch(err => {
        console.log(`Error occurred when updating user's risk status: ${err}`)
    })
}


// **** Run every 24 hours ****
function updateRiskParameters(riskLevel, threshold, tiers){
    db.collection('risk_status').doc('parameters')
    .update({
        risk_level: riskLevel,
        threshold: threshold,
        tiers: tiers
    })
    .then(() => {
        console.log('Risk parameters successfully updated!')
    })
    .catch(err => {
        console.log(`Error occurred when updating risk parameters: ${err}`)
    })
}


// **** Run every 24 hours ****
deleteAllOutdatedContacts()
function deleteAllOutdatedContacts(){
    db.collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            deleteOutdatedContacts(doc.id)
            .then(count => {
                console.log(count + ' outdated contacts deleted for user ' + doc.id)
            })
            .catch(err => {
                console.log(`Error occurred when deleting outdated contacts for user ${doc.id}: ${err}`)
            })
        })
    })
}


function deleteOutdatedContacts(userId){
    let today = new Date()
    console.log(`Processing user ${userId}...`)
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).collection('placesAndContacts').get()
        .then(querySnapshot => {
            let countDeleted = 0
            querySnapshot.forEach(doc => {
                let newContact = []
                doc.data().contact.forEach(e => {
                    let timestamp = e.time.toDate()
                    console.log(timestamp)
                    let msPassed = Math.abs(today - timestamp)
                    console.log(`msPassed: ${msPassed}`)
                    let daysPassed = Math.ceil(msPassed / (1000 * 60 * 60 * 24))
                    if (daysPassed > 14){
                        console.log(`Days passed: ${daysPassed}`)
                        countDeleted += 1
                    } else {
                        newContact.push(e)
                    }
                })
                if (newContact.length == 0){
                    db.collection('users').doc(userId).collection('placesAndContacts').doc(doc.id)
                    .delete()
                    .catch(err => {
                        reject(err)
                    })
                } else {
                    db.collection('users').doc(userId).collection('placesAndContacts').doc(doc.id)
                    .update({contact: newContact})
                    .catch(err => {
                        reject(err)
                    })
                }
            })
            resolve(countDeleted)
        })
        .catch(err => {
            reject(err)
        })
    })
}