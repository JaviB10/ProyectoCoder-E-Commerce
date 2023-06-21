import Router from "../router.js";
import Products from "../../dao/dbManagers/products.js";
import { passportStrategiesEnum } from "../../config/enums.js";

const productManager = new Products();

export default class ProductsRouter extends Router {
    init() {
        this.get("/", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const products = await productManager.getAll()
                res.sendSuccess(products)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
        this.get("/:pid", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const pid = Number(req.params.pid);
                const productFound = await productManager.getProductById(pid)
                if (!productFound) {
                    return res.sendClientError("Product not found")
                }
                res.sendSuccess(productFound)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
        this.post("/", ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const product = req.body;

                if (product.status === null || product.status === undefined) {
                    product.status = true;
                }

                if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnail){
                    return res.sendClientError("Incomplete values")
                }
                const result = await productManager.save(product);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
        this.put("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const product = req.body;
                const { pid } = req.query

                const productFound = await productManager.getProductById(pid);
                if (!productFound) {
                    return res.sendClientError("Product not found")
                }
                const result = await productManager.update(pid, product);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
        this.delete("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const { pid } = req.query

                const productFound = await productManager.getProductById(pid);
                if (!productFound) {
                    return res.sendClientError("Product not found")
                }
                const result = await productManager.delete(pid);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
    }
}

// router.get("/", async (req, res) => {
//     try {
//         const result = await productManager.getAll();
//         res.status(200).send({status: "success", payload: result});  
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// })

// router.get("/:pid", async (req, res) => {
//     try {
//         const pid = Number(req.params.pid);
//         const productById = await productManager.getAll(pid);
//         if (productById) {
//             return res.status(200).send({status: "success", payload: productById});
//         } else {
//             return res.status(404).send({status: "error", error: "product not found"});
//         }
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// })

// router.post("/", async (req, res) => {
//     const product = req.body;

//     if (product.status === null || product.status === undefined) {
//         product.status = true;
//     }

//     if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnail){
//         return res.status(400).send({ error: "Incomplete values" })
//     }

//     try {
//         const result = await productManager.save(product);
//         if (result) {
//             const io = req.app.get('socketio');
//             io.emit("showProducts", await productManager.getAll());
//             return res.status(200).send({ status: "success", payload: result});
//         }
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// })

// router.put("/:pid", async (req, res) => {
//     const product = req.body;
//     const productID = req.params.pid;

//     const productFound = await productManager.getProductById(productID);
//     if (!productFound) {
//         return res.status(404).send({ error: "ID not found" });
//     }

//     try {
//         const result = await productManager.update(productID, product);
//         if (result) {
//             const io = req.app.get('socketio');
//             io.emit("showProducts", await productManager.getAll());
//             return res.status(200).send({ status: "success", payload: result});
//         }
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// })

// router.delete("/:pid", async (req, res) => {
//     const { pid } = req.params
//     const result = await productManager.delete({_id: pid});
//     if (result) {
//         const io = req.app.get('socketio');
//         io.emit("showProducts", await productManager.getAll());
//         return res.status(200).send({status: "success", payload: result});
//     } 
// })

// export default router;
