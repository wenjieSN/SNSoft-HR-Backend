var mongoose = require('mongoose');

var Department = mongoose.model('Department',{
  name:{
    type:String,
    require:true,
    minlength : 1
  },
  head:{
    type:String, //user_ID
    minlength : 1
  },
  createdAt:{
    type:Date,
    default:Date.now,
    require:true
  },
  lastModified:{
    type:Date
  },
  status:{
    type:Number,
    default:1
  }

});



// //post department
// app.post('/department', (req, res) => {
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
// app.get('/department',(req,res)=>{
//   User.find().then((departments)=>{
//     res.send({
//       departments
//     });
//   },(e)=>{
//       res.status(400).send(e);
//   });
// });


module.exports ={
  Department
}
