import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js";
import { getProductById, getProductsPaginate, getNewProduct } from "../../controllers/product.controllers.js";
import { getCartById } from "../../controllers/carts.controllers.js";
import { getPasswordLink, getPasswordReset, getViewProfile } from "../../controllers/users.controllers.js";

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
        this.get('/products', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, getProductsPaginate);
        this.get("/products/:pid", ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, getProductById)
        this.get('/carts/:cid', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, getCartById);
        this.get('/password-link', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordLink);
        this.get('/password-reset', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordReset);
        this.get('/new-product', ['ADMIN', 'PREMIUM'], passportStrategiesEnum.JWT, getNewProduct);
        this.get('/viewProfile', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, getViewProfile)
    }
}