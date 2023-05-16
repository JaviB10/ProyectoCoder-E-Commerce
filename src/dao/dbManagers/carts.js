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
        const result = await cartModel.find({_id: id}).lean();
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

    delete = async (id) => {
        const result = await cartModel.deleteOne(id);
        return result;
    }
}