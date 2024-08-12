import cartModel from '../models/carts.model.js'
import productToDel from '../services/carts.services.js'

const getCarts = async () => {
   return await cartModel.find()
}

const getCartById = async ({cid}) => {
   return await cartModel.findOne({_id:cid})
}

const addCart = async ({productsInCart}) => {
   return await cartModel.create({productsInCart})
}


const modifyProdQuanInCart = async ({cid,pid,quantity}) => {
   return await cartModel.updateOne(
      {_id: cid, "productsInCart.product": pid},
      {$inc: { "productsInCart.$.quantity": quantity}}
   )
}


const modifyCart = async ({cid, pid,quantity}) => {
   return await cartModel.updateOne(
   {_id: cid},
   {$push: { productsInCart: { product: pid, quantity: quantity}}}
)} 

const deleteCart = async ({cid}) => {
   return await cartModel.deleteOne({_id:cid})
}

const deleteProductsInCart = async ({cid}) => {
   return await cartModel.findOneAndUpdate(
      {_id:cid},
      { $set: {productsInCart: []}}
   )
}

//ver por qué no lo borra
const deleteONEproduct = async ({cid,pid}) => {
     
   return await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { productsInCart: { product: pid}}},
      { new: true },
   )
}

export default {getCarts, getCartById, addCart, modifyProdQuanInCart, modifyCart, deleteCart, deleteProductsInCart, deleteONEproduct}