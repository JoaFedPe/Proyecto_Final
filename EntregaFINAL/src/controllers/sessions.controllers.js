//import { logUserService, sessionServices} from "../dao/mongo/services/sessions.services.js"
//import sessionServices from "../dao/mongo/services/sessions.services.js"
import sessionServices from "../dao/mongo/services/sessions.services.js"

const logUser = async (req, res) => {

    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" })
    try {
        req.session.user = sessionServices.logUserService(req.user) 
        
            
        res.redirect('/products');
    
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
}

const passForgotten = async (req, res) => {
    const {email} = req.body

    let forgotPass = await sessionServices.passForgotten({email})

    res.json(forgotPass)

}

export {passForgotten, logUser}
//export {logUser}