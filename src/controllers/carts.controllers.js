import {
    getCartsService,
    getCartByIdService,
    saveCartService,
    addProductToCartService,
    updateCartService,
    updateQuantityService,
    deleteProductService,
    deleteAllProductService,
    purchaseCartService
} from "../services/carts.services.js"
import { getProductByIdService } from "../services/products.services.js";

const getCarts = async (req, res) => {
    try {
        const carts = await getCartsService();
        res.sendSuccess(carts);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartFound = await getCartByIdService(cid);
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        res.render("cart", cartFound)
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const saveCart = async (req, res) => {
    try {
        const result = await saveCartService();
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const productFound = await getProductByIdService(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        const cartFound = await getCartByIdService(cid)
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        const result = await addProductToCartService(cid, pid);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const updateCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const { product } = req.body;
        const cartFound = await getCartByIdService(cid)
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        const result = await updateCartService(cid, product);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const updateQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cantidad = req.body;
        const productFound = await getProductByIdService(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        const cartFound = await getCartByIdService(cid)
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        const result = await updateQuantityService(cid, pid, cantidad);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const productFound = await getProductByIdService(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        const cartFound = await getCartByIdService(cid)
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        const result = await deleteProductService(cid, pid);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteAllProduct = async (req, res) => {
    try {
        const cid = req.params.cid; 
        const cartFound = await getCartByIdService(cid)
        if (!cartFound) {
            return res.sendClientError("Cart not found");
        }
        const result = await deleteAllProductService(cid);
        res.sendSuccess(result)
    } catch (error) {
        res.sendServerError(error.message);
    }
    
}

const purchaseCart = async (req,res) => {
    try {
        
        const cartID = req.params.cid;
        const cart = await getCartByIdService(cartID)
        if (!cart) {
            return res.status(400).send({ error: 'Carrito no encontrado' });
        }
        if (cart.product === []) {
            return res.status(400).send({ error: 'Carrito vacio' });
        }
        const result = await purchaseCartService(req.user, cart);
        res.sendSuccess(result);   

    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    getCarts,
    getCartById,
    saveCart,
    addProductToCart,
    updateCart,
    updateQuantity,
    deleteProduct,
    deleteAllProduct,
    purchaseCart
}