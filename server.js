const express = require('express');
// const morgan = require('morgan');


const server = express();

// server.use(morgan('combined'))
server.use(logger);
// server.use(validateUserId);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.get('/:id', validateUserId, (req, res) => {
  res.send(`<h2>Let's write some middleware! </h2>`, req.hub);
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


// for posts, user_id is required and must be id of an existing user

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


