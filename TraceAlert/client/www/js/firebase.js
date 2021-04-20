/* This file contains code for doing firebase interactions, 
including user authentication and database interaction  */

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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// for database access:
let db = firebase.firestore();
// stores the data used for user authentication
let currentUser; 


// Function for creating an account
/*
    user format:
    let newUser = {
        firstname: "Mary",
        surname: "Smith",
        dateOfBirth: new Date(1991, 0, 1),
        phone: "123456789",
        email: "123456789@gmail.com",
        password: "123456",
        address: "211 Grote Street",
        city: "Adelaide",
        state: "SA",
        postalCode: "5000",
    }
*/
function createNewUser(user){
    // Create account, get User UID
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
        // generate user token
        currentUser = userCredential.user;
        // create new document for the user
        db.collection('users').doc(currentUser.uid).set({
            firstname: user.firstname,
            surname: user.surname,
            dateOfBirth: user.dateOfBirth,
            phone: user.phone,
            email: user.email,
            address: user.address,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
            atRisk: false,
            /* placesAndContacts will be made a subcollection, 
            which will be automatically created when inserting the first location */
        }).then(() => {
            console.log('created!')
        }).catch(err => {
            console.log('Error occurred when creating the account')
        })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error occurred when creating the account: ' + errorMessage)
    });
}


function login(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        currentUser = userCredential.user
        console.log('Signed in!')
        // delete later!
        addNewContact({
            locationInfo: {
                name: "University of Adelaide",
                city: "Adelaide",
                state: "SA",
            },
            contact: [
                {
                    contactId: 'eqTHtJOmfFU4sAZfwMoF',
                    time: new Date(),
                    preciseLocation: "Near Ingkarni Wardli",
                },
                {
                    contactId: 'sKZIBzTHrdt9q2hdpPjC',
                    time: new Date(2021, 1, 1),
                    preciseLocation: "Near Elder Hall",
                }
            ]
        })
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`Error occurred when logging in: ${errorMessage}`)
    });
}

// login('123456789@gmail.com', '123456')
createNewUser({
    firstname: "Molly",
    surname: "Ssss",
    dateOfBirth: new Date(1991, 0, 1),
    phone: "123456789",
    email: "1111111@gmail.com",
    password: "123456",
    address: "211 Grote Street",
    city: "Adelaide",
    state: "SA",
    postalCode: "5000",
})

/*
    let contact = {
        locationInfo: {
            name: "University of Adelaide",
            city: "Adelaide",
            state: "SA",
        },
        contact: [
            {
                contactId: (uid),
                time: new Date(),
                preciseLocation: "Near Ingkarni Wardli",
            },
            {
                contactId: (uid),
                time: new Date(),
                preciseLocation: "Near Elder Hall",
            }
        ]

    }

    ** This function should be called after 5 minutes
*/
function addNewContact(contact){
    let newDocName = `${contact.locationInfo.name}+${contact.locationInfo.city}+${contact.locationInfo.state}`
    let docRef = db.collection('users').doc(currentUser.uid).collection('placesAndContacts').doc(newDocName)

    docRef.get().then(doc => {
        if (doc.exists){
            // only add new contact
            let existingContacts = doc.data().contact
            let newContacts = [...existingContacts, ...contact.contact]
            docRef.update({
                contact: newContacts
            }).then(() => {
                console.log('New contact successfully added!')
            }).catch(err => {
                console.log('Error occurred when adding new contact: ' + err)
            })
        } else {
            // create new location
            docRef.set(contact)
            .then(docRef => {
                console.log('New contact successfully added!')
            })
            .catch(err => {
                console.log('Error occurred when creating a new location: ' + err)
            })
        }
    })
}

// returns a Promise
function getUserInfo() {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            let record = doc.data()
            let userInfo = {
                firstname: record.firstname,
                surname: record.surname,
                dateOfBirth: record.dateOfBirth,
                phone: record.phone,
                email: record.email,
                address: record.address,
                city: record.city,
                state: record.state,
                postalCode: record.postalCode,
            }
            resolve(userInfo)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

// return a list of locations and contacts in each individual location
// function returns a promise
function getContacts(){
    return new Promise((resolve, reject) => {
        db.collection('users').doc(currentUser.uid).collection('placesAndContacts').get()
        .then(querySnapshot => {
            let contacts = querySnapshot.docs.map(doc => {
                return doc.data()
            })
            console.log(contacts)
            resolve(contacts)
        }).catch(err => {
            console.log('Error occurred when getting contacts: ' + err)
            reject(err)
        })
    })
}

// count the total number of contacts in the last 14 days
// function returns a promise
function countContacts(){
    return new Promise((resolve, reject) => {
        db.collection('users').doc(currentUser.uid).collection('placesAndContacts').get()
        .then(querySnapshot => {
            let numberOfContacts = 0
            querySnapshot.forEach(doc => {
                numberOfContacts += doc.data().contact.length
            })
            console.log(numberOfContacts)
            resolve(numberOfContacts)
        }).catch(err => {
            console.log('Error occurred when counting the total number of contacts: ' + err)
            reject(err)
        })
    })
}