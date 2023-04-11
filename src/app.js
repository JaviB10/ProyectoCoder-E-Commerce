import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
app.use(express.urlencoded({extended: true}))

const newProduct = new ProductManager();

app.get("/products", async (req, res) => {

    const products = await newProduct.getProducts();  
    const limit = Number(req.query.limit) || products.length;
    const objetsLimit = products.slice(0, limit);
    res.send(objetsLimit)

})

app.get("/products/:pid", async (req, res) => {

    const products = await newProduct.getProducts(); 
    const productID = Number(req.params.pid);
    const product = products.find(products => products.id === productID);
    if (product) {
        res.send(product);
    } else {
        res.send({Error:"El producto no existe"})
    }
    

})

app.listen(8080, () => {

    console.log("Listening")

})