const mongoose=require('mongoose');
const Item=require('./itemModel')

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    item:{type:mongoose.Schema.Types.ObjectId,ref:'item'},
    userarr:[String],
    
    countitem:{type:Number,default:0},
    countbag:{type:Number,default:0},
})
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchema);


module.exports=User;
