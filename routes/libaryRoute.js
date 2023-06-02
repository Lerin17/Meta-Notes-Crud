const express = require('express')

const router = express.Router()
const Libary = require('../models/Libary')
const User = require('../models/User')

//add book to shared books
router.post('/addBook/:userid', async (req, res) => {


//     const writersForBook = req.body.writers

//    const writersArray = []

try {
    const UserLibary = await Libary.find({'userid': req.params.userid})

    // console.log(UserLibary,' uss')
    // console.log(UserLibary.sharedBooks,' userlIbary')

    const idsOfUserSharedBooks = UserLibary[0].sharedBooks.map(item => (item.bookid))

console.log(idsOfUserSharedBooks, 'ids')

console.log(req.body.bookData, 'bookData')

    const isBookIdAlreadyPresent = idsOfUserSharedBooks.includes(req.body.bookid)

    if(isBookIdAlreadyPresent){
        res.status(500).json({message: 'Book already available in sharedBooks'})
        return
    }else{
        const updatedUserLibary = await Libary.findOneAndUpdate({'userid':req.params.userid}, {$push: {sharedBooks:{
            name:req.body.name,
            bookid:req.body.bookid,
            writers:[],
            bookData:req.body.bookData
        }}},{new:true})

        res.status(200).json(updatedUserLibary)
        return
    }
} catch (error) {
 res.status(500)   
}

   

  
       
        
 

        // function getWriters(params) {
        //     return new Promise(function (resolve, reject){

        //         // console.log('running')

        //         writersForBook.map(async(item) => {

                    

        //             const writerData = await User.findById(item.writerid)
    
        //             console.log(writerData,'writerData')
    
    
        //              writersArray.push({
        //                      name:writerData.username,
        //                     writerid:writerData._id
        //             })

        //             if( writersArray.length == writersForBook.length){

        //                 resolve( writersArray)
        //             }
        
        //     })
        //     })
        // }

        // getWriters().then( async (data) => {
        //     console.log(data, 'data')

        //     try {
        //         const updatedUserLibary = await Libary.findOneAndUpdate({'userid':req.params.userid}, {$push: {sharedBooks:{
        //             name:req.body.name,
        //             bookid:req.body.bookid,
        //             writers:[...data],
        //             bookContent:req.body.bookContent
        //         }}},{new:true})

        //         res.status(200).json(updatedUserLibary)
                
        //     } catch (error) {
        //         res.status(500).json(error) 
        //     }
           

                            

        // }).catch((error) => {
        //     res.status(500).json(error)
        // })
        
})


router.get('/getUser/:userid', async (req, res) => {

    const userid = req.params.userid

    try {
        const userLibary = await Libary.find({'userid':userid})


        if(!userLibary.length){
            res.status(500).json({message: 'No userLibary'})
        }else{
            res.status(200).json(userLibary[0])
        }

    } catch (error) {
        res.status(500)
    }
})



router.delete('/removeBook/:userid/:bookid', async (req, res) => {
    const userid = req.params.userid
    const bookid = req.params.bookid

    try {
        const userLibary = await Libary.find({'userid': userid})

    if(!userLibary.length){
        res.status(500).json({message:"Libary not found"})
    }else{
        console.log('iknow')

        try {
            const alteredLibary = await Libary.findOneAndUpdate (
                {'userid':userid},
                {$pull: {'booksArray':{'_id': bookid}}},
                {new:true}
            )

            console.log('i know now')
    
            res.status(200).json(alteredLibary)
        } catch (error) {
            res.status(500).json(error)
        }
     
    }
        
    } catch (error) {
        res.status(500).json(error)
    }

    
})

router.post('/saveLibaryArray/:userid', async (req, res) => {

    const userid = req.params.userid
    

    try {
        const updatedUserLibary = await Libary.findOneAndUpdate ({'userid': userid}, 
        {$set: {myLibaryBooksArray: req.body.LibaryArrayData
        }},{new:true})

        res.status(200).json(updatedUserLibary)
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json(error)
    }
})


router.get('/getbook', async (req, res) => {
    try {
        res.status(200).json('hign')
    } catch (error) {
        res.status(500).json(error)
    }
    
})


module.exports = router

