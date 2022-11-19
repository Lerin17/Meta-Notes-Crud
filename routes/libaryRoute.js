const express = require('express')

const router = express.Router()
const Libary = require('../models/Libary')

router.post('/addBook/:userid', async (req, res) =>{
    const book = req.body.bookData
    const name = req.body.name
    const userid = req.params.userid


    !(book && name) && res.status(500).json({message: 'missing Inputs'}) 

    console.log('himbo')

    try {
        const userLibary = await Libary.find({'userid': userid})
        console.log(userLibary)
    
        if(!userLibary.length){
            // console.log('himbo sxe')
            const newLibary = new Libary({
                booksArray: [book],
                userid: userid,
                name:name
            })


        
            try {
                const savedLibary = await newLibary.save()
                
    
                res.status(200).json(savedLibary)
            } catch (error) {
                res.status(500).json(error) 
            }
        }else{
            try {
                const updatedLibary = await Libary.findOneAndUpdate(
                    {'userid':userid},
                    {$push: {booksArray: {...book}}},
                    {new: true}
                ) 

                res.status(200).json(updatedLibary)
            } catch (error) {
                res.status(500).json(error)
            }
        
    
    
        }
    } catch (error) {
        res.status(200).json(error)
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


router.get('/getbook', async (req, res) => {
    try {
        res.status(200).json('hign')
    } catch (error) {
        res.status(500).json(error)
    }
    
})


module.exports = router

