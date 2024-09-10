import express from 'express'
import {isUser} from '../../middleware/auth.js'

const router = express.Router()

router.get('/chatEcommerce', isUser, (req, res) => {
    res.render('chat', {})
})

export default router