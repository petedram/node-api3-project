const express = require('express');
// const morgan = require('morgan');

//Databases
const userDb = require('./users/userDb.js');
const postDb = require('./posts/postDb.js')


const server = express();


// server.use(morgan('combined'))
server.use(logger);
server.use(express.json());

// server.use(validateUserId);



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// server.get('/:id', validateUserId, (req, res) => {
//   res.send(`<h2>Let's write some middleware! </h2>`, req.hub);
// });

//CRUD on users
// C - POST new user
server.post('/users', (req, res) => {
  const userInfo = req.body;
  console.log('req', req.body);
  if (userInfo.name) {
      userDb.insert(req.body)
      .then(db => {
          res.status(201).json(db);
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              error: "There was an error while saving the user to the database",
          });
      });
  } else {
      console.log('object error');
          res.status(400).json({
              errorMessage: "Please provide name for user.",
          });
  }
});

// R - GET list of users
server.get('/users', (req, res) => {
  userDb.get(req.query)
      .then(db => {
          res.status(200).json(db);
          res.send('/users');
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              error: "The users information could not be retrieved.",
          })
      })
});

// U - PUT a user
//update(): accepts two arguments, the first is the id of the resource to update and 
//the second is an object with the changes to apply. It returns the count of updated records. 
//If the count is 1 it means the record was updated correctly.

server.put('/users/:id', (req, res) => {
  if (req.body.name) {
  userDb.update(req.params.id, req.body)
      .then(db => {
          if (db) {
              res.status(200).json(db);
          } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." });
          }
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              message: 'Error updating',
          });
      });
  } else {
      console.log('object error');
      res.status(400).json({
          errorMessage: "Please provide name"
      });
  }
});


// D - DELETE a user
server.delete('/users/:id', (req, res) => {
  userDb.remove(req.params.id)
      .then(count => {
          if (count > 0) {
              res.status(200).json({ message: 'The post has been removed' });
          } else {
              res.status(404).json({ message: 'The post with the specified ID does not exist.' });
          }
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              message: 'The post could not be removed',
          });
      });
});

//R - GET list of posts for a user.
server.get('/posts/:id', (req, res) => {
  userDb.getUserPosts(req.params.id)
      .then(db => {
          res.status(200).json(db);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              error: "The users information could not be retrieved.",
          })
      })
});


//C - Post new post for a user.
// requires text: and user_id: 
server.post('/posts/:id', (req, res) => {
  const postInfo = {...req.body, user_id: req.params.id } ;
  console.log('req', req.body);
  if (postInfo.text) {
      postDb.insert(postInfo)
      .then(db => {
          res.status(201).json(db);
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              error: "There was an error while saving the post to the database",
          });
      });
  } else {
      console.log('object error');
          res.status(400).json({
              errorMessage: "Please provide text for post.",
          });
  }
});



//custom middleware

// request method, request url, and a timestamp
function logger(req, res, next) {
  console.log(`Logger ${req.method} ${req.url} ${Date.now()} `); 
  next();
}



// validateUserId validates the user id on every request that expects a user id parameter
// if the id parameter is valid, store that user object as req.user
// if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }

// var d = new Date();
// var n = d.getSeconds();
//   if (n % 3 !== 0) { 
//   console.log('ok', n);
//   res.status(403).json({message : "You shall not pass!"});
// } else {
//   console.log('not ok', n);
//   next();
// };


// validateUserId validates the user id on every request that expects a user id parameter
// if the id parameter is valid, store that user object as req.user
// if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }

//request which requires user_id param: all Posts. example: 


function validateUserId(req, res, next){
  const {user_id} = req.user_id;
  
  Hubs.findById(user_id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({message: 'hub id not found '});
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Error retrieving hub'})
    })
};


// // Write a middleware function called requiredBody. If req.body is not defined and is an empty object, it should cancel the request and send back a status 400 with the message "Please include request body".
// function requiredBody(req, res, next){
//   if (req.body && req.body !== "") {

//   } else {
//     res.status(400).json({message: 'Please include request body'})
//   }
// }








module.exports = server;


