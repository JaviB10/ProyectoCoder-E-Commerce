import { cartModel } from "./models/carts.model.js";
import { logger } from "../../logger.js";

export default class Carts {
    constructor() {
        logger.info("Working carts with DB");
    }

    newCart = async () => {
        return await cartModel.create();
    }

    getAll = async () => {
        return await cartModel.find().lean();
    }

    getCartById = async (cid) => {
        return await cartModel.findOne({_id:cid}).lean();
    }

    save = async (cart) => {
        return await cartModel.create(cart);
    }

    addProductToCart = async (cid, pid) => { 
        const cartFound = await cartModel.findById(cid);
        const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === pid);
        if (productIndex !== -1) {
            cartFound.products[productIndex].quantity += 1;
        } else {
            cartFound.products.push({product: pid});
        }
        await cartFound.save();
        return cartFound;
    }

    updateCart = async (cid, product) =>{
        return await cartModel.updateOne({_id:cid}, product);
    }

    updateQuantityToCart = async (cid, pid, cantidad) =>{
        const cartFound = await cartModel.findById(cid);
        const productIndex = cartFound.products.findIndex((item) => item.product.toString() === pid);
        if (productIndex !== -1) {
            cartFound.products[productIndex].quantity = cantidad.quantity;
        } else {
            return false
        }
        return await cartFound.save();
    }

    deleteProductToCart = async (cid, pid) => {
        const cartFound = await cartModel.findById(cid);
        const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === pid);
        if (productIndex !== -1) {
            cartFound.products.splice(productIndex, 1);
        } else {
            return
        }
        return await cartFound.save();
    }

    deleteAllProductToCart= async (cid) => {
        const cartFound = await cartModel.findById(cid);
        cartFound.products = [];
        return await cartFound.save();
    }
}