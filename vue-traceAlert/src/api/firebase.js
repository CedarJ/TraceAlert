/* This file contains code for doing firebase interactions,
including user authentication and database interaction  */
import firebase from 'firebase'
// Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyCyAHMfKLXjp9bpxEkBH0vS6dux21HKTJ0',
  authDomain: 'tracealert-94669.firebaseapp.com',
  databaseURL: 'https://tracealert-94669-default-rtdb.firebaseio.com',
  projectId: 'tracealert-94669',
  storageBucket: 'tracealert-94669.appspot.com',
  messagingSenderId: '529576902686',
  appId: '1:529576902686:web:e1b9e70671527112cfae0f'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// for database access:
let db = firebase.firestore()
// stores the data used for user authentication
let currentUser

function getdate (now, datetime) {
  now = new Date(now)
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()
  if (datetime) {
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
  } else {
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
  }
}

export function dateFormat (now, datetime) {
  return getdate(now, datetime)
}

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
export function createNewUser (user) {
  // Create account, get User UID
  return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      // generate user token
      currentUser = userCredential.user
      // create new document for the user
      return db.collection('users').doc(currentUser.uid).set({
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
        contactCount: 0,
        riskyWeight: 1
      }).then(() => {
        return currentUser.uid
      })
    })
}

// update user
export function updateUser (user) {
  return db.collection('users').doc(currentUser.uid).set({
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
    contactCount: 0,
    riskyWeight: 1
  })
}

export function login (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      currentUser = userCredential.user
      // Existing and future Auth states are now persisted
      return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    })
}

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
*/
export function addNewContact (contact) {
  if (!currentUser) {
    currentUser = firebase.auth().currentUser
  }
  let newDocName = `${contact.locationInfo.name}+${contact.locationInfo.city}+${contact.locationInfo.state}`
  let docRef = db.collection('users').doc(currentUser.uid).collection('placesAndContacts').doc(newDocName)

  // update contactCount
  let increment = contact.contact.length
  db.collection('users').doc(currentUser.uid).update('contactCount', firebase.firestore.FieldValue.increment(increment))
    .then(() => {
      console.log('contactCount successfully updated!')
    })
    .catch(err => {
      console.log('Error occurred when updating contactCount: ' + err)
    })

    // update placesAndContacts
  docRef.get().then(doc => {
    if (doc.exists) {
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
export function getUserInfo () {
  if (!currentUser) {
    currentUser = firebase.auth().currentUser
  }
  return new Promise((resolve, reject) => {
    db.collection('users').doc(currentUser.uid).get()
      .then(doc => {
        let record = doc.data()
        let userInfo = {
          firstname: record.firstname,
          surname: record.surname,
          dateOfBirth: getdate(Date(record.dateOfBirth)),
          phone: record.phone,
          email: record.email,
          address: record.address,
          city: record.city,
          state: record.state,
          postalCode: record.postalCode
        }
        resolve(userInfo)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

// returns whether the user is at risk based on the value stored in database
// function returns a Promise
export function getRiskStatus () {
  if (!currentUser) {
    currentUser = firebase.auth().currentUser
  }
  return new Promise((resolve, reject) => {
    db.collection('users').doc(currentUser.uid).get()
      .then(doc => {
        resolve(doc.data().atRisk)
      }).catch(err => {
        reject(err)
      })
  })
}

// return a list of locations and contacts in each individual location
// function returns a promise
export function getContacts () {
  if (!currentUser) {
    currentUser = firebase.auth().currentUser
  }
  return new Promise((resolve, reject) => {
    db.collection('users').doc(currentUser.uid).collection('placesAndContacts').get()
      .then(querySnapshot => {
        let contacts = querySnapshot.docs.map(doc => {
          return doc.data()
        })
        resolve(contacts)
      }).catch(err => {
        console.log('Error occurred when getting contacts: ' + err)
        reject(err)
      })
  })
}

// returns the total number of contacts in the past 14 days
// function returns a promise
export function getContactCount () {
  if (!currentUser) {
    currentUser = firebase.auth().currentUser
  }
  return new Promise((resolve, reject) => {
    db.collection('users').doc(currentUser.uid).get()
      .then(doc => {
        resolve(doc.data().contactCount)
      }).catch(err => {
        reject(err)
      })
  })
}
