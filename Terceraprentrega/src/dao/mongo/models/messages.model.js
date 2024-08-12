import mongoose from 'mongoose'

const messagesCollection = "Messages"

const messagesSchema = new mongoose.Schema({
    user: {type: String, required:true, max:1000},
    message: {type: String, required:true, max:1000}   
})



const messageModel = mongoose.model(messagesCollection, messagesSchema)

export default messageModel