console.log('Metanotes API')

require('dotenv').config()
require('express-async-errors')

const connectDB = require('./db/connect')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
// const io = require('socket.io')

const express = require('express')

const http = require('http')



const requestListiner = (req,res) => {
    res.writeHead(200)
    res.end('connected currently')

}


const authorizeRoute = require('./routes/authorize')
const libaryRoute =  require('./routes/libaryRoute')
const teamRoute = require('./routes/teamRoute')


const app = express()

const server = require('http').createServer(app)




// const userRoutes = require('./routes')

const cors = require('cors')
const bodyParser = require('body-parser')
const { emit } = require('process')
const { Socket } = require('socket.io')

const io = require('socket.io')(server, {
    cors: {
        origin:'*',
        methods: ['GET', 'POST']
    }
})

const port = process.env.PORT || 5024

app.get('/', function (req, res) {
    res.send('i am')
    });


    
app.use((req,res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,"
    );
    next();
})

    // app.use('/api/authorize', authorizeRoute)

app.use(cors())    
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))


// app.use((req,res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Content-Type,"
//     );
//     next();
// })
// app.use((cors()))

app.use('/api/authorize', authorizeRoute)
app.use('/api/libary', libaryRoute)
app.use('/api/teams', teamRoute)



io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    // setInterval(() => {
    //     socket.emit('me', socket.id)
    // }, 3000);



    socket.on('jam', data => {
        console.log(data, 'data')

        // socket.join('truth')
    })

    socket.on('metaarraydata', ([metadata, socketRooms, senderid]) => {
     
        const room = String(socketRooms)
        console.log(room, 'socketRooms')
        socket.to(room).emit('$metaarraydata', [metadata,senderid ])
    })

    socket.on('textprosedata',  ([operations, filteredRoomMemebers, senderid,  socketRooms]) => {

        // socket.broadcast.to('game').emit('message', 'nice game');

        console.log('...receiving data', operations)

        console.log(socketRooms, 'filtered')

        socket.to(socketRooms).emit('getprosedata', [operations, senderid])

        // filteredRoomMemebers.map(item => {
        //     io.to(item).emit('getprosedata', [operations, senderid])
        // })        
    })

    // setTimeout(() => {
    //     console.log(socket.rooms)
    // }, 15000);

    socket.on('joinroom', async (id) => {
        console.log(id, '...join room')

        const room = String(id)

        socket.join(room)

        console.log(socket.rooms)

       
        const x = await io.in(room).fetchSockets()

        console.log(x, 'rawdata on join')

        const idsOfRoomMembers = x.map(item => item.id)

      const roomsArray =  Array.from(socket.rooms)

      
        console.log()


        if(socket.rooms.has(String(id))){

            console.log('socket has id')

            console.log(idsOfRoomMembers, 'ids')

            // socket.to(room).emit('getprosedata', [operations, senderid, idsOfRoomMembers])
            socket.emit('roomsdata', [roomsArray, idsOfRoomMembers]) 
        }

    //   const xe =  JSON.stringify(rooms)

    //     socket.emit('roomsdata', xe)
    })

    // socket.on('sendroomsdata', () => {

    //     console.log(socket.rooms)
    //     socket.emit('roomsdata',socket.rooms)
    // })

})

server.listen(port, ()=>{
    console.log(`listening at ${port}`)
})






// const socket = io('http://localhost:5001')



//express middleware

app.use(express.json())

//access-control-allow origin
// app.use((req,res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Content-Type,"
//     );
//     next();
// })



app.use(notFoundMiddleware)
app.use(errorMiddleware) 

// const port = process.env.PORT || 5001


const start  = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        // app.listen(port, console.log(`server is listening on port ${port} `))
    } catch (error){
        console.log(error)
    }
}

// app.get('/', (req, res) => {
//     res.send(`<h1>damn we made it</h1>`)
// })


start()