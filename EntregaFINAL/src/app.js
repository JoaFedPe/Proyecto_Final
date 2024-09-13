import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import productsRouter from './routes/api/products.routes.js'
import cartsRouter from './routes/api/carts.routes.js'
import sessionsRouter from './routes/api/sessions.js'
import viewsRouter from './routes/api/views.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import config from './config/config.js'
import messageModel from './dao/mongo/models/messages.model.js'
import messagesRouter from './routes/api/messages.router.js'
import { Server } from 'socket.io'

const app = express()
const httpServer = app.listen(config.PORT, console.log(`Server running on port ${config.PORT}`))
const socketServer = new Server(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(session({
    secret:'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config.MONGO_URL}),
    
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

mongoose.connect(config.MONGO_URL).then(()=> 
{console.log("Conectado a la base de datos")}).catch(error => console.error("Error en la conexion", error))

app.use('/', productsRouter)
app.use('/', cartsRouter)
app.use('/', viewsRouter)
app.use('/', messagesRouter)
app.use('/api/sessions', sessionsRouter)

let messages = []

socketServer.on('connection', socket => {
    socket.emit("messageList", messages)
    console.log("Nuevo cliente conectado")

    socket.on("newMessage", async (message) => {
        messages.push(message)
        const newMessage = new messageModel({
            user: "Joaquin",
            message
        })
        await newMessage.save()
        socketServer.emit("newMessage", {
            socketId: socket.id,
            message: message
        })
    }) 
})

