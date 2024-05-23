import { Router } from 'express'
import mongoose from 'mongoose'
import productModel from '../models/products.model.js'



const router = Router()

router.get('/products', async (req,res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let filters = {}
    let sort = {}

    if(!limit) limit = 10
    if(!page) page = 1
    if(req.query.category) filters.category= req.query.category
    if(req.query.title) filters.title= req.query.title
    if(req.query.sort) sort.price = req.query.sort
    

    let result = await productModel.paginate(filters, {page, limit, sort, lean: true}, )
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}` : ''
    result.isValid = !(page <= 0 || page > result.totalPages)
    res.render('products',result)
})


router.get('/products/:pid', async (req, res) => {
    let { pid } = req.params
    try {
        let product = await productModel.findOne({_id:pid})
        res.send({result: "success", payload: product})
        
    } catch (error) {
        res.send ({ status: "error", error: "No existe producto con la ID ingresada"})
    }
})

router.post('/products', async (req, res) => {
    let {title, description, code, price, status, stock, category,} = req.body
    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.send ({ status: "error", error: "Faltan caracteristicas del producto"})        
    }
    let existeProducto = await productModel.findOne({ code })
    if(existeProducto) {
        res.send ({ status: "error", error: "El producto que quieres agregar ya existe"})}
        else {
            let product = await productModel.create({title, description, code, price, status, stock, category,})
            res.send ({result: "success", payload: product})
        }
    }
)

router.put('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body
    if (!productToReplace.title || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.status || !productToReplace.stock || !productToReplace.category) {
        res.send ({ status: "error", error: "Faltan caracteristicas del producto que quieres modificar"})        
    }
    let replacedProduct = await productModel.updateOne({_id:pid}, productToReplace)
    res.send ({result: "success", payload: replacedProduct})

})

router.delete('/products/:pid', async (req, res) => {
    let { pid } = req.params
    try {
        let product = await productModel.deleteOne({_id:pid})
        res.send({result: "success", payload: product})
        
    } catch (error) {
        res.send ({ status: "error", error: "No existe el producto que quieres eliminar"})
    }
})

export default router