import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js";
import { getProductById, getProductsPaginate, getNewProduct } from "../../controllers/product.controllers.js";
import { getCartById } from "../../controllers/carts.controllers.js";
import { getUser, getViewProfile } from "../../controllers/users.controllers.js";
import { getPasswordLink, getPasswordReset } from "../../controllers/sessions.controllers.js";

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
        this.get('/products', ['ADMIN', 'PREMIUM', 'USER'], passportStrategiesEnum.JWT, getProductsPaginate);
        this.get("/products/:pid", ['ADMIN', 'PREMIUM', 'USER'], passportStrategiesEnum.JWT, getProductById)
        this.get('/carts/:cid', ['ADMIN', 'PREMIUM', 'USER'], passportStrategiesEnum.JWT, getCartById);
        this.get('/passwordLink', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordLink);
        this.get('/passwordReset', ['PUBLIC'], passportStrategiesEnum.NOTHING, getPasswordReset);
        this.get('/newProduct', ['ADMIN', 'PREMIUM'], passportStrategiesEnum.JWT, getNewProduct);
        this.get('/viewProfile', ['ADMIN', 'PREMIUM', 'USER'], passportStrategiesEnum.JWT, getViewProfile)
        this.get('/viewUsers', ['ADMIN'], passportStrategiesEnum.JWT, getUser)
    }
}