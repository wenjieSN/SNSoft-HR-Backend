const express = require('express');
const bodyParser = require('body-parser'); //json -> object
const ObjectID = require('mongodb').ObjectID;

const mongoose = require('./server/dbConnect');
const User = require('./models/user').User;
const Department = require('./models/department').Department;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//post user
app.post('/user', (req, res) => {

  var userData = req.body;
  var docs = [];
  var newUser = [];

  userData.forEach((user) => {
    newUser.push(
      new User({
       username:user.username,
       password:user.password,
       name:user.name,
       userGroup:user.userGroup,
       department:user.department,
       position:user.position,
       supervisor:user.supervisor,
       contactNo:user.contctNo
     })
    );
  },(err) =>{
    console.log(err);
  });

  User.create(newUser).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//get all User
app.get('/user',(req,res)=>{

  console.log(req);
  User.find().then((users)=>{
    res.send({
      users
    });
  },(e)=>{
      res.status(400).send(e);
  });
});

//get User by ObjectID
app.get('/user/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  User.findById(id).then((user)=>{
    if(!user){
      return res.status(404).send();
    }
    res.send({user});
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
