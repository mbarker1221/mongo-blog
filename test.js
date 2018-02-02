const chai = require('chai');
const chaiHttp = require('chai-http');
const expect=chai.expect;

const mongoose = require('mongoose');
const should = chai.should();

const {BlogPost} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedBlogPostData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: {
        firstName: example.name.firstName(),
        lastName: example.name.lastName()
      },
      title: example.sentence(),
      content: body.text()
    });
  }
 
  return BlogPost.insertMany(seedData);
}
describe('blog', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogPostData();
  })

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

describe('get', function() {
  it('should list blog titles on GET', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body.length).to.be.above(0);
        const objKeys = ['title', 'content', 'author'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(objKeys);
        });
   });
});

describe('post', function() {
  it('should add a blog post on POST', function() {
    const newBlog = { 
       author: {
       firstName: name.firstName(),
       lastName: name.lastName(),
     },
      title: example.sentence(), 
      content: body.text()
    };
     
    const expectedKeys = ['title', 'content', 'author'].concat(Object.keys(newPost));
   return chai.request(app)
      .post('/posts')
      .send(newBlog)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.content).to.equal(newBlog.content);
        expect(res.body.title).to.equal(newBlog.title);
        expect(res.body.author).to.equal(newBlog.author);
        expect(res.body).to.have.all.keys(expectedKeys);
   });
});

describe('put', function() {
  it('should update blog on PUT', function() {
    const updateData = {
      author: {
        firstName: 'me',
        lastName: 'barker'
      },
        title: 'this',
        content: 'words words words'
    };
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/posts/${updateData.id}`)
          .send(updateData)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.include.keys('author', 'title', 'content');
       });
    });
});

describe('delete', function() {
  it('should delete blog on DELETE', function() {
    return chai.request(app);
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body[0].id}`)
    })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
});