const express = require('express');
const bodyParser = require('body-parser'); //json -> object
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const mongoose = require('./server/dbConnect');
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




//bulk update user
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
    res.send(JSON.stringify(updatedUser));
  }).catch((e)=>{
    res.status(400).send();
  })
});


// //post department
// app.post('/department', (req, res,next) => {
//   var department = new Department({
//     name:req.body.name,
//     head:req.body.head
//   });
//
//   user.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });
//
// //get department
// app.get('/department',(req,res,next)=>{
//   User.find().then((departments)=>{
//     res.send({
//       departments
//     });
//   },(e)=>{
//       res.status(400).send(e);
//   });
// });

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


// own edit


app.post('/department', (req, res,next) => {

  var datas = req.body;
  console.log(datas);
  var depts = [];
  datas.forEach(function(data){
    var dept = new Department({
      name:data.name,
      head:data.head,
      indexID:data.indexID
    });

    depts.push(dept);
  })

  Department.create(depts).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//bulk update user
app.patch('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid user');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    'name',
    'head',
    'lastModified',
    'status'
  ]);

  Department.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedUser) => {
    if(!updatedUser){
      return res.status(404).send();
    }
    res.send(JSON.stringify(updatedUser));
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.get('/department/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Department.findById(id).then((user)=>{
    if(!user){
      return res.status(404).send();
    }
    res.json({user});
  },(e)=>{
      res.status(400).send(e);
  });
});

app.post('/department/:id',(req,res)=>{
  var id = req.params.id;

  var data = req.body;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Department.update({ _id: id }, { status:0  }, function (err, raw) {
    if (err) return handleError(err);
    console.log('The raw response from Mongo was ', raw);
    res.status(201).json(raw)
  });
   // var dept = Department.findById(id).then(function(deptData){
   //   console.log(deptData);
   //   deptData.save(req.body.data,function(err, result){
   //    console.log(err)
   //        res.status(201).json(result);

   //   });
   // })

})

//get department
app.get('/department',(req,res,next)=>{
  Department.find().then((departments)=>{
    res.json(departments);

  },(e)=>{
      res.status(400).send(e);
  });
});



////////
// leave
////////
app.post('/leave', (req, res,next) => {

  var datas = req.body;
  console.log(datas);
  var leaves = [];
  datas.forEach(function(data){
    var leave = new Leave({

        user:data.user,
        type:data.type,
        from:data.from,
        to:data.to,
        description:data.description,
        approveStatus:'Pending', //data.approveStatus,
        approveBy:data.approveBy,
        createdAt:data.createAt,
        lastModified:data.lastModified,
        status:1,//data.status,
        indexID:data.indexID
    });

    leaves.push(leave);
  })
// user
// leaveType
// fromDate
// toDate
// description

// approvalBy
// department
// indexID
// status

  Leave.create(leaves).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/leave/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Leave.findById(id).then((leave)=>{
    if(!leave){
      return res.status(404).send();
    }
    res.json({leave});
  },(e)=>{
      res.status(400).send(e);
  });
});

app.post('/leave/:id',(req,res)=>{
  var id = req.params.id;

  var data = req.body;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Leave.update({ _id: id }, { status:0  }, function (err, raw) {
    if (err) return handleError(err);
    console.log('The raw response from Mongo was ', raw);
    res.status(201).json(raw)
  });
   // var dept = Department.findById(id).then(function(deptData){
   //   console.log(deptData);
   //   deptData.save(req.body.data,function(err, result){
   //    console.log(err)
   //        res.status(201).json(result);

   //   });
   // })

})

//get department
app.get('/leave',(req,res,next)=>{
  Leave.find().then((leaves)=>{
    res.json(leaves);

  },(e)=>{
      res.status(400).send(e);
  });
});



/////////////
// Permission
/////////////


app.post('/permission', (req, res,next) => {

  var datas = req.body;
  console.log(datas);
  var pms = [];
  datas.forEach(function(data){
    var pm = new Permission({
      permissionList:data.permissionList,
      code:data.code,
      description:data.description,
      lastModified:data.lastModified,
      indexID:data.indexID
    });

    pms.push(pm);
  })

  Permission.create(pms).then((doc) => {
    res.status(201).json(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//bulk update user
app.patch('/permission/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('invalid user');
    return res.status(404).send();
  }

  var body = _.pick(req.body,[
    'permissionList',
    'code',
    'description',
    'lastModified',
    'status'
  ]);

  Permission.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatePM) => {
    if(!updatePM){
      return res.status(404).send();
    }
    res.send(JSON.stringify(updatePM));
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.get('/permission/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Permission.findById(id).then((pm)=>{
    if(!pm){
      return res.status(404).send();
    }
    res.json(pm);
  },(e)=>{
      res.status(400).send(e);
  });
});

app.post('/permission/:id',(req,res)=>{
  var id = req.params.id;

  var data = req.body;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Permission.update({ _id: id }, { status:0  }, function (err, raw) {
    if (err) return handleError(err);
    console.log('The raw response from Mongo was ', raw);
    res.status(201).json(raw)
  });
   // var dept = Department.findById(id).then(function(deptData){
   //   console.log(deptData);
   //   deptData.save(req.body.data,function(err, result){
   //    console.log(err)
   //        res.status(201).json(result);

   //   });
   // })

})



//get department
app.get('/permission',(req,res,next)=>{
  Permission.find().then((pms)=>{
    res.json(pms);

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
