const express = require('express');
const bodyParser = require('body-parser'); //json -> object

const mongoose = require('./server/dbConnect');
const User = require('./models/user').User;
const Department = require('./models/department').Department;


var app = express();

app.use(bodyParser.json());

//post user
app.post('/user', (req, res) => {
  var user = new User({
    email:req.body.email,
    password:req.body.password,
    name:req.body.name,
    userGroup:req.body.userGroup,
    department:req.body.department,
    position:req.body.position,
    supervisor:req.body.supervisor,
    contactNo:req.body.contactNo
  });

  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get User
app.get('/user',(req,res)=>{
  User.find().then((users)=>{
    res.send({
      users
    });
  },(e)=>{
      res.status(400).send(e);
  });
});

//post department
app.post('/department', (req, res) => {
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
app.get('/department',(req,res)=>{
  User.find().then((departments)=>{
    res.send({
      departments
    });
  },(e)=>{
      res.status(400).send(e);
  });
});




//connect
app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {
  app
};
