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
    
    updateCartRepository = async (cid, product) => {
        const result = await this.dao.updateCart(cid, product);
        return result;
    }

    deleteOneCartRepository = async (cid) => {
        const result = await this.dao.deleteCart(cid);
        return result;
    }
}