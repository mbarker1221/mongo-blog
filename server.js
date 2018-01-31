const express = require('express');
const morgan = require('morgan');
const BlogPostsRouter = require('./router.js');
const app = express();
//const router = express.Router();
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./database.js');

app.use(morgan('common'));
//app.use('/', ./router.js);

const {BlogPost} = require('./models.js');


let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
      const newPost = { 
    author: {
     firstName: 'Michelle',
     lastName: 'Barker'
    },
   title: 'New Blog',
   content: 'Some words lalala',
 }
 
BlogPost.create(newPost).then((post)=>{
 
}).catch(()=> console.log('error')) 


        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
      
        return;
      }
      resolve();
    });
  });
}



module.exports = {app, runServer, closeServer};
