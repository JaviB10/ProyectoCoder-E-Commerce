import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js";
import { getProductById, getProductsPaginate, getNewProduct } from "../../controllers/product.controllers.js";
import { getCartById } from "../../controllers/carts.controllers.js";
import { generateProduct } from "../../utils.js";
import { getPasswordLink, getPasswordReset } from "../../controllers/users.controllers.js";

export default class ViewsRouter extends Router {
    init() {
        this.get('/login', ['PUBLIC'], passportStrategiesEnum.NOTHING, (req, res) => {
            if (req.cookies["coderCookieToken"]) res.redirect('/products');
            res.render('login');
        });
        this.get('/register', ['PUBLIC'], passportStrategiesEnum.NOTHING, (req, res) => {
            if (req.cookies["coderCookieToken"]) res.redirect('/products');
            res.render('register');
        });
        this.get('/', ['PUBLIC'], passportStrategiesEnum.NOTHING, (req, res) => {
            res.redirect('/login');
        });
        this.get('/products', ['ADMIN', 'USER', "PREMIUM"], passportStrategiesEnum.JWT, getProductsPaginate);
        this.get("/products/:pid", ['ADMIN', 'USER', "PREMIUM"], passportStrategiesEnum.JWT, getProductById)
        this.get('/carts/:cid', ['ADMIN', 'USER', "PREMIUM"], passportStrategiesEnum.JWT, getCartById);
        this.get('/password-link', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordLink);
        this.get('/password-reset', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordReset);
        this.get('/new-product', ['ADMIN', 'PREMIUM'], passportStrategiesEnum.JWT, getNewProduct);
        this.get("/mocking-products", ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            try {
                const products = [];

                for (let i = 0; i < 100; i++) {
                    products.push(generateProduct());
                }

                res.sendSuccess(products);
            } catch (error) {
                res.sendServerError(error.message);
            }
        })
    }
}

// const publicAccess = (req, res, next) => {
//     if(req.session.user){
//         return res.redirect("/products");
//     }
//     next()
// }
// const privateAccess = (req, res, next) => {
//     if(!req.session.user) {
//         return res.redirect("/login");
//     } 
//     next()
// }

// router.get("/register", publicAccess, (req, res) => {
//     res.render("register");
// })
// router.get("/login", publicAccess, (req, res) => {
//     res.render("login");
// })

//Redireccionar raiz al login






// router.get('/carts/:cid', privateAccess , async (req, res) => {
//         const { cid } = req.params;
//         const result = await cartManager.getCartById({ _id: cid });
//         res.render("cart", result)
// });

// router.get("/realtimeproducts", async (req,res) => {
//     const productos = await productManager.getAll()
//     res.render("realTimeProducts", { "products" : productos});
//     const io = req.app.get('socketio');
//     io.on('connection', socket =>{
//         io.emit("showProducts", productos);
//     })
// });

// router.get("/chat", (req, res) => {
//     res.render("chat");
// })



