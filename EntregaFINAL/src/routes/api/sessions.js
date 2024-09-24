import { Router } from "express"
import passport from 'passport'
import {logUser,getUsers} from '../../controllers/sessions.controllers.js'
import {isAdmin} from '../../middleware/auth.js'


const router = Router() 

router.get ('/getUsers',isAdmin, getUsers)

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.redirect('/login')
});
    
router.get('/failregister', async (req, res) => {
    
    res.send({ error: "Falló" })
})

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), logUser)


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
})

router.get('/faillogin', (req, res) => {
    res.send({ error: "Login fallido" })
})

router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})


router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/products")
})

export default router