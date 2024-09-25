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

const getUsers = async (req, res) => {

    let users = await sessionServices.getUsers()

    res.render('getUsers', {users})
}

const deleteUser = async (req, res) => { 
    let uid = req.body 

    try {
        let userToDelete = await sessionServices.deleteUser(uid)
        res.json({result: 'success', userToDelete})
    } catch (error) {
        res.status(500).json({result: 'error', message: 'Error al eliminar usuario'})
    }   
    
}

const deleteInactiveUser = async (req, res) => {
    let now = new Date()
    let thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 días 
    //let thresholdDate = new Date(now.getTime() - 2 * 60 * 1000) // 2 minutos  
    
    try {
        const result = await sessionServices.deleteInactiveUser(thresholdDate);
        res.json({ success: true, message: "Inactive users deleted successfully.", result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error deleting inactive users.", error });
    }
}

const passForgotten = async (req, res) => {
    const {email} = req.body

    let forgotPass = await sessionServices.passForgotten({email})

    res.json(forgotPass)

}

const resetPass = async (req, res) => {    
    const { token } = req.params
    const { password } = req.body
    
    let passReset = await sessionServices.resetPass({token, password})
    
    res.json(passReset)
}

const getUserById = async (req, res) => {
    const {uid}  = req.params
    
    let userById = await sessionServices.getUserById({uid})
    
    res.render('changeRole', {user: userById})
}

const changeRole = async (req, res) => {
    let {uid} = req.params
    
    let changeUserRole = await sessionServices.changeRole({uid})

    res.json(changeUserRole)
}


export {passForgotten, logUser, resetPass, changeRole, getUserById, getUsers, deleteUser, deleteInactiveUser}
