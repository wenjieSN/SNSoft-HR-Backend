const mongoose = require('./../server/dbConnect').mongoose;
const Schema = mongoose.Schema;

var departmentSchema = new Schema({
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
  },
  indexID:{
    type:String
  }
}, {strict: false});

var Department = mongoose.model('Department', departmentSchema);

module.exports ={
  Department
}
