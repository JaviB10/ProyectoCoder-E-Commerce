import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsRepository from "../repositories/tickets.repository.js";
import { CantAddProduct, CartNotFound } from "../utils/custom-exceptions.js";

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketsRepository = new TicketsRepository();

const getCartByIdService = async (cid) => {
    const cart = await cartsRepository.getCartByIdRepository(cid);
    if (!cart) {
        throw new CartNotFound('Cart not found')
    }
    return cart;
}

const saveCartService = async (cart) => {
    const result = await cartsRepository.saveCartRepository(cart);
    return result;
}

const addProductToCartService = async (cid, pid, productFound, user) => {
    if (productFound.owner === user.email && user.role === "PREMIUM") {
        throw new CantAddProduct('The user cant be add product')
    }
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

const purchaseCartService = async (user, cart) => {
    const productsCart = cart.products;
    const productsConStock = [];
    const productsSinStock = [];

    for (let item of productsCart) {

        if (item.quantity <= item.product.stock) {
            productsConStock.push(item);
            console.log(productsConStock);
            const product = item.product
            product.stock -= item.quantity
            await productsRepository.updateProductRepository(product._id, product);
        } else {
            productsSinStock.push(item);
        }
    }

    const sum = productsConStock.reduce((acc, producto) => {
        acc += producto.product.price;
        console.log(acc);
        return acc;
    }, 0);

    const orderNumber = Date.now() + Math.floor(Math.random() * 100000 + 1);
    
    const ticket = {
        code: orderNumber,
        amount: sum,
        purchaser: user.email,
    };

    //actualizo el cart
    const produ = {products: productsSinStock};
    await cartsRepository.updateCartRepository(cart._id, produ);

    
    if (productsConStock.length === 0) {
        throw { message: "No hay stock" };
    } else {
        const result = await ticketsRepository.saveTicketRepository(ticket);
        return ({ticket: result , productOut: productsSinStock});
    }
    
}

export {
    getCartByIdService,
    saveCartService,
    addProductToCartService,
    updateCartService,
    updateQuantityService,
    deleteProductService,
    deleteAllProductService,
    purchaseCartService
}