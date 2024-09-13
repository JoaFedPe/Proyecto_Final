import cartRepository from '../repositories/cart.repository.js'
import productRepository from '../repositories/product.repository.js'
import { v4 as uuidv4 } from 'uuid'
import Ticket from '../models/ticket.model.js'
import ticketRepository from '../repositories/ticket.repository.js'



const getCarts = async () => {
    try {
        let carts = await cartRepository.getCarts()
        return ({result: "success", payload: carts})
                
    } catch (error) {
        console.log(error)
    }
}

const getCartById = async (params) => {
    const {cid} = params
    
    try {
        let cart = await cartRepository.getCartById({cid})
        
        return ('carts', {cart: cart.toObject()})        
               
    } catch (error) {
        return ({ status: "error", error: "No existe el carrito con la ID ingresada"})
    }
}

const addCart = async (params) => {
    let productsInCart = params

    if (productsInCart) {
        let cart = await cartRepository.addCart({productsInCart})
        return ({result: "success", payload: cart})
                
    }else{
        return ({ status: "error", error: "Error al crear el Carrito"})
    }
}


const modifyCart = async (params) => {
    let {cid, pid, quantity} = params
    
    const productToAdd = await productRepository.getProductsById({pid})    
    
    if (!productToAdd) {
        return ({ status: "error", error: "Producto no encontrado" })
    }

    const updatedCart = await cartRepository.getCartById({cid})
    
       
    const productAllReadyInCart = updatedCart.productsInCart.some(product => product.product.equals(productToAdd._id))

       
    if (productAllReadyInCart) {       
        await cartRepository.modifyProdQuanInCart({cid, pid, quantity})         
        
    } else {        
        await cartRepository.modifyCart({cid,pid,quantity})
    }    

    return ({result: "success", payload: updatedCart})
} 

const deleteCart = async (params) => {
    let cid = params
    
    try {
        let cart = await cartRepository.deleteCart(cid)
        return ({result: "success", payload: cart})
                
    } catch (error) {
        return ({ status: "error", error: "No existe el carrito que quieres eliminar"})
    }    
}

const deleteProductsInCart = async (params) => {
    let cid = params

    try {
        let cart = await cartRepository.deleteProductsInCart({cid})
             
        return ({result: "success", payload: cart})

    } catch (error) {
        return ({ status: "error", error: "No existe el carrito al cual le quieres eliminar los productos"})
    }
}

const deleteONEproduct = async (params) => {
    let {cid, pid} = params
    
    const productToDel = await productRepository.getProductsById({pid})
    
    if (!productToDel) {
        return ({ status: "error", error: "Producto no encontrado" })
    }

    const updatedCart = await cartRepository.deleteONEproduct({cid,pid})
    

    return ({result: "success", payload: updatedCart}) 
}

const getPurchase = async (params) => {
    
    let {cid, user} = params
    
    
    const cart = await cartRepository.getCartById({cid})
    
    if (!cart) {
        return ({ status: "error", error: "Carrito no encontrado" })
    }

    let unavailableProducts = []
    
    let totalAmount = 0
    let purchasedProducts = []
    

    for (let item of cart.productsInCart) {
        const product = await productRepository.getProductsById({pid: item.product._id});
        let productId = product.id
        
        const quantityInCart = item.quantity;
        
        
        if (quantityInCart > item.product.stock) {
            unavailableProducts.push({productId: product._id})
            
        } else {
            item.product.stock -= item.quantity
            await productRepository.modifyStock(productId, item.product.stock)
            totalAmount += product.price * item.quantity
            purchasedProducts.push({ product: product, quantity: item.quantity })                  
            
        }
    } 

    if (purchasedProducts.length > 0) {        

        const ticket = new Ticket({
            code: uuidv4(),
            amount: totalAmount,
            purchaser: user.email,
            products: purchasedProducts.map(p => ({ product: p.product.id, quantity: p.quantity }))
        })
                
        await ticketRepository.createTicket(ticket)

        cart.productsInCart = cart.productsInCart.filter(item => unavailableProducts.includes(item.product._id))

        await cartRepository.deleteProductsInCart({cid})

        user.purchases.push(ticket._id)
        await user.save()   
        
        return ({ status: "succes", succes: `Productos de carrito comprados exitosamente`, payload: ticket.toObject(), unavailableProducts})
        
    } else {
        return { ticket: null, payload: unavailableProducts }
    }

}


export default {getCarts, getCartById, addCart, modifyCart, deleteCart, deleteProductsInCart, deleteONEproduct, getPurchase}

