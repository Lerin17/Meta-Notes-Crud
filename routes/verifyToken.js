// const router = require('express').Router()

const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if(authHeader){
        const token = authHeader
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err){
                res.status(403).json('toke is not valid  not expexted')
                req.user = user
            }

            next()
        })
    }else{
        return res.status(401).json('you are not authenticated')
    }
}


const verifyTokenandEditor = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.isEditor){
            next()
        }else{
            res.status(403).json({message:'You do not have clearance for this operation'})
        }
    })
}

module.exports = {verifyTokenandEditor}