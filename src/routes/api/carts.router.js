import { Router } from "express";
import Carts from "../../dao/dbManagers/carts.js";
import Products from "../../dao/dbManagers/products.js";

const router = Router();
const cartManager = new Carts();
const productManager = new Products();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.status(200).send({status: "success", payload: carts}); 
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = { products: [] };
        const result = await cartManager.save(cart);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;

        const productFound = await productManager.getProductById(productID);
        if (!productFound) {
            return res.status(404).send({ error: "Product not found" });
        }

        const cartFound = await cartManager.getCartById(cartID)
        if (!cartFound) {
            return res.status(404).send({ error: "Cart not found" });
        }

        const result = await cartManager.addProductToCart(cartID, productID)
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;

        const product = await productManager.getProductById(productID);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        const cart = await cartManager.getCartById(cartID)
        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }
        
        const result = await cartManager.deleteProductToCart(cartID, productID)
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }

});

router.delete('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await cartManager.getCartById(cartID)

        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        const result = await cartManager.deleteCart(cartID)
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const products = req.body;

        const cart = await cartManager.getCartById(cartID)
        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        const result = await cartManager.updateCart(cartID, products);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const quantity = req.body;

        const product = await productManager.getProductById(productID);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        const cart = await cartManager.getCartById(cartID)
        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        const result = await cartManager.updateQuantityToCart(cartID, productID, quantity);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error });
    }
});

export default router;