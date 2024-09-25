import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: {
        type:[
            {
                
                type: mongoose.Schema.Types.ObjectId,
                ref:"Carts"
                
            }
        ]
    },
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
    rol: String,
    last_connection: {type: Date}
});

userSchema.pre('findOne', function(){
    this.populate('cart')
})

const firstCollection = mongoose.model(userCollection, userSchema);

export default firstCollection