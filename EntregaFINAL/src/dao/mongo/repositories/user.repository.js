import userModel from '../models/user.model.js'

const resetPass = async (user, hashedPassword) => {
    return await userModel.updateOne(
    { _id: user }, 
    { $set: { password: hashedPassword } } 
    )
          
}

const getUserById = async ({uid}) => {
    
    return await userModel.findOne({_id:uid}).lean()
} 

const changeRole = async (uid, newRole) => {

    return await userModel.updateOne (
        {_id: uid},
        {rol: newRole}
    )
}

export default {resetPass, changeRole, getUserById}