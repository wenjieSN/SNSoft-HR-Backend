const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://52.221.222.65:27017/hrdb',(err,db) => {
mongoose.connect('mongodb://localhost:27017/hrdb',(err,db) => {
  if(err){
    return console.log('unable to connect to db');
  }
  console.log('connected db');
});

module.exports ={
  mongoose
}
