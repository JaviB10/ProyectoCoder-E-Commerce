import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({

    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

})

ticketSchema.pre("findOne", function(){
    this.populate('users')
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)