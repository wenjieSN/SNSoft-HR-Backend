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

  for(var user in userData){
       newUser[user] = new User({
        username:userData[user].username,
        password:userData[user].password,
        name:userData[user].name,
        userGroup:userData[user].userGroup,
        department:userData[user].department,
        position:userData[user].position,
        supervisor:userData[user].supervisor,
        contactNo:userData[user].contactNo
      });

      newUser[user].save()
      .then((doc)=>{
        // res.send(doc);
        docs.push(doc);
        if(docs.length == userData.length){
          console.log(docs);
          res.send(docs);
        }
      },(e)=>{
        res.status(400).send(e);
      });
  }


  // var user = new User({
  //   username:req.body.username,
  //   password:req.body.password,
  //   name:req.body.name,
  //   userGroup:req.body.userGroup,
  //   department:req.body.department,
  //   position:req.body.position,
  //   supervisor:req.body.supervisor,
  //   contactNo:req.body.contactNo
  // });
  //
  // user.save().then((doc) => {
  //   res.send(doc);
  // }, (e) => {
  //   res.status(400).send(e);
  // });
});

//get User
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
