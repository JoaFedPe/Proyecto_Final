import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import firstCollection from '../dao/mongo/models/user.model.js'
import Cart from '../dao/mongo/models/carts.model.js'
import { createHash, isValidPassword } from "../utils.js";


const LocalStrategy = local.Strategy

const initializePassport = () => {
    
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                let user = await firstCollection.findOne({ email: username })
                if (user) {
                    console.log("El usuario ya existe")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                }

                const newCart = new Cart()
                await newCart.save()
                newUser.cart = newCart._id    

                if (newUser.email === 'adminCoder@coder.com') {
                    newUser.rol = 'admin';
                } else {
                    newUser.rol = 'user';
                }
                    
                let result = await firstCollection.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await firstCollection.findById(id)
        
        done(null, user)
    })


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await firstCollection.findOne({ email: username })
            if (!user) {
                console.log("El usuario no existe")
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liLv7VXbYKqgPl8C",
        clientSecret: "64e2ec65522a5cd4cde4a4bb6d32e668281dfb13",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            
            let user = await firstCollection.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 28,
                    email: profile._json.email,
                    password: "",
                }
                
                if (profile._json.email === 'adminCoder@coder.com') {
                    newUser.rol = 'admin';
                } else {
                    newUser.rol = 'user';
                }
                
                

                let result = await firstCollection.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await firstCollection.findById(id)
        done(null, user)
    })

}


export default initializePassport