import { CARTSDAO } from "../dao/factory.js";

export default class CartsRepository {
    constructor() {
        this.dao = CARTSDAO;
    }

    getCartsRepository = async () => {
        const carts = await this.dao.getAll();
        return carts;
    }

    getCartByIdRepository = async (cid) => {
        const cart = await this.dao.getCartById(cid);
        return cart;
    }

    saveCartRepository = async (cart) => {
        const result = await this.dao.save(cart);
        return result;
    }

    addProductToCartRepository = async (cid, pid) => {
        const result = await this.dao.addProductToCart(cid, pid);
        return result;
    }
    
    updateCartRepository = async (cid, product) => {
        const result = await this.dao.updateCart(cid, product);
        return result;
    }
    
    updateQuantityRepository = async (cid, pid, cantidad) => {
        const result = await this.dao.updateQuantityToCart(cid, pid, cantidad);
        return result;
    }
    
    deleteProductRepository = async (cid, pid) => {
        const result = await this.dao.deleteProductToCart(cid, pid);
        return result;
    }
    
    deleteAllProductRepository = async (cid) => {
        const result = await this.dao.deleteAllProductToCart(cid);
        return result;
    }
}