import { Router } from "express";
import Products from "../../dao/dbManagers/products.js";


const router = Router();
const productManager = new Products();

router.get("/", async (req, res) => {
    try {
        const result = await productManager.getAll();
        res.status(200).send({status: "success", payload: result});  
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const pid = Number(req.params.pid);
        const productById = await productManager.getAll(pid);
        if (productById) {
            return res.status(200).send({status: "success", payload: productById});
        } else {
            return res.status(404).send({status: "error", error: "product not found"});
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail } = req.body;
    
    if (!title || !description || !code || !price || !stock || !category || !thumbnail){
        return res.status(400).send({ error: "Incomplete values" })
    }

    try {
        const result = await productManager.save({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail
        });
        if (result) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await productManager.getAll());
            return res.status(200).send({ status: "success", payload: result});
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.put("/:pid", async (req, res) => {
    const product = req.body;
    const productID = req.params.pid;

    const productFound = await productManager.getProductById(productID);
    if (!productFound) {
        return res.status(404).send({ error: "ID not found" });
    }

    try {
        const result = await productManager.update(productID, product);
        if (result) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await productManager.getAll());
            return res.status(200).send({ status: "success", payload: result});
        }
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params
    const result = await productManager.delete({_id: pid});
    if (result) {
        const io = req.app.get('socketio');
        io.emit("showProducts", await productManager.getAll());
        return res.status(200).send({status: "success", payload: result});
    } 
})

export default router;
