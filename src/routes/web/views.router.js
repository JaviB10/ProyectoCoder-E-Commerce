import { query, Router } from "express";
import Carts from "../../dao/dbManagers/carts.js";
import Products from "../../dao/dbManagers/products.js";
import { cartModel } from "../../dao/models/carts.model.js";
import { productModel } from "../../dao/models/products.model.js"; 

const router = Router();
const productManager = new Products();
const cartManager = new Carts();


router.get('/products', async (req, res) => {
    const { page = 1, limit = 10, category = "", status = "", sort = "" } = req.query;
    const filter = {};
    if (category) {
        filter.category = category; // Agregar filtro por categoría si se especifica
    }
    if (status) {
        filter.status = status; // Agregar filtro por categoría si se especifica
    }
        
    const sortBy = {};
    if (sort) {
        sortBy.price = sort
    } 
        
    const products = await productModel.paginate(filter, { limit, page, lean: true, sort:sortBy });
    const result = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null
    }
    res.render('home', result);
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid)
    res.render('detail', {product})
})


router.get('/carts/:cid', async (req, res) => {
        const cartID = req.params.cid;

        const cart = await cartModel.find({ _id: cartID }).populate('products.product');

        const result = {
            _id : cart[0]._id,
            products : []
        }

        cart[0].products.forEach(item=>{
            result.products.push({
                product: {
                    _id : item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    code: item.product.code,
                    price: item.product.price,
                    status: item.product.status,
                    stock: item.product.stock,
                    category: item.product.category,
                    thumbnail: item.product.thumbnail
                },
                quantity: item.quantity
            })
        })

        res.render('cart', result)
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