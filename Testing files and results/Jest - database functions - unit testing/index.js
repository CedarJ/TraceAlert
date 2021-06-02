const firebase = require('firebase')
require("firebase/firestore");
let admin = require('firebase-admin')

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

// Initialize Firebase and Admin SDK
firebase.initializeApp(firebaseConfig);
var serviceAccount = require("./tracealert-94669-firebase-adminsdk-8o5ym-907dfde87e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


function setRiskyWeight(userId, weight){
    if (userId == null){
        console.log('Error occurred when setting risky weight: userId was not passed')
    } else if (weight == null){
        console.log('Error occurred when setting risky weight: weight was not passed')
    } else if (typeof userId != 'string' || typeof weight != 'number'){
        console.log('Error occurred when setting risky weight: wrong types of parameters')
    } else {
        admin.firestore().collection('users').doc(userId)
        .update({riskyWeight: weight})
        .then(() => {
            console.log(`riskyWeight of user ${userId} successfully updated!`)
        })
        .catch(err => {
            console.log(`Error occurred when updating user's riskyWeight: ${err}`)
        })
    }
}


function getRiskyWeight(userId){
    if (userId == null){
        console.log('userId cannot be null')
    } else if (typeof userId != 'string'){
        console.log('userId is of invalid type')
    } else {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('users').doc(userId)
            .get()
            .then(doc => {
                if (doc.exists){
                    resolve(doc.data().riskyWeight)
                } else {
                    console.log('This user does not exist')
                    resolve()
                }
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}


// userId: the unique _id used to identify the user in database
// atRisk: boolean value for indicating whether the user is of high risk
function updateRiskStatus(userId, atRisk){
    if (userId == null){
        console.log('Error occurred when updating risk status: the userId is not specified')
    } else if (atRisk == null){
        console.log('Error occurred when updating risk status: atRisk is not specified')
    } else if (typeof userId != 'string' || typeof atRisk != 'boolean'){
        console.log('Error occurred when updating risk status: arguments are of the wrong types')
    } else {
        admin.firestore().collection('users').doc(userId)
        .update({atRisk: atRisk})
        .then(() => {
            console.log(`Risk status of user ${userId} updated to: ${atRisk ? 'dangerous' : 'safe'}`)
        })
        .catch(err => {
            console.log(`Error occurred when updating user's risk status: ${err}`)
        })
    }
}


// **** Run every 24 hours ****
function updateRiskParameters(riskLevel, threshold, tiers){
    if (riskLevel == null){
        console.log('No parameter specified')
    } else if (threshold == null && typeof riskLevel == 'string'){
        admin.firestore().collection('risk_status').doc('parameters')
        .update({
            risk_level: riskLevel,
        })
        .then(() => {
            console.log('Risk level successfully updated!')
        })
        .catch(err => {
            console.log(`Error occurred when updating risk level: ${err}`)
        })
    } else if (tiers == null && typeof riskLevel == 'string' && typeof threshold == 'number'){
        admin.firestore().collection('risk_status').doc('parameters')
        .update({
            risk_level: riskLevel,
            threshold: threshold,
        })
        .then(() => {
            console.log('Risk level and threshold successfully updated!')
        })
        .catch(err => {
            console.log(`Error occurred when updating risk level and threshold: ${err}`)
        })
    } else if ((riskLevel != null && typeof riskLevel != 'string') || (threshold != null && typeof threshold != 'number') || (tiers != null && typeof tiers != 'number')){
        console.log('Error occurred when updating risk parameters: wrong types of arguments being passed')
    } else {
        admin.firestore().collection('risk_status').doc('parameters')
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
}


// **** Run every 24 hours ****
function deleteAllOutdatedContacts(){
    admin.firestore().collection('users').get().then(querySnapshot => {
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
        admin.firestore().collection('users').doc(userId).collection('placesAndContacts').get()
        .then(querySnapshot => {
            let countDeleted = 0
            querySnapshot.forEach(doc => {
                let newContact = []
                doc.data().contact.forEach(e => {
                    let timestamp = e.time.toDate()
                    let msPassed = Math.abs(today - timestamp)
                    let daysPassed = Math.ceil(msPassed / (1000 * 60 * 60 * 24))
                    if (daysPassed > 14){
                        countDeleted += 1
                    } else {
                        newContact.push(e)
                    }
                })
                if (newContact.length == 0){
                    admin.firestore().collection('users').doc(userId).collection('placesAndContacts').doc(doc.id)
                    .delete()
                    .catch(err => {
                        reject(err)
                    })
                } else {
                    admin.firestore().collection('users').doc(userId).collection('placesAndContacts').doc(doc.id)
                    .update({contact: newContact})
                    .catch(err => {
                        reject(err)
                    })
                }
            })
            // update contactCount field
            if (countDeleted != 0){
                admin.firestore().collection('users').doc(userId).update("contactCount", admin.firestore.FieldValue.increment(-countDeleted))
                .then(() => {
                    console.log('contactCount successfully updated!')
                })
                .catch(err => {
                    console.log('Error occurred when updating contactCount')
                })
            }
            resolve(countDeleted)
        })
        .catch(err => {
            reject(err)
        })
    })
}


// return a list of uid of all direct contacts
function getDirectContacts(userId){
    if (userId == null){
        console.log('Error occurred when getting direct contacts: no userId provided')
    } else {
        let contacts = {}
        return new Promise((resolve, reject) => {
            admin.firestore().collection('users').doc(userId).get()
            .then((doc) => {
                if (!doc.exists){
                    console.log('Error occurred when getting direct contacts: the userId does not exist')
                    resolve()
                } else {
                    admin.firestore().collection('users').doc(userId).collection('placesAndContacts').get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            doc.data().contact.forEach(c => {
                                contacts[c.contactId] = 1
                            })
                        })
                        resolve(Object.keys(contacts))
                    })
                    .catch(err => {
                        reject(err)
                    })
                }
            })
        })
    }
}


function getRiskStatus(userId){
    if (userId == null){
        console.log('Error occurred when updating risk status: userId is not provided')
    } else if (typeof userId != 'string'){
        console.log('Error occurred when updating risk status: userId is of the wrong type')
    } else {
        return new Promise((resolve, reject) => {
            admin.firestore().collection('users').doc(userId).get()
            .then(doc => {
                console.log(doc.data().atRisk)
                resolve(doc.data().atRisk)
            })
            .catch(err => {
                reject('Error occurred when getting risk status: ' + err)
            })
        })
    }
}

//*run every 24hr for every userId*
//get the riskStatus&riskyWeightCount of the selected user
//update risky weight by riskstatus&special cases' coefficient
function adjustRiskyWeight(userId){
    var rS;
    var rWC;
    getRiskStatus(userId)
    .then(riskStatus=>{
        rS = riskStatus;
    })
    .then(()=>{
        getDirectContacts(userId)
        .then(contacts=>{
            for (let i = 0; i < contacts.length; i++){
                getRiskyWeight(contacts[i])
                .then(riskyWeight=>{
                    rWC += riskyWeight;
                });
            }
        });
    })
    .then(()=>{
        if ((rS == true) && (rWC >= 1000)){
            setRiskyWeight(userId, 1*3*3);
        }else if ((rS == true) && (rWC < 1000)){
            setRiskyWeight(userId, 1*3*1);
        }else if ((!rS == true) && (rWC >= 1000)){
            setRiskyWeight(userId, 1*1*3);
        }else if ((!rS == true) && (rWC < 1000)){
            setRiskyWeight(userId, 1*1*1);
        }
    });
}

//get the list of Countacts uid
//return the accumulation of risky weight
//update risk status by the amount of risky weight count
function determineUserRisk(userId){
    var sum;
    getDirectContacts(userId)
    .then(contacts=>{
        for (let i = 0; i < contacts.length; i++){
            getRiskyWeight(contacts[i])
            .then(riskyWeight=>{
                sum += riskyWeight;
            });
        }
    })
    .then(()=>{
        updateRiskStatus(userId, (sum >= 420));
    });
}

// code for testing
module.exports =  {
    setRiskyWeight: setRiskyWeight,
    getRiskyWeight: getRiskyWeight,
    updateRiskStatus: updateRiskStatus,
    getRiskStatus: getRiskStatus,
    updateRiskParameters: updateRiskParameters,
    getDirectContacts: getDirectContacts,
}