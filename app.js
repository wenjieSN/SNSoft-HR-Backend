const express = require('express');
const bodyParser = require('body-parser'); //json -> object
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const async = require('async');

const User = require('./models/user').User;
const Department = require('./models/department').Department;
const Leave = require('./models/leave').Leave;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");

  next();
});


//post user
app.post('/user', (req, res) => {

  var userData = req.body;

  console.log(userData);

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
       contactNo:user.contactNo,
       status:user.status,
       indexID:user.indexID
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

  User.find().then((users)=>{

    res.json(users);

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

    res.send(JSON.stringify(user));
  },(e)=>{
      res.status(400).send(e);
  });
});


//update user by id
app.patch('/user/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid user');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    'password',
    'name',
    'userGroup',
    'department',
    'position',
    'supervisor',
    'contactNo',
    'lastModified',
    'status'
  ]);

  User.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedUser) => {
    if(!updatedUser){
      return res.status(404).send();
    }
    res.json(updatedUser);
  }).catch((e)=>{
    res.status(400).send();
  });

});



//bulk update user
app.patch('/user',(req,res)=>{
  var users = req.body;
  var finalUpdated = [];

  async.each(users, (user) => {

    var body = _.pick(user,[
      'password',
      'name',
      'userGroup',
      'department',
      'position',
      'supervisor',
      'contactNo',
      'lastModified',
      'status'
    ]);

    User.findByIdAndUpdate(user._id,{$set:body},{new:true}).then((updatedUser) => {
      if(!updatedUser){
        return res.status(404).send();
      }

      finalUpdated.push(updatedUser);
      if(finalUpdated.length == users.length){
        res.json(finalUpdated);
      }

    }).catch((e)=>{
      res.status(400).send();
    });
  }, (e) => {
      console.log('error users \n');
      console.log(e);
  });

});


//connect
app.listen(3003, () => {
  console.info('Started on port 3003');
});

module.exports = {
  app
};
