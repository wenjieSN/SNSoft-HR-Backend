var mongoose = require('mongoose');

var User = mongoose.model('User',{
  username:{
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
  contactNo:{
    type:String
  },
  userGroup:{
    type:String,
  },
  department:{
    type:String, //department ID
  },
  position:{
    type:String, // position ID
  },
  supervisor:{
    type:String, //user_ID
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
  User
}
