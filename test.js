const chai = require('chai');
const chaiHttp = require('chai-http');
const expect=chai.expect;

const {app, runServer, closeServer} = require('/server.js');
const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog titles on GET', function() {
   
    return chai.request(app)
      .get('BlogPosts')
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

  it('should add a blog post on POST', function() {
    const newBlog = { 
      title: 'my blog', 
      content: ['It was just another day at the office...'], 
      author: 'M.Barker'};

    const expectedKeys = ['title', 'content', 'author'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/posts/:id')
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

  it('should update blog on PUT', function() {

    const updateData = {
      title: 'foo',
      content: 'buzz bizz',
      author: 'me'
    };

    return chai.request(app)
     
      .get('/posts')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.include.keys('title', 'content', 'author');
       });
    });
});

  it('should delete blog on DELETE', function() {
    return chai.request(app)
     
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body[0].id}`)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
    
      });
  });
};