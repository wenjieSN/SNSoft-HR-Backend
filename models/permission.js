var mongoose = require('mongoose');

var Permission = mongoose.model('Permission',{
  permissionList:{
    type:Array 
  },
  code:{
    type:String
  },
  description:{
    type:String
  },
  createdAt:{
    type:Date,
    default:Date.now,
    require:true
  },
  lastModified:{
    type:Date
  },
  indexID:{
    type:String
  },
  status:{
    type:Number,
    default:1
  }

});


module.exports ={
  Permission
}
