import io from 'socket.io-client'

const options = {
    "force new connection" : true,
    reconnetionAttempts : "Infinity",
    timeout : 10000,
    transports : ["websocket"]
}

// const socket = io.connect('http://localhost:3000', options)
const socket = io.connect('http://our-family-gallery.ru', options)



export default socket;