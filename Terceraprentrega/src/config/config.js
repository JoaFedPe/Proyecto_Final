import dotenv from 'dotenv'
import path from 'path'
import __dirname from '../utils.js'

dotenv.config({path:path.resolve(__dirname,"../../.env")}) 
const config = {MONGO_URL : process.env.MONGO_URL, PORT : process.env.PORT}

export default config