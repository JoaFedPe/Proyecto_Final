import mongoose from 'mongoose'

const cartsCollection = "Carts"

const cartsSchema = new mongoose.Schema({
    productsInCart: {type: Array, required:true, max:10000},   
})

const cartModel = mongoose.model(cartsCollection, cartsSchema)

export default cartModel

/* const cartsCollection = "Carts"

const cartsSchema = new mongoose.Schema({
    productsInCart: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },

                quantity: {type: Number,}
            
            }
        ],
        default: []           
    }          
})

cartsSchema.pre('find', function(){
    this.populate('products.product')
})


const cartModel = mongoose.model(cartsCollection, cartsSchema)

export default cartModel */