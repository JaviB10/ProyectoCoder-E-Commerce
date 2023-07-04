import { CARTSDAO } from "../dao/index.js"

const newCartService = async () => {
    return await CARTSDAO.newCart();
}

const getCartsService = async () => {
    const carts = await CARTSDAO.getAll();
    return carts;
}

const getCartByIdService = async (cid) => {
    const cart = await CARTSDAO.getCartById(cid);
    return cart;
}

const saveCartService = async () => {
    const result = await CARTSDAO.save();
    return result;
}

const addProductToCartService = async (cid, pid) => {
    const result = await CARTSDAO.addProductToCart(cid, pid);
    return result;
}

const updateCartService = async (cid, product) => {
    const result = await CARTSDAO.updateCart(cid, product);
    return result;
}

const updateQuantityService = async (cid, pid, cantidad) => {
    const result = await CARTSDAO.updateQuantityToCart(cid, pid, cantidad);
    return result;
}

const deleteProductService = async (cid, pid) => {
    const result = await CARTSDAO.deleteProductToCart(cid, pid);
    return result;
}

const deleteAllProductService = async (cid) => {
    const result = await CARTSDAO.deleteAllProductToCart(cid);
    return result;
}

export {
    newCartService,
    getCartsService,
    getCartByIdService,
    saveCartService,
    addProductToCartService,
    updateCartService,
    updateQuantityService,
    deleteProductService,
    deleteAllProductService
}