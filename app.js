const express = require('express')
const app = express()

const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const http = require('http')
const Message = require('./models/Message')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

app.use(express.json({ extended : true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use('/api/messager', require('./routes/auth.routes'))

io.on('connection', (socket) => {
    socket.on('message', async ({name, message, date})=> {
        const mess = new Message({name: name, message : message, date : new Date()})
        const dateToIo = `${mess.date}`
        mess.save().then(()=> {
            io.emit('message', {name, message, dateToIo})
        })
    })
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