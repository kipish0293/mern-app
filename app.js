const express = require('express')
const app = express()

const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const http = require('http')
const Message = require('./models/Message')
const ACTIONS = require('./client/src/socket/actions')
const server = http.createServer(app)
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
const {version, validate} = require('uuid')

// app.use(
//     cors({
//         credentials: true,
//         origin: ["http://localhost:3000"],
//         optionsSuccessStatus: 200
//     })
// )

app.use(express.json({ extended : true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use('/api/messager', require('./routes/auth.routes'))


function getClientRooms() {
    const {rooms} = io.sockets.adapter;
  
    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
}

function shareRoomsInfo() {
    io.emit(ACTIONS.SHARE_ROOMS, {
      rooms: getClientRooms()
    })
}
  

io.on('connection', socket => {
    console.log('connected11111111')
    // socket.on('userJoined', async ({userName})=> {
    //     io.emit('userJoinToChat', {name : "system-bot",message : `${userName} присоединился к беседе`, date : new Date()})
    // })
    // socket.on('message', async ({name, message, date})=> {
    //     const mess = new Message({name: name, message : message, date : new Date()})
    //     const dateToIo = `${mess.date}`
    //     mess.save().then(()=> {
    //         io.emit('message', {name, message, dateToIo})
    //     })
    // })
    // socket.on('disconnect', ()=> {
    //     console.log(`Отключение ${socket.id}`)
    // })

    //-----------------------video socket------------------
    socket.on(ACTIONS.JOIN, config => {
        const {room: roomID} = config;
        const {rooms: joinedRooms} = socket;
    
        if (Array.from(joinedRooms).includes(roomID)) {
          return console.warn(`Already joined to ${roomID}`);
        }
    
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
    
        clients.forEach(clientID => {
          io.to(clientID).emit(ACTIONS.ADD_PEER, {
            peerID: socket.id,
            createOffer: false
          });
    
          socket.emit(ACTIONS.ADD_PEER, {
            peerID: clientID,
            createOffer: true,
          });
        });
    
        socket.join(roomID);
        shareRoomsInfo();
    });
    
    function leaveRoom() {
        const {rooms} = socket;
    
        Array.from(rooms)
          // LEAVE ONLY CLIENT CREATED ROOM
          .filter(roomID => validate(roomID) && version(roomID) === 4)
          .forEach(roomID => {
    
            const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
    
            clients
              .forEach(clientID => {
              io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                peerID: socket.id,
              });
    
              socket.emit(ACTIONS.REMOVE_PEER, {
                peerID: clientID,
              });
            });
    
            socket.leave(roomID);
          });
    
        shareRoomsInfo();
    }
    
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
})


if(process.env.NODE_ENV === 'production') {
    
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

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



// const path = require('path');
// const express = require('express');
// const config = require('config')
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const {version, validate} = require('uuid');

// const ACTIONS = require('./client/src/socket/actions');
// const PORT = config.get('port') || 5000

// function getClientRooms() {
//   const {rooms} = io.sockets.adapter;

//   return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
// }

// function shareRoomsInfo() {
//   io.emit(ACTIONS.SHARE_ROOMS, {
//     rooms: getClientRooms()
//   })
// }

// io.on('connection', socket => {
//     console.log('connect -123')
//   shareRoomsInfo();

//   socket.on(ACTIONS.JOIN, config => {
//     const {room: roomID} = config;
//     const {rooms: joinedRooms} = socket;

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

// });

// const publicPath = path.join(__dirname, 'build');

// app.use(express.static(publicPath));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

// server.listen(PORT, () => {
//   console.log('Server Started!')
// })