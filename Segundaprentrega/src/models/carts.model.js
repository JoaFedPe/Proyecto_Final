import mongoose from 'mongoose'


const cartsCollection = "Carts"

const cartsSchema = new mongoose.Schema({
    productsInCart: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                },

                quantity: {type: Number,}
            
            }
        ],
        default: []           
    }          
})

cartsSchema.pre('findOne', function(){
    this.populate('productsInCart.product')
})


const cartModel = mongoose.model(cartsCollection, cartsSchema)

export default cartModel