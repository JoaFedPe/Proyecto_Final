import { Router } from 'express'
import {getCarts, getCartById, addCart, modifyCart, deleteCart, deleteProductsInCart, deleteONEproduct, getPurchase} from '../../controllers/carts.controller.js'
import {isUserOrPremium} from '../../middleware/auth.js'

const router = Router()

router.get('/carts', getCarts)

router.get('/carts/:cid', getCartById)

router.post('/carts', addCart)

router.put('/carts/:cid/product/:pid', isUserOrPremium, modifyCart) 

router.delete('/deletecart/:cid', deleteCart)

router.delete('/carts/:cid', deleteProductsInCart) 

router.delete('/carts/:cid/product/:pid', deleteONEproduct)

router.get('/:cid/purchase', getPurchase)

router.post('/:cid/purchase', getPurchase)



export default router