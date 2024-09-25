import {Router} from 'express'
import {isAuthenticated, isNotAuthenticated, isAdmin} from '../../middleware/auth.js'
import {getUsers, getUserById} from '../../controllers/sessions.controllers.js'

const router = Router()

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', {user: req.session.user})
})

router.get('/current', isAuthenticated, (req, res) => {
    res.render('current', {user: req.session.user})
})

router.get('/passforgotten', (req, res) => {
    res.render('passForgotten')
})

router.get('/reset-password/:token', (req, res) => {
    res.render('reset-password')
})

router.get ('/',isAdmin, getUsers)

router.get('/users/premium/:uid', getUserById)

export default router