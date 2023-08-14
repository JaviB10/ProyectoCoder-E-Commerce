import {
    getCartByIdService,
    addProductToCartService,
    updateCartService,
    updateQuantityService,
    deleteProductService,
    deleteAllProductService,
    purchaseCartService
} from "../services/carts.services.js"
import { getProductByIdOneService, getProductByIdService } from "../services/products.services.js";
import { CantAddProduct, CartNotFound, ProductNotFound } from "../utils/custom-exceptions.js";

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartFound = await getCartByIdService(cid);
        res.render("cart", cartFound)
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await getCartByIdService(cid)
        const productFound = await getProductByIdOneService(pid);
        const result = await addProductToCartService(cid, pid, productFound, req.user);
        res.sendSuccess(result);
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof ProductNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantAddProduct) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const updateCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        await getCartByIdService(cid)
        const { product } = req.body;
        const result = await updateCartService(cid, product);
        res.sendSuccess(result);
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const updateQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cantidad = req.body;
        await getProductByIdService(pid);
        await getCartByIdService(cid)
        const result = await updateQuantityService(cid, pid, cantidad);
        res.sendSuccess(result);
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof ProductNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await getProductByIdService(pid);
        await getCartByIdService(cid)
        const result = await deleteProductService(cid, pid);
        res.sendSuccess(result);
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof ProductNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const deleteAllProduct = async (req, res) => {
    try {
        const cid = req.params.cid; 
        await getCartByIdService(cid)
        const result = await deleteAllProductService(cid);
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const purchaseCart = async (req,res) => {
    try {
        const cartID = req.params.cid;
        const cart = await getCartByIdService(cartID)
        if (cart.product === []) {
            return res.sendClientError("Empty cart")
        }
        const result = await purchaseCartService(req.user, cart);
        res.sendSuccess(result);   
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

export {
    getCartById,
    addProductToCart,
    updateCart,
    updateQuantity,
    deleteProduct,
    deleteAllProduct,
    purchaseCart
}