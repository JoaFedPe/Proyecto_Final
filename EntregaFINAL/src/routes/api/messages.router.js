import express from 'express'
import {isUserOrPremium} from '../../middleware/auth.js'

const router = express.Router()

router.get('/chatEcommerce', isUserOrPremium, (req, res) => {
    res.render('chat', {})
})

export default router