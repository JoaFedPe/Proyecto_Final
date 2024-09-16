import dotenv from 'dotenv'
import path from 'path'
import __dirname from '../utils.js'

dotenv.config({path:path.resolve(__dirname,"../../.env")}) 
const config = {MONGO_URL : process.env.MONGO_URL, PORT : process.env.PORT, EMAIL_USER_NODEMAILER : process.env.EMAIL_USER_NODEMAILER, EMAIL_PASS_NODEMAILER : process.env.EMAIL_PASS_NODEMAILER, JWT_SECRETKEY : process.env.JWT_SECRETKEY}

export default config