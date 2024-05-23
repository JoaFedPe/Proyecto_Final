import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "Products"

const productSchema = new mongoose.Schema({
    title: {type: String, required:true, max:100},
    description: {type: String, required:true, max:100},
    code: {type: String, required:true, max:100},
    price: {type: Number, required:true, max:100},
    status: {type: String, required:true, max:100},
    stock: {type: Number, required:true, max:100},
    category: {type: String, required:true, max:100}, 
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productCollection, productSchema)

export default productModel