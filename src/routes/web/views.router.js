import { Router } from "express";
import { productModel } from "../../dao/models/products.model.js"; 
import Products from "../../dao/dbManagers/products.js";
import Carts from "../../dao/dbManagers/carts.js";

const router = Router();
const productManager = new Products();
const cartManager = new Carts();

const publicAccess = (req, res, next) => {
    if(req.session.user){
        return res.redirect("/products");
    }
    next()
}
const privateAccess = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect("/login");
    } 
    next()
}

router.get("/register", publicAccess, (req, res) => {
    res.render("register");
})
router.get("/login", publicAccess, (req, res) => {
    res.render("login");
})

//Redireccionar raiz al login
router.get('/', publicAccess, (req, res) => {
    res.redirect('/login');
});

router.get('/products', privateAccess, async (req, res) => {
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
    res.render("home", {products:result, user:req.session.user});
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById({ _id: pid })
    res.render("productDetails", {product})
})

router.get('/carts/:cid', privateAccess , async (req, res) => {
        const { cid } = req.params;
        const result = await cartManager.getCartById({ _id: cid });
        res.render("cart", result)
});

router.get("/realtimeproducts", async (req,res) => {
    const productos = await productManager.getAll()
    res.render("realTimeProducts", { "products" : productos});
    const io = req.app.get('socketio');
    io.on('connection', socket =>{
        io.emit("showProducts", productos);
    })
});

router.get("/chat", (req, res) => {
    res.render("chat");
})

export default router;