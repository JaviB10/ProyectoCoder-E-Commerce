import { Router } from "express";
import Products from "../../dao/dbManagers/products.js";
import { productModel } from "../../dao/models/products.model.js"; 

const router = Router();
const productManager = new Products();


router.get('/products', async (req, res) => {
    const { page = 1, limit = 10, query = "", sort = "" } = req.query;
    const filter = {};
    if (query) {
        filter.category = query; // Agregar filtro por categoría si se especifica
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
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null
    }
    res.render('home', result);
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