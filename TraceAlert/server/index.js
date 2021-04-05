// Start the server by running "node index.js" from the "server" directory

const express = require('express')
const app = express()
const mongo = require('mongodb')

const MongoClient = mongo.MongoClient
// the place where the database is stored. 
// Currently the server is localhost
const dbUrl = 'mongodb://localhost'
// db is initialised when connecting to database, and will be used for database operations
let db

MongoClient.connect(dbUrl, (err, client) => {
    if (err)  throw err
    // the name of the database is "tracealert"
    db = client.db('tracealert')
    // the server is listening on port 3000.
    app.listen(3000, () => console.log('Server listening on 3000'))
})



/*
*** User information resides in the collection named "users"
* One user per document in "users" collection

*** User should be an object in this format:
{
    _id: "",
    firstname: "",
    surname: "",
    dateOfBirth: new Date(1990, 0, 1),
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    atRisk: false,
    placesAndContacts: [
        {
            location: {
                name: "University of Adelaide",
                city: "Adelaide",
                state: "SA",
                preciseLocation: "Near Ingkarni Wardli",
            },
            time: new Date(),
            contacts: [],
        },
        {...},
        {...},
    ]
}
*** Note:
 * _id: this does not neet to be provided at first; the databse will randomly generate one;
 * dateOfBirth: a Date object for storing the date of birth. Month is represented as 0-11.
 * placesAndContacts: an array of places the user has been to since 2 weeks ago; "contacts" property stores an array of unique _ids, which are the _ids of the direct contacts which are also users of TraceAlert
*/

// Add new user as a document into database
function createNewUser(user){
    db.collection('users').insert(user, (err, doc) => {
        if (err){
            console.log("Error occurred when creating a new user in database: " + err)
        } else {
            console.log('New user created. The ID generated is: ' + doc._id)
        }
    })
}