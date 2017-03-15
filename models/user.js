const mongoose = require('./../server/dbConnect').mongoose;
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
  username:{
    type:String,
    require:true,
    minlength : 1,
    trim : true,
    unique: true
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
  },
  indexID:{
    type:String
  }
});

userSchema.plugin(uniqueValidator);

var User = mongoose.model('User', userSchema);

module.exports ={
  User
}
