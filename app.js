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

/***********************************************user************************************************/
//post user
app.post('/user', (req, res) => {
  var userData = req.body;
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

/***********************************************department************************************************/
//get all department
app.get('/department',(req,res)=>{
  Department.find().then((departments)=>{
    res.json(departments);
  },(e)=>{
      res.status(400).send(e);
  });
});

//get department by ObjectID
app.get('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Department.findById(id).then((department)=>{
    if(!department){
      return res.status(404).send();
    }
    res.json(department);
  },(e)=>{
      res.status(400).send(e);
  });
});

//create department
app.post('/department', (req, res) => {
  var departmentData = req.body;
  var newDepartment = [];

  departmentData.forEach((department) => {
    newDepartment.push(
      new User({
       name:department.name,
       head:department.head,
       createdAt:department.createdAt,
       lastModified:department.lastModified,
       status:department.status,
       indexID:department.indexID
      })
    );
  },(err) =>{
    console.log(err);
  });

  Department.create(newDepartment).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//update department by id
app.patch('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid user');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    'name',
    'head',
    'status',
    'lastModified'
  ]);

  Department.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedDepartment) => {
    if(!updatedDepartment){
      return res.status(404).send();
    }
    res.json(updatedDepartment);
  }).catch((e)=>{
    res.status(400).send();
  });
});


//bulk update department
app.patch('/department',(req,res)=>{
  var departments = req.body;
  var finalUpdated = [];

  async.each(departments, (department) => {
    var body = _.pick(department,[
      'name',
      'head',
      'status',
      'lastModified'
    ]);

    Department.findByIdAndUpdate(department._id,{$set:body},{new:true}).then((updatedDepartment) => {
      if(!updatedDepartment){
        return res.status(404).send();
      }
      finalUpdated.push(updatedDepartment);
      if(finalUpdated.length == departments.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).send();
    });
  }, (e) => {
      console.log('error departments \n');
      console.log(e);
  });
});


/***********************************************leave************************************************/
//get all leave
app.get('/leave',(req,res)=>{
  Leave.find().then((leaves)=>{
    res.json(leaves);
  },(e)=>{
      res.status(400).send(e);
  });
});

//get department by ObjectID
app.get('/leave/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Leave.findById(id).then((leave)=>{
    if(!leave){
      return res.status(404).send();
    }
    res.json(leave);
  },(e)=>{
      res.status(400).send(e);
  });
});

//create department
app.post('/leave', (req, res) => {
  var leaveData = req.body;
  var newLeave = [];

  leaveData.forEach((leave) => {
    newLeave.push(
      new Leave({
       user:leave.user,
       type:leave.type,
       from:leave.from,
       to:leave.to,
       description:leave.description,
       approveStatus:leave.approveStatus,
       approveBy:leave.approveBy,
       createdAt:leave.createdAt,
       lastModified:leave.lastModified,
       status:leave.status,
       indexID:leave.indexID
      })
    );
  },(err) =>{
    console.log(err);
  });

  Leave.create(newLeave).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//update leave by id
app.patch('/leave/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid leave');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    "type",
    "from",
    "to",
    "description",
    "approveStatus",
    "approveBy",
    "lastModified",
    "status"
  ]);

  Leave.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedLeave) => {
    if(!updatedLeave){
      return res.status(404).send();
    }
    res.json(updatedLeave);
  }).catch((e)=>{
    res.status(400).send();
  });
});


//bulk update leave
app.patch('/leave',(req,res)=>{
  var leaves = req.body;
  var finalUpdated = [];

  async.each(leaves, (leave) => {
    var body = _.pick(leave,[
      "type",
      "from",
      "to",
      "description",
      "approveStatus",
      "approveBy",
      "lastModified",
      "status"
    ]);

    Leave.findByIdAndUpdate(leave._id,{$set:body},{new:true}).then((updatedLeave) => {
      if(!updatedLeave){
        return res.status(404).send();
      }
      finalUpdated.push(updatedLeave);
      if(finalUpdated.length == leaves.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).send();
    });
  }, (e) => {
      console.log('error leave \n');
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
