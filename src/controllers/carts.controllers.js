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
import { CantAddProduct, CantDeleteAllProduct, CantPurchase, CartNotFound, OutStockProduct, ProductNotFound } from "../utils/custom-exceptions.js";

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
        const cartFound = await getCartByIdService(cid)
        const productFound = await getProductByIdOneService(pid);
        const result = await addProductToCartService(cartFound, productFound, pid, req.user);
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
        const quantity = req.body;
        const cartFound = await getCartByIdService(cid)
        await getProductByIdService(pid);
        const result = await updateQuantityService(cartFound, pid, quantity);
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
        const cartFound = await getCartByIdService(cid)
        const result = await deleteProductService(cartFound, pid);
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
        const cartFound = await getCartByIdService(cid)
        const result = await deleteAllProductService(cartFound);
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantDeleteAllProduct) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

let purchaseResult = null; // Variable de nivel superior

const purchaseCart = async (req,res) => {
    try {
        const cartID = req.params.cid;
        const cart = await getCartByIdService(cartID)
        purchaseResult = await purchaseCartService(req.user, cart);
        res.sendSuccess(purchaseResult)
    } catch (error) {
        if (error instanceof CartNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantPurchase) {
            return res.sendClientError(error.message);
        }
        if (error instanceof OutStockProduct) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const getPayments = async (req,res) => {
    try {
        res.render("payments", purchaseResult);
    } catch (error) {
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
    purchaseCart,
    getPayments
}