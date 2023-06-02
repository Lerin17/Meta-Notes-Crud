const { array } = require('i/lib/util')
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
    },
    password:{
        type:String,
        required:true,
    },
    requestmessages: {
        type:Array,
        default:[]
    }
}
    )

module.exports = User = mongoose.model('User', UserSchema)