const router = require('express').Router()
const User = require('../models/User')
const Libary = require('../models/Libary')


//add writer to team

router.post('/addTeam/:email/:userid', async (req, res) => {

    const teamMemberEmail = req.params.email

    !teamMemberEmail && res.status(500).json({message:'Provide Team member Email'})

    try {
        const teamMemberToAdd = await User.find({'email': req.params.email})

        const userLibary = await Libary.find({'userid': req.params.userid})
        const user = await User.find({'_id': req.params.userid})

        // !user && res.status(500).json({message:''})

       !teamMemberToAdd.length && res.status(500).json({message:'This email is not connected to any MetaNotes User'})

        if(!userLibary.length){

            //Adding a new writer, without prior libary
            const newUserLibary =  new Libary({
                Profile:{name:user[0].username,
                bookShared:0},
                booksReceivedArray:[],
                sharedWriters:[{
                    name:teamMemberToAdd[0].username,
                    writerid:teamMemberToAdd[0]._id
                }],
                sharedBooks:[],
                userid:user[0]._id,         
            })


            try {
            const savedsUserLibary = await newUserLibary.save()            
            
            res.status(200).json(savedsUserLibary)
            
            } catch (error) {
                res.status(500).json(error)
            }
            // console.log('cow')
        }else{

                //Adding a new writer, with prior libary

            try {
                const alteredUserLibary = await Libary.findOneAndUpdate({'userid': user[0]._id, },{
                    $push: {sharedWriters: {
                        name:teamMemberToAdd[0].username,
                        writerid:teamMemberToAdd[0]._id
                    }}
                    },
                    {new:true})

                console.log('runner')

                res.status(200).json(alteredUserLibary)
                
            } catch (error) {
                res.status(500).json(error)
            }
      

            
            
        //   const isNewBook =  userLibary.filter(item => item.bookid = req.body.bookId)

        //   if(!isNewBook.length){
        //     const alteredUserLibary = await Libary.findOneAndUpdate({'userid': user._id},{
        //         $push: {sharedBooks: {
        //             name:req.body.bookName,
        //             writers:[{
        //                 name: teamMemberToAdd[0].username,
        //                 writerid: teamMemberToAdd[0]._id,
        //                 isEditor:false
        //             }],
        //             bookContent:req.body.bookContent
        //         }}
        //         },
        //         {new:true})
        //   }else{

        //     const alteredUserLibary = await Libary.findOneAndUpdate({'userid': user._id, 
        //     'sharedBooks.bookis':bookId
        // },{
        //         $push: {writers: {
        //             name:teamMemberToAdd[0].username,
        //             writerid: teamMemberToAdd[0]._id,
        //             isEditor:false
        //         }}
        //         },
        //         {new:true})
        //   }
            // userLibary.sharedBooks.bookid.includes(req.body.bookId)

            // const updateduserfavourite = await UsersFavourites.findOneAndUpdate(
            //     {'userID':userid},
            //     {$push: {products:  {productID: getProduct._id ,
            //                         productDetails: getProduct}}},
            //     { new: true }
            // )
      
     

        }


    } catch (error) {
        //why?
        res.status(500).json(error)
    }

})


//remove writer from team

router.delete('/teams/removeTeam/:writerid/:userid', async(req, res) => {

    try {
        const userLibary = await Libary.find({'userid': req.params.userid })

        !userLibary.length && res.status(500).json({message:'userLibary does not exist'})

        if(userLibary.length){
            const updatedUserLibary = await Libary.findOneAndUpdate({'userid': req.params.userid})

        }
    } catch (error) {
        
    }
})


router.post('/addBook/:userid', async (req, res) => {

    // const userLibary = await Libary.find({'userid': req.params.userid})

    const user = await User.find({'_id': req.params.userid})


        const writersForBook = req.body.writers

       const writersArray = []



            function getWriters(params) {
                return new Promise(function (resolve, reject){

                    console.log('running')

                    writersForBook.map(async(item) => {

                        

                        const writerData = await User.findById(item.writerid)
        
                        console.log(writerData,'writerData')
        
        
                         writersArray.push({
                                 name:writerData.username,
                                writerid:writerData._id
                        })

                        if(jam.length == writersForBook.length){

                            resolve(jam)
                        }
            
                })
                })
            }

            getWriters().then( async (data) => {
                console.log(data, 'data')

                try {
                    const updatedUserLibary = await Libary.findOneAndUpdate({'userid':user[0]._id}, {$push: {sharedBooks:{
                        name:req.body.name,
                        bookid:req.body.bookid,
                        writers:[...data],
                        bookContent:req.body.bookContent
                    }}},{new:true})

                    res.status(200).json(updatedUserLibary)
                    
                } catch (error) {
                    res.status(500).json(error) 
                }
               

                                
    
            }).catch((error) => {
                res.status(500).json(error)
            })
            
})

//remove writer from Books

router.delete('delete/:userid/:writer', async(req, res) => {

})


module.exports = router