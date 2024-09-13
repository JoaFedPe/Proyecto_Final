import userModel from '../models/user.model.js'

const userFound = async ({ email }) => {
    return  userModel.findOne({email})
}    

export default {userFound} 