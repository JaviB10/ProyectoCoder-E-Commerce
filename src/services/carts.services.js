import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsRepository from "../repositories/tickets.repository.js";
import { CantAddProduct, CantDeleteAllProduct, CantPurchase, CartNotFound, OutStockProduct } from "../utils/custom-exceptions.js";
import PaymentsService from "./payments.services.js";

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketsRepository = new TicketsRepository();

const paymentService = new PaymentsService()

const getCartByIdService = async (cid) => {
    const cart = await cartsRepository.getCartByIdRepository(cid);

    // Filtrar los productos con item.product igual a null
    const productsToRemove = cart.products.filter((item) => item.product === null);
    // Verificar si hay productos para eliminar
    if (productsToRemove.length > 0) {
        // Remover los productos con item.product igual a null
        cart.products = cart.products.filter((item) => item.product !== null);

        // Actualizar el carrito en la base de datos
        await cartsRepository.updateCartRepository(cart._id, cart);
    }
    
    if (!cart) {
        throw new CartNotFound('Cart not found')
    }
    return cart;
}

const saveCartService = async (cart) => {
    const result = await cartsRepository.saveCartRepository(cart);
    return result;
}

const addProductToCartService = async (cartFound, productFound, pid, user) => {
    if (productFound.owner === user.email && user.role === "PREMIUM") {
        throw new CantAddProduct('The user cant be add product')
    }
    const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === pid);
    if (productIndex !== -1) {
        cartFound.products[productIndex].quantity += 1;
    } else {
        cartFound.products.push({product: pid});
    }
    const result = await cartsRepository.updateCartRepository(cartFound._id, cartFound);
    return result;
}

const updateCartService = async (cid, product) => {
    const result = await cartsRepository.updateCartRepository(cid, product);
    return result;
}

const updateQuantityService = async (cartFound, pid, quantity) => {
    const productIndex = cartFound.products.findIndex((item) => item.product.toString() === pid);
    if (productIndex !== -1) {
        cartFound.products[productIndex].quantity = quantity.quantity;
    } else {
        return false
    }
    const result = await cartsRepository.updateCartRepository(cartFound._id, cartFound);
    return result;
}

const deleteProductService = async (cartFound, pid) => {
    const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === pid);
    if (productIndex !== -1) {
        cartFound.products.splice(productIndex, 1);
    } else {
        return
    }
    const result = await cartsRepository.updateCartRepository(cartFound._id, cartFound);
    return result;
}

const deleteAllProductService = async (cartFound) => {
    if (cartFound.products.length === 0) {
        throw new CantDeleteAllProduct('The cart has no products')
    } else {
        cartFound.products = [];
    }
    const result = await cartsRepository.updateCartRepository(cartFound._id, cartFound);
    return result;
}

const purchaseCartService = async (user, cart) => {
    if (cart.products.length === 0) {
        throw new CantPurchase('The cart has no products')
    }
    const productsCart = cart.products;
    const productsConStock = [];
    const productsSinStock = [];

    for (let item of productsCart) {

        if (item.quantity <= item.product.stock) {
            productsConStock.push(item);
            const product = item.product
            product.stock -= item.quantity
            await productsRepository.updateProductRepository(product._id, product);
        } else {
            productsSinStock.push(item);
        }
    }

    const sum = productsConStock.reduce((acc, producto) => {
        acc += producto.product.price;
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
        throw new OutStockProduct('the product is out of stock at the moment')
    } else {
        await ticketsRepository.saveTicketRepository(ticket);
        const result = await paymentService.paymentsProductsService(ticket)
        return ({ticket: ticket , productOut: productsSinStock, products: productsConStock, payments: result});
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