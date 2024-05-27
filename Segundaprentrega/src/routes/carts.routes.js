import { Router } from 'express'
import cartModel from '../models/carts.model.js'
import productModel from '../models/products.model.js'

const router = Router()

router.get('/carts', async (req, res) => {
    try {
        let carts = await cartModel.find()
        res.send({result: "success", payload: carts})
        
    } catch (error) {
        console.log(error)
    }
})


router.get('/carts/:cid', async (req, res) => {
    let { cid } = req.params
    try {
        let cart = await cartModel.findOne({_id:cid})
        
        res.render('carts', {cart: cart.toObject()})
        
    } catch (error) {
        res.send ({ status: "error", error: "No existe el carrito con la ID ingresada"})
    }
})

router.post('/carts', async (req, res) => {
    let {productsInCart} = req.body
    if (productsInCart) {
        let cart = await cartModel.create({productsInCart})
        res.send ({result: "success", payload: cart})
                
    }else{
        res.send ({ status: "error", error: "Error al crear el Carrito"})
        }
    }
)

router.put('/carts/:cid/product/:pid', async (req, res) => {
    let { cid,  pid } = req.params
    let { quantity } = req.body
    if(!quantity) quantity = 1
    const productToAdd = await productModel.findOne({_id:pid})

    if (!productToAdd) {
        res.send({ status: "error", error: "Producto no encontrado" })
    }

    const updatedCart = await cartModel.findOne({ _id: cid })
    
    const productAllReadyInCart = updatedCart.productsInCart.some(product => product.product.equals(productToAdd._id))
     
    if (productAllReadyInCart) {       
        await cartModel.updateOne(
            {_id: cid, "productsInCart.product": productToAdd._id},
            {$inc: { "productsInCart.$.quantity": quantity}}
        )
    } else {        
        await cartModel.updateOne(
            {_id: cid},
            {$push: { productsInCart: { product: productToAdd._id, quantity: quantity}}}
        )
    }

    res.send({result: "success", payload: updatedCart})  

})


router.delete('/deletecart/:cid', async (req, res) => {
    let { cid } = req.params
    try {
        let cart = await cartModel.deleteOne({_id:cid})
        res.send({result: "success", payload: cart})
        
    } catch (error) {
        res.send ({ status: "error", error: "No existe el carrito que quieres eliminar"})
    }
}) 

router.delete('/carts/:cid', async (req, res) => {
    let { cid } = req.params
    try {
        let cart = await cartModel.findOneAndUpdate(
            {_id:cid},
            { $set: {productsInCart: []}}
        )        

        res.send({result: "success", payload: cart})
        
    } catch (error) {
        res.send ({ status: "error", error: "No existe el carrito al cual le quieres eliminar los productos"})
    }
})

router.delete('/carts/:cid/product/:pid', async (req, res) => {
    let { cid,  pid } = req.params
    const productToDel = await productModel.findOne({_id:pid})

    if (!productToDel) {
        res.send({ status: "error", error: "Producto no encontrado" })
    }

    const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { productsInCart: { product: productToDel._id }}},
        { new: true }
    )

    res.send({result: "success", payload: updatedCart})  

})

export default router