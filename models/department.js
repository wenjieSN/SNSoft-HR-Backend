var mongoose = require('mongoose');

var Department = mongoose.model('Department',{
  name:{
    type:String,
    require:true,
    minlength : 1
  },
  head:{
    type:String,
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


module.exports ={
  Department
}
