const { string } = require('i/lib/util')
const mongoose = require('mongoose')

const LibarySchema = new mongoose.Schema({
    Profile: {
        name:{type:String},
        bookShared:{type:Number}
    },


    booksReceivedArray:[
        {
            bookName:{type:String,
                required:true},
           
            isEditor: {type:Boolean,
            required:true,
            default:false},
            From: {type:Object,
            required:true},
            bookContent: {
                type:Object,
                required:true
            },
        },
    ],
    sharedWriters:[
        {
            name:{type:String,  
            required:true},
            writerid:{type:String,
            required:true}
        }
    ],
    sharedBooks:[

        //books shared with other writers
        {
            name:{type:String,
            required:true},
            bookid:{type:String,
                required:true},
            writers:[{
                name:{type:String,
                required:true},
                writerid:{type:String,
                required:true},
                isEditor:{type:Boolean,
                required:true,
            default:false}
            }],
            bookContent:{type:Object,
            required:true
            }

        },
    ],
    userid: {
        type:String,
        required:true
    }
})

module.exports = Libary = mongoose.model('Libary', LibarySchema)