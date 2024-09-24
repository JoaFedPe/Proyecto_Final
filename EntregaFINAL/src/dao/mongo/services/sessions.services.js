import firstCollection from '../models/user.model.js'
import transport from '../../../config/emailConfig.js'
import config from '../../../config/config.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userRepository from '../repositories/user.repository.js'


const JWT_SECRETKEY = process.env.JWT_SECRETKEY

const logUserService =  (user, res) => {
   
    try{
                
        if(!user) {
            return ({ status: "error 404", error: "Usuario no encontrado"})
        }

        return {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            rol: user.rol,
            cart: user.cart[0]._id,
        } 
        
           

    } catch(err){
        return ({ status: "error 500", error: "error al iniciar sesión"})
    }
}

const passForgotten = async (params) => {
    const {email} = params 
    
    try {
        const user = await firstCollection.findOne({email})
        
        if (!user){
            return ({message: "Usuario no encontrado"})
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRETKEY, { expiresIn: '1h' })
        const resetLink = `http://localhost:8080/reset-password/${token}`
       

        await transport.sendMail({
            from: config.EMAIL_USER_NODEMAILER,
            to: email,
            subject:"Resetear Contraseña",
            html:`<p>Haz click en el siguiente link para restablecer tu contraseña:</P><p><a href="${resetLink}">Reestablecer contraseña</a></p>`,
            
        })
        
        return ({message: "Correo Enviado"})

    } catch (error){
        return ({status: "error 500", error: "Error al enviar correo"})
    }
}

const resetPass = async (params) => {
    let {token, password} = params

    try {
        const decoded = jwt.verify(token, JWT_SECRETKEY)
        const user = await firstCollection.findById(decoded.userId)

        if (!user) {
            return res.status(404).send('Usuario no encontrado')
        }
        
        const isSamePassword = await bcrypt.compare(password, user.password)
        console.log(isSamePassword)
        
        if (isSamePassword) {
            return ({status: "error", error: "No puedes usar la misma contraseña"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        let passReseted = await userRepository.resetPass(user, hashedPassword)
        
        
        return ({message: "Contraseña reestablecida", payload: passReseted})
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ({message: "El enlace ha expirado. Solicita uno nuevo"})
        }

        console.error('Error al restablecer la contraseña:', error)
    }
}

const getUserById = async (params) => {
    const {uid} = params

    let result = await userRepository.getUserById({uid})
    
    return result 
}

const changeRole = async (params) => {
    let {uid} = params
    
    const user = await firstCollection.findById(uid)
    
    const newRole = user.rol === 'premium' ? 'user' : 'premium'
        
    let userToMod = await userRepository.changeRole(uid, newRole)

    return ({result: "success", payload: userToMod}) 
   
}

export default { logUserService, passForgotten, resetPass, changeRole, getUserById }
