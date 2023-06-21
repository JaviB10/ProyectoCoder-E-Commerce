import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({

    first_name: String,
    last_name: String,
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