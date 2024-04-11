import express from 'express'
import jwt from 'jsonwebtoken'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

app.use(express.json())

app.get('/posts',getUser)
app.post('/login',authenticateUser)

const posts = [
    {
        username: 'abhi',
        email: 'abhi@gmail.com'
    },
    {
        username: 'praveen',
        email: 'praveen@gmail.com'
    }
    ]

function getUser (req, res) {
    req.user = posts
    res.json(posts.filter(posts=>posts.username===req.user.name))
}

function authenticateUser (req, res) {
    const userName = req.body.username
    const user = { name:userName }

    const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
}

function authenticateToken (req, res ,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null){
        return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}
const port = process.env.PORT || 3002
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
