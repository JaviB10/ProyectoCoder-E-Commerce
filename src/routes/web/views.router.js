import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req,res) => {
    const productos = await productManager.getProducts()
    res.render("home", { "products" : productos});
});

router.get("/realtimeproducts", async (req,res) => {
    const productos = await productManager.getProducts()
    
    res.render("realTimeProducts", { "products" : productos});
    const io = req.app.get('socketio');
    io.on('connection', socket =>{
        io.emit("showProducts", productos);
    })
});

export default router;