import dotenv from 'dotenv'
import path from 'path'
import __dirname from '../utils.js'

dotenv.config({path:path.resolve(__dirname,"../../.env")}) 
const config = {MONGO_URL : process.env.MONGO_URL, PORT : process.env.PORT, EMAIL_USER_NODEMAILER : process.env.EMAIL_USER_NODEMAILER, EMAIL_PASS_NODEMAILER : process.env.EMAIL_PASS_NODEMAILER, JWT_SECRETKEY : process.env.JWT_SECRETKEY, GIT_HUB_CLIENT_ID : process.env.GIT_HUB_CLIENT_ID, GIT_HUB_CLIENT_SECRET: process.env.GIT_HUB_CLIENT_SECRET, GIT_HUB_CALLBACK_URL : process.env.GIT_HUB_CALLBACK_URL}

export default config