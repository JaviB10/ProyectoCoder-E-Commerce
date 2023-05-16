import { Router } from "express";
import Products from "../../dao/dbManagers/products.js";

const router = Router();
const productManager = new Products();

router.get("/", async (req,res) => {
    try {
        const productos = await productManager.getAll()
        res.render("home", { "products" : productos});
    } catch (error) {
        console.log(error);
    }
});

router.get("/realtimeproducts", async (req,res) => {
    const productos = await productManager.getAll()
    res.render("realTimeProducts", { "products" : productos});
    const io = req.app.get('socketio');
    io.on('connection', socket =>{
        io.emit("showProducts", productos);
    })
});

router.get("/chat", async (req, res) => {
    res.render("chat");
})

export default router;