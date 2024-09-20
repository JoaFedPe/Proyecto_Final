import userModel from '../models/user.model.js'

const resetPass = async (user, hashedPassword) => {
    return await userModel.updateOne(
    { _id: user }, 
    { $set: { password: hashedPassword } } 
    )
          
}

export default {resetPass}