var mongoose = require('mongoose');
const Schema = mongoose.Schema;


var permissionSchema = new Schema({
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
  status:{
    type:Number,
    default:1
  },
  indexID:{
    type:String
  }
});

var Permission = mongoose.model('Permission', permissionSchema);

module.exports ={
  Permission
}
