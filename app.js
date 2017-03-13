const express = require('express');
const bodyParser = require('body-parser'); //json -> object

const mongoose = require('./server/dbConnect');
const User = require('./models/user').User;
const Department = require('./models/department').Department;


var app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// get AllUser
app.get('/users', (req,res,next) =>{
  User.find({}, function(err, users) {
    if (err) throw err;
    // object of all the users
    res.json(users);
  });
})


//post user
app.post('/user', (req, res,next) => {
  var user = new User({
    email:req.body.data.username,
    password:req.body.data.userpwd,
    name:req.body.data.fullname,
    userGroup:req.body.data.usergroup,
    department:req.body.data.department,
    position:req.body.data.position,
    supervisor:req.body.data.supervisor,
    contactNo:req.body.data.contactno,
    indexID:req.body.data.indexID
  });

  user.save().then((doc) => {
    // res.send(doc);
    res.status(201).json(doc)
  }, (e) => {
    res.status(400).send(e);
  });
});

//get User
app.get('/user',(req,res,next)=>{
  User.find().then((users)=>{
    res.send({
      users
    });
  },(e)=>{
      res.status(400).send(e);
  });
});

//post department
app.post('/department', (req, res,next) => {
  var department = new Department({
    name:req.body.name,
    head:req.body.head
  });

  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get department
app.get('/department',(req,res,next)=>{
  User.find().then((departments)=>{
    res.send({
      departments
    });
  },(e)=>{
      res.status(400).send(e);
  });
});




//connect
app.listen(3003, () => {
  console.log('Started on port 3003');
});

module.exports = {
  app
};
