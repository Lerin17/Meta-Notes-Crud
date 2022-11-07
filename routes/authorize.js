const router = require('express').Router()
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')

//create new User
router.post('/createuser', async (req, res) => {
    console.log(req.body,'body')
    const newUser = new User({
        username:req.body.username,
        email: req.body.email,
        isEditor: req.body.Adminrole,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    })

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
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
       })
    } catch (error) {
        
    }
})

module.exports = router