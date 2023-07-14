import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({

    name: String,
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        default: "USER"
    }

})

userSchema.pre("findOne", function(){
    this.populate('cart')
})

export const userModel = mongoose.model(userCollection, userSchema)