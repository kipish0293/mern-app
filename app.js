const express = require('express')
const app = express()

const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
// const http = require('http')
const https = require('https')
const Message = require('./models/Message')
const ACTIONS = require('./client/src/socket/actions')
const fs = require('fs')
const server = require('http').createServer(app);

// const server = https.createServer(
//     {
//         key : fs.readFileSync('/cert/key.pem', 'utf-8'),
//         cert : fs.readFileSync('/cert/cert.pem', 'utf-8'),   
//     },
//     app
// )

const cors = require('cors');

const ioChat = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

// const io = require('socket.io')(server, {
//     cors: {
//       origin: '*',
//     }
// });

const {version, validate} = require('uuid')
// app.use(cors())

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
        optionsSuccessStatus: 200
    })
)

app.use(express.json({ extended : true }))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use('/api/messager', require('./routes/auth.routes'))
app.use('/api/images', require('./routes/upload.routes'))



ioChat.on('connection', socket => {
    console.log('connected to chat')
    socket.on('userJoined', async ({userName})=> {
        ioChat.emit('userJoinToChat', {name : "system-bot",message : `${userName} присоединился к беседе`, date : new Date()})
    })
    socket.on('message', async ({name, message, date})=> {
        const mess = new Message({name: name, message : message, date : new Date()})
        const dateToIo = `${mess.date}`
        mess.save().then(()=> {
            ioChat.emit('message', {name, message, dateToIo})
        })
    })
    socket.on('disconnect', ()=> {
        console.log(`Отключение ${socket.id}`)
    })
    // socket.on('disconnecting', leaveRoom);
}) 
  

// function getClientRooms() {
//     const {rooms} = io.sockets.adapter;
  
//     return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
// }

// function shareRoomsInfo() {
//     io.emit(ACTIONS.SHARE_ROOMS, {
//       rooms: getClientRooms()
//     })
// }


// io.on('connection', socket => {
//     console.log('connected11111111')

//     // -----------------------video socket------------------

//     shareRoomsInfo();

//   socket.on(ACTIONS.JOIN, config => {
//     const {room: roomID} = config;
//     const {rooms: joinedRooms} = socket;
//     console.log(room, rooms, 'join')

//     if (Array.from(joinedRooms).includes(roomID)) {
//       return console.warn(`Already joined to ${roomID}`);
//     }

//     const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

//     clients.forEach(clientID => {
//       io.to(clientID).emit(ACTIONS.ADD_PEER, {
//         peerID: socket.id,
//         createOffer: false
//       });

//       socket.emit(ACTIONS.ADD_PEER, {
//         peerID: clientID,
//         createOffer: true,
//       });
//     });

//     socket.join(roomID);
//     shareRoomsInfo();
//   });

//   function leaveRoom() {
//     const {rooms} = socket;
//     console.log(rooms, 'rooms')

//     Array.from(rooms)
//       // LEAVE ONLY CLIENT CREATED ROOM
//       .filter(roomID => validate(roomID) && version(roomID) === 4)
//       .forEach(roomID => {

//         const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

//         clients
//           .forEach(clientID => {
//           io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
//             peerID: socket.id,
//           });

//           socket.emit(ACTIONS.REMOVE_PEER, {
//             peerID: clientID,
//           });
//         });

//         socket.leave(roomID);
//       });

//     shareRoomsInfo();
//   }

//   socket.on(ACTIONS.LEAVE, leaveRoom);
//   socket.on('disconnecting', leaveRoom);

//   socket.on(ACTIONS.RELAY_SDP, ({peerID, sessionDescription}) => {
//     io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
//       peerID: socket.id,
//       sessionDescription,
//     });
//   });

//   socket.on(ACTIONS.RELAY_ICE, ({peerID, iceCandidate}) => {
//     io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
//       peerID: socket.id,
//       iceCandidate,
//     });
//   });
// })


if(process.env.NODE_ENV === 'production') {
    
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    // app.use('/', (req, res, next)=> {
    //     res.send('hello')
    // })


    app.get('*', (req,res)=> {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })  


}

const PORT = config.get('port') || 5000


async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useUnifiedTopology : true,
        })
        server.listen(PORT, ()=> console.log(`App has been started on port ${PORT}...`))
    } catch(e) {
        console.log("server error", e.message)
        process.exit(1)
    }
}

start()
