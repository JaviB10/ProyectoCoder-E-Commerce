import { cartModel } from "../models/carts.model.js";

export default class Carts {
    
    constructor() {
        console.log("Working carts with DB");
    }

    getAll = async () => {
        const carts = await cartModel.find().lean();
        return carts
    }
    
    getCartById = async (id) => {
        const result = await cartModel.find({_id: id});
        return result;
    }

    save = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    }

    addProductToCart = async (cartId, productId) =>{
        const cartFound = await cartModel.findById(cartId);
        const productIndex = cartFound.products.findIndex((item) => item.product.toString() === productId);

        if (productIndex !== -1) {
            cartFound.products[productIndex].quantity += 1;
        } else {
            cartFound.products.push({ product: productId, quantity: 1 });
        }

        await cartFound.save();
        return cartFound;
    }

    deleteProductToCart = async (cid, pid) => {
        const cart = await cartModel.findById(cid);
        const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
        } else {
            return false
        }

        await cart.save();
        return cart;
    }

    deleteAllProductToCart= async (cid) => {
        const cart = await cartModel.findById(cid);
        cart.products = [];

        await cart.save();
        return cart;
    }

    updateCart = async (id, product) =>{
        const result = await cartModel.updateOne({_id:id}, product);
        return result;
    }

    updateQuantityToCart = async (cid,pid,cantidad) =>{
        const cart = await cartModel.findById(cid);
        const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
        
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = cantidad.quantity;
        } else {
            return false
        }

        await cart.save();
        return cart;
    }
}