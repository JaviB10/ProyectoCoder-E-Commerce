import CartsRepository from "../repositories/carts.repository.js";

const cartsRepository = new CartsRepository();

const newCartService = async () => {
    return await CARTSDAO.newCart();
}

const getCartsService = async () => {
    const carts = await cartsRepository.getCartsRepository();
    return carts;
}

const getCartByIdService = async (cid) => {
    const cart = await cartsRepository.getCartByIdRepository(cid);
    return cart;
}

const saveCartService = async (cart) => {
    const result = await cartsRepository.saveCartRepository(cart);
    return result;
}

const addProductToCartService = async (cid, pid) => {
    const result = await cartsRepository.addProductToCartRepository(cid, pid);
    return result;
}

const updateCartService = async (cid, product) => {
    const result = await cartsRepository.updateCartRepository(cid, product);
    return result;
}

const updateQuantityService = async (cid, pid, cantidad) => {
    const result = await cartsRepository.updateQuantityRepository(cid, pid, cantidad);
    return result;
}

const deleteProductService = async (cid, pid) => {
    const result = await cartsRepository.deleteProductRepository(cid, pid);
    return result;
}

const deleteAllProductService = async (cid) => {
    const result = await cartsRepository.deleteAllProductRepository(cid);
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