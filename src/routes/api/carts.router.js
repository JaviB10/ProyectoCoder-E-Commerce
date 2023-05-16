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
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {

        const cartID = req.params.cid;
        const productID = req.params.pid;

        const productFound = await productManager.getProductById(productID);
        if (!productFound) {
            return res.status(400).send({ error: 'Producto no encontrado' });
        }

        const cartFound = await cartManager.getCartById(cartID)
        if (!cartFound) {
            return res.status(400).send({ error: 'Carrito no encontrado' });
        }

        const result = await cartManager.addProductToCart(cartID, productID)
        res.send({ status: 'success', pauload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    const result = await cartManager.delete({_id: cid});
    try {
        if (result) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await productManager.getAll());
            return res.status(200).send({status: "success", payload: result});
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

export default router;