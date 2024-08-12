import { logUserService } from "../dao/mongo/services/sessions.services.js"

const logUser = async (req, res) => {

    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" })
    try {
        req.session.user = logUserService(req.user) 
        
            
        res.redirect('/products');
    
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
}

export {logUser}