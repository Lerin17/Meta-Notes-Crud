const router = require('express').Router()
const User = require('../models/User')
const Libary = require('../models/Libary')

const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const CryptoJS = require('crypto-js')

//create new User
router.post('/createuser', async (req, res) => {
    // console.log(req.body,'body')

//    Boolean(req.body.username && req.body.email && req.body.password) && res.status(500).json({message: 'Provide missing SignUp information'}) 

   if(!req.body.username || !req.body.email || !req.body.password){
    // console.log('jack')
    res.status(500).json({message: 'Provide missing SignUp information'}) 

   }else{

        
    const newUser = new User({
        username:req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    })

  

    try {
        const savedUser = await newUser.save()

        const newUserLibary = new Libary({
            Profile: {
                name:req.body.username,
                bookShared:0
            },
            booksReceivedArray: [],
            sharedWriters:[],
            sharedBooks:[],
            userid:savedUser._id
        })

        const savedsUserLibary = await newUserLibary.save()

        res.status(200).json({savedUser, savedsUserLibary})
        
    } catch (error) {
        console.log(error)
        // console.log(error)
        res.status(500).json({message: 'SignUp unsuccessful'})
    }
   }

})

//Login
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json({message: 'Wrong Credentials'})

        const encryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)

       const existingPassword = encryptedPassword.toString(CryptoJS.enc.Utf8)
       
       existingPassword !== req.body.password && res.status(500).json({message: 'Password not correct'})

       const accessToken =  jwt.sign({
            id:user._id,
            isEditor:user.isEditor
       }, process.env.JWT_SEC,
       {expiresIn: '3d'})

       const {password, ...others} = user._doc

       res.status(200).json({...others, accessToken})

    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/data', async (req, res) => {

        try {
            res.status(200).json('hhh')
        } catch (error) {
            res.status(500).json(error)
        }
})

module.exports = router