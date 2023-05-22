import { productModel } from "../models/products.model.js";

export default class Products {
    
    constructor() {
        console.log("Working products with DB");
    }

    getAll = async () => {
        const result = await productModel.find().lean();
        return result
    }

    getProductById = async (id) => {
        const result = await productModel.find({_id: id}).lean();
        return result;
    }

    save = async (product) => {
        const result = await productModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productModel.updateOne({_id: id}, product);
        return result;
    }

    delete = async (id) => {
        const result = await productModel.deleteOne(id);
        return result;
    }
}