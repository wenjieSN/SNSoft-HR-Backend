const express = require('express');
const bodyParser = require('body-parser'); //json -> object
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const async = require('async');

const User = require('./models/user').User;
const Department = require('./models/department').Department;
const Leave = require('./models/leave').Leave;
const Permission = require('./models/permission').Permission;

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
  var newUser =[];
  var results = [];

  for(var user in userData){
     newUser[user] = new User({
      username:userData[user].username,
      password:userData[user].password,
      name:userData[user].name,
      userGroup:userData[user].userGroup,
      department:userData[user].department,
      position:userData[user].position,
      supervisor:userData[user].supervisor,
      contactNo:userData[user].contactNo,
      indexID:userData[user].indexID
    });

    newUser[user].save()
    .then((doc)=>{
      results.push(doc);
      if(results.length == userData.length){
        res.json(results);
      }
    },(e)=>{
      results.push(e);
      if(results.length == userData.length){
        res.json(results);
      }
    });
  }
});

//get all User
app.get('/user',(req,res)=>{
  User.find().then((users)=>{
    res.json(users);
  },(e)=>{
      res.status(400).json(e);
  });
});

//get User by ObjectID
app.get('/user/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('invalid id');
  }

  User.findById(id).then((user)=>{
    if(!user){
      return res.status(404).send('no record');
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
      console.log('no update');
      return res.status(404).send('no update');
    }
    res.json(updatedUser);
  }).catch((e)=>{
    return res.status(400).json(e);
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
        return res.status(404).send('no update');
      }
      finalUpdated.push(updatedUser);
      if(finalUpdated.length == users.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).json(e);
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
      res.status(400).json(e);
  });
});

//get department by ObjectID
app.get('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('invalid ID');
  }

  Department.findById(id).then((department)=>{
    if(!department){
      return res.status(404).send('no record');
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
      new Department({
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
    res.status(400).json(e);
  });
});

//update department by id
app.patch('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('invalid ID');
  }

  var body = _.pick(req.body,[
    'name',
    'head',
    'status',
    'lastModified'
  ]);

  Department.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedDepartment) => {
    if(!updatedDepartment){
      return res.status(404).send('update error');
    }
    res.json(updatedDepartment);
  }).catch((e)=>{
    res.status(400).json(e);
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
        return res.status(404).send('invalid department');
      }
      finalUpdated.push(updatedDepartment);
      if(finalUpdated.length == departments.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).json(e);
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

//get leave by ObjectID
app.get('/leave/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID invalid');
  }

  Leave.findById(id).then((leave)=>{
    if(!leave){
      return res.status(404).send('no record');
    }
    res.json(leave);
  },(e)=>{
      res.status(400).send(e);
  });
});

//create leave
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
    return res.status(404).send('invalid leave');
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
      return res.status(404).send('invalid update');
    }
    res.json(updatedLeave);
  }).catch((e)=>{
    res.status(400).json(e);
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
        return res.status(404).send('invalid leave');
      }
      finalUpdated.push(updatedLeave);
      if(finalUpdated.length == leaves.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).json(e);
    });
  }, (e) => {
      console.log('error leave \n');
      console.log(e);
  });
});


/***********************************************permission************************************************/
//create permission
app.post('/permission', (req, res) => {
  var permissionData = req.body;
  var newPermission =[];
  var results = [];

  for(var permission in permissionData){
     newPermission[permission] = new Permission({
      permissionList:permissionData[permission].permissionList,
      code:permissionData[permission].code,
      description:permissionData[permission].description,
      createdAt:permissionData[permission].createdAt,
      lastModified:permissionData[permission].lastModified,
      status:permissionData[permission].status,
      indexID:permissionData[permission].indexID
    });

    newPermission[permission].save()
    .then((doc)=>{
      results.push(doc);
      if(results.length == permissionData.length){
        res.json(results);
      }
    },(e)=>{
      results.push(e);
      if(results.length == permissionData.length){
        res.json(results);
      }
    });
  }
});

//get all permission
app.get('/permission',(req,res)=>{
  Permission.find().then((permissions)=>{
    res.json(permissions);
  },(e)=>{
      res.status(400).json(e);
  });
});

//get permission by ObjectID
app.get('/permission/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('invalid id');
  }

  Permission.findById(id).then((permission)=>{
    if(!permission){
      return res.status(404).send('no record');
    }

    res.send(JSON.stringify(permission));
  },(e)=>{
      res.status(400).send(e);
  });
});

//update permission by id
app.patch('/permission/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid permission');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    'permissionList',
    'code',
    'description',
    'lastModified',
    'status'
  ]);

  Permission.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedPermission) => {
    if(!updatedPermission){
      console.log('no update');
      return res.status(404).send('no update');
    }
    res.json(updatedPermission);
  }).catch((e)=>{
    return res.status(400).json(e);
  });
});


//bulk update permission
app.patch('/permission',(req,res)=>{
  var permissions = req.body;
  var finalUpdated = [];

  async.each(permissions, (permission) => {
    var body = _.pick(permission,[
      'permissionList',
      'code',
      'description',
      'lastModified',
      'status'
    ]);

    Permission.findByIdAndUpdate(permission._id,{$set:body},{new:true}).then((updatedPermission) => {
      if(!updatedPermission){
        return res.status(404).send('no update');
      }
      finalUpdated.push(updatedPermission);
      if(finalUpdated.length == permission.length){
        res.json(finalUpdated);
      }
    }).catch((e)=>{
      res.status(400).json(e);
    });
  }, (e) => {
      console.log('error permissions \n');
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
