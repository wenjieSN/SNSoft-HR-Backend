var mongoose = require('mongoose');

var User = mongoose.model('User',{
  email:{
    type:String,
    require:true,
    minlength : 1,
    trim : true
  },
  password:{
    type:String,
    select:false
  },
  name:{
    type:String,
    require:true
  },
  userGroup:{
    type:Number,
  },
  department:{
    type:String,
  },
  position:{
    type:String,
  },
  supervisor:{
    type:String,
  },
  createdAt:{
    type:Date,
    default:Date.now,
    require:true
  },
  lastModified:{
    type:Date,
    default:Date.now,
    require:true
  },
  contactNo:{
    type:String
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
  User
}
