const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true 
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    isEditor:{
        type:Boolean
    },
    password:{
        type:String
    }})

module.exports = User = mongoose.model('User', UserSchema)