import productRepository from '../repositories/product.repository.js'

const getProducts = async (params) => {
    const {page=1, limit=10,category,sort, title} = params
    let filters = {}
    let sortFilter = {}    
    
    
    if(category) filters.category= category
    if(title) filters.title= title
    if(sort) sortFilter.price = sort
    let result = await productRepository.getProducts ({filters,limit,page,sort:sortFilter})
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}` : ''
    result.isValid = !(page <= 0 || page > result.totalPages)
    
    return result
}

const getProductsById = async (params) => {
    const {pid} = params
    let result = await productRepository.getProductsById({pid})
    
    return result   
      
}

const createProduct = async (params, res) => {
    
    let {title, description, code, price, status, stock, category, owner} = params 
          
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return ({ status: "error", error: "Faltan caracteristicas del producto"})        
    }
    let existeProducto = await productRepository.productFound({ code })
    if(existeProducto) {
        return ({ status: "error", error: "El producto que quieres agregar ya existe"})}
        else {
            
            let product = await productRepository.createProduct({title, description, code, price, status, stock, category, owner})
            return ({status: "success", payload: product})
    }         
}


const modifyProduct = async (pid, params) => {

    let {title, description, code, price, status, stock, category} = params
    
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return ({ status: "error", error: "Faltan caracteristicas del producto que quieres modificar"})
               
    }
    let modifyedProduct = await productRepository.modifyProduct(pid, params)
    return ({result: "success", payload: modifyedProduct})
    
}

const deleteProduct = async (params, userEmail) => {
    const pid = params
    const product = await productRepository.getProductsById({pid})

    if(userEmail === product.owner || userEmail === "adminCoder@coder.com"){
                        
        let result = await productRepository.deleteProduct(pid)
        
        return result

    } else { return ({message: "No tienes permisos para borrar este producto"})}      
      
}
    



export default {getProducts, getProductsById, createProduct, modifyProduct, deleteProduct}
