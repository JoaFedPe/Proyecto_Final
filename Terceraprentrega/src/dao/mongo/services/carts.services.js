import cartRepository from '../repositories/cart.repository.js'
import productRepository from '../repositories/product.repository.js'

const getCarts = async () => {
    try {
        let carts = await cartRepository.getCarts()
        return ({result: "success", payload: carts})
                
    } catch (error) {
        console.log(error)
    }
}

const getCartById = async (params) => {
    const cid = params
    
    try {
        let cart = await cartRepository.getCartById(cid)
        
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

export default {getCarts, getCartById, addCart, modifyCart, deleteCart, deleteProductsInCart, deleteONEproduct}

