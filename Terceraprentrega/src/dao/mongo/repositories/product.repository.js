import productModel from '../models/products.model.js'


const getProducts = async ({filters, page, limit, sort}) => 
    productModel.paginate(filters, {page, limit, sort, lean: true}, )      

const getProductsById = async ({pid}) => {
    
    return await productModel.findOne({_id:pid})
}   

const createProduct = async ({title, description, code, price, status, stock, category}) => {
        
    return await productModel.create({title, description, code, price, status, stock, category})
}

const productFound = async ({ code }) => {
     return  productModel.findOne({code})
}

const modifyProduct = async (pid, productToModify) => {
    return productModel.updateOne({_id:pid}, productToModify)
}

const modifyStock = async (productId, stockToModify) => {
    return productModel.updateOne({_id:productId}, {stock:stockToModify})
}

const deleteProduct = async ({pid}) => {
    
    return await productModel.deleteOne({_id:pid})
}     


export default {getProducts, getProductsById, createProduct, productFound, modifyProduct, deleteProduct, modifyStock}