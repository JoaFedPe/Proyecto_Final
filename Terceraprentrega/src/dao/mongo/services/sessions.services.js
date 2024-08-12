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

export { logUserService }