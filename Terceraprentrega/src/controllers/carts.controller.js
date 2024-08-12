import cartsServices from "../dao/mongo/services/carts.services.js"

const getCarts = async (req, res) => {

    let carts = await cartsServices.getCarts()
    
    res.json(carts)
}

const getCartById = async (req, res) => {
    const cid  = req.params

    let cartsById = await cartsServices.getCartById(cid)
    
    res.render('carts', cartsById)
}

const addCart = async (req, res) => {
    let {productsInCart} = req.body
    
    const cartAdded = await cartsServices.addCart({productsInCart})

    res.json(cartAdded)
}


const modifyCart = async (req, res) => {
    let { cid,  pid } = req.params
    let { quantity } = req.body

    if(!quantity) quantity = 1

    let modifiedCart = await cartsServices.modifyCart({cid, pid,quantity})
    
    res.json(modifiedCart)
} 

const deleteCart = async (req, res) => {
    let cid = req.params

    let cartDeleted = await cartsServices.deleteCart(cid)
        
    res.json(cartDeleted)
}

const deleteProductsInCart = async (req, res) => {
    let { cid } = req.params

    let productsDeleted = await cartsServices.deleteProductsInCart(cid)

    res.json(productsDeleted)
}

const deleteONEproduct = async (req, res) => {
    let { cid,  pid } = req.params
    
    let productToDelete = await cartsServices.deleteONEproduct({cid, pid})

    res.json(productToDelete)
}

export {getCarts, getCartById, addCart, modifyCart, deleteCart, deleteProductsInCart, deleteONEproduct}