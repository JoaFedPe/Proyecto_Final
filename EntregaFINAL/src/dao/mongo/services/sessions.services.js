import firstCollection from '../models/user.model.js'
import transport from '../../../config/emailConfig.js'
import config from '../../../config/config.js'

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

        await transport.sendMail({
            from: config.EMAIL_USER_NODEMAILER,
            to: email,
            subject:"Resetear Contraseña",
            //html:`<p>Haz click en el siguiente link para restablecer tu contraseña:</P><p><a href="${resetLink}">Reestablecer contraseña</a></p>`,
            
        })
        
        return ({message: "Correo Enviado"})

    } catch (error){
        return ({status: "error 500", error: "Error al enviar correo"})
    }
}

export default { logUserService, passForgotten }
