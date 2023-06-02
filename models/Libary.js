const { string } = require('i/lib/util')
const mongoose = require('mongoose')

const LibarySchema = new mongoose.Schema({
    Profile: {
        name:{type:String},
        bookShared:{type:Number}
    },
    myLibaryBooksArray:  {
        type:Object,
        required:true
    }
      ,
    
    booksReceivedArray:[
        {
            bookName:{type:String,
                required:true},
           
            isEditor: {type:Boolean,
            required:true,
            default:false},
            From: {type:Object,
            required:true},
            bookData: {
                type:Object,
                required:true
            },
            Accepted: {
                type:Boolean,
                required: true,
                default: false
            }
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
            bookData:{type:Object,
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