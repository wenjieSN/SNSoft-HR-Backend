const mongoose = require('./../server/dbConnect').mongoose;
const Schema = mongoose.Schema;


var leaveSchema = new Schema({
  user:{
    type:String,
    require:true,
    minlength : 1
  },
  type:{
    type:String,
    minlength : 1,
    require:true
  },
  from:{
    type:Date,
    require:true
  },
  to:{
    type:Date,
    require:true
  },
  description:{
    type:String
  },
  approveStatus:{
    type:String,
    require:true
  },
  approveBy:{
    type:String// user_ID
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

var Leave = mongoose.model('Leave', leaveSchema);

module.exports ={
  Leave
}
