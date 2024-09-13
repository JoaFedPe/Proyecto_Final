import nodemailer from 'nodemailer'
import config from '../config/config.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL_USER_NODEMAILER,
        pass: config.EMAIL_PASS_NODEMAILER,
    },
})


export default transport