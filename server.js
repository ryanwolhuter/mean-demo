const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

const CONTACTS_COLLECTION = 'contacts';

const app = express();
app.use(bodyParser.json());

const distDir = __dirname + '/dist/';
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in the app.
let db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', (err, client) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save the database object from the client for reuse.
  db = client.db();
  console.log('Database connection ready.');

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App now running on port ${port}`);
  });
});

/* API Routes */

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log(`Error: ${reason}`);
  res.status(code || 500).json(`error: ${message}`);
}

/* 
  "/api/contacts"
  GET: finds all contacts
  POST: creates a new contact
*/

app.get('/api/contacts', (req, res) => {
  db.collection(CONTACTS_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, 'Failed to get contacts.');
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post('/api/contacts', (req, res) => {
  const newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.name) {
    handleError(res, 'Invalid user input.', 'Must provide a name.', 400);
  } else {
    db.collection(CONTACTS_COLLECTION).insertOne(newContact, (err, doc) => {
      if (err) {
        handleError(res, err.message, 'Failed to create new contact.');
      } else {
        res.status(201).json(doc.ops[0]);
      }
    })
  }
});

/* 
  "/api/contacts/:id"
  GET: find contact by id
  PUT: update contact by id
  DELETE: deletes contact by id
*/

app.get('/api/contacts/:id', (req, res) => {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
    if (err) {
      handleError(res, err.message, 'Failed to get contact.');
    } else {
      res.status(200).json(doc);
    }
  });
  
});

app.put('/api/contacts/:id', (req, res) => {
  const updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
    if (err) {
      handleError(res, err.message, 'Failed to update contact.');
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  db.collection(CONTACTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});