import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        index: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    thumbnail: String,
    owner: {
        type: String,
        default: "ADMIN"
    }
    
})

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema)