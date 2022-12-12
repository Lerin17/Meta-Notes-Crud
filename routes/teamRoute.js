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
                userid:req.params.userid,         
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
                const alteredUserLibary = await Libary.findOneAndUpdate({'userid': req.params.userid, },{
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


//remove writer from teams

router.delete('/removeTeam/:writerid/:userid', async(req, res) => {

    try {
        const userLibary = await Libary.find({'userid': req.params.userid })

        !userLibary.length && res.status(500).json({message:'userLibary does not exist'})

 

        if(userLibary.length){
            try {
                const updatedUserLibary = await Libary.findOneAndUpdate({'userid': req.params.userid}, {$pull:{'sharedWriters':{'writerid':req.params.writerid}}}, {new:true})

                res.status(200).json(updatedUserLibary)

            } catch (error) {
                res.status(500).json(error)
            }
      
        }
    } catch (error) {
        res.status(500).json(error)
    }
})




//add writers to Books
//Incoming

router.put('/addWritersToBook/:bookid/:userid/', async (req, res) => {

    const userLibary = await Libary.find({'userid': req.params.userid})

    const user = await User.find({'_id': req.params.userid})



        const writersForBook = req.body.writers

       const writersArray = []



            function getWriters() {
                return new Promise(function (resolve, reject){

                    writersForBook.map(async(item) => {

                        const writerData = await User.findById(item.writerid)

                        console.log('cowwer')
                        
       
                         writersArray.push({
                                 name:writerData.username,
                                writerid:writerData._id
                        })

                        // console.log(writersArray, 'writersArray')

                        if( writersArray.length == writersForBook.length){

                            resolve( writersArray)
                        }
            
                })
                })
            }

            getWriters().then( async (data) => {

                console.log(data,'data')
    
                try {
                    // console.log('eseses')
                    const userLibary = await Libary.find({'userid': req.params.userid})
                    

                    const prevContent = userLibary[0].sharedBooks.find(item => item.bookid == req.params.bookid)

                    console.log(prevContent,'prevContent')
                    

                    // const updatedUserLibary = await Libary.findOneAndUpdate({'userid':req.params.userid}, {$set:  {'sharedBooks.$[ele]': {
                    //     ...prevContent,
                    //     writers:[...prevContent.writers, ...data]
                    //         }
                        
                    // }},{ arrayFilters: [ { "ele.bookid": req.params.bookid } ] },{new:true})


                    const updatedUserLibary = await  Libary.findOneAndUpdate(
                        { 'userid':req.params.userid, 'sharedBooks.bookid':req.params.bookid },
                        { $set: { 'sharedBooks.$.writers': [...prevContent.writers, ...data]  } },{
                            new:true
                        }
                     )

                    
                    // const updatedUserLibary = await Libary.findOneAndUpdate({'userid':req.params.userid, 'sharedBooks':req.params.bookid}, {$set:  {'sharedBooks.$[ele]': {
                    //     ...prevContent,
                    //     writers:[...prevContent.writers, ...data]
                    //         }
                        
                    // }},{new:true})

            


                    res.status(200).json(updatedUserLibary)
                    
                } catch (error) {
                    res.status(500).json(error) 
                }
               

                                
    
            }).catch((error) => {
                res.status(500).json(error)
            })
            
})

//remove writer from Books

router.delete('/removeWritersfromBook/:bookid/:writerid/:userid/', async(req, res) => {
    // const userLibary = await Libary.find({'userid': req.params.userid})

    const user = await User.find({'_id': req.params.userid})

    try {
     const updatedUserLibary =  await Libary.findOneAndUpdate({'userid':req.params.userid, 'sharedBooks.bookid':req.params.bookid},{
        $pull:{'sharedBooks.$.writers':{'writerid':req.params.writerid}}
     },{new:true})

     res.status(200).json(updatedUserLibary)
    } catch (error) {
        res.status(500).json(error) 
    }



    //     const writersForBook = req.body.writers

    //    const writersArray = []


    //         function removeWriters() {
    //             return new Promise(function (resolve, reject){

    //                 writersForBook.map(async(item) => {

    //                     const writerData = await User.findById(item.writerid)

    //                      writersArray.push({
    //                              name:writerData.username,
    //                             writerid:writerData._id
    //                     })

    //                     // console.log(writersArray, 'writersArray')

    //                     if( writersArray.length == writersForBook.length){

    //                         resolve( writersArray)
    //                     }
            
    //             })
    //             })
    //         }

            
    //         removeWriters().then( async (data) => {

    //             try {
    //                 // console.log('eseses')
    //                 const userLibary = await Libary.find({'userid': req.params.userid})
                    

    //                 const prevContent = userLibary[0].sharedBooks.find(item => item.bookid == req.params.bookid)

    //                 // console.log(prevContent,'prevContent')


    //                 const updatedUserLibary = await  Libary.findOneAndUpdate(
    //                     { 'userid':req.params.userid, 'sharedBooks.bookid':req.params.bookid },
    //                     { $set: { 'sharedBooks.$.writers': [...prevContent.writers, ...data]  } },{
    //                         new:true
    //                     }
    //                  )

    //                 res.status(200).json(updatedUserLibary)
                    
    //             } catch (error) {
    //                 res.status(500).json(error) 
    //             }
               

                                
    
    //         }).catch((error) => {
    //             res.status(500).json(error)
    //         })
})


module.exports = router