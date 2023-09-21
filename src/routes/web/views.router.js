import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js";
import { 
    getProductById, 
    getProductsPaginate, 
    getNewProduct 
} from "../../controllers/product.controllers.js";
import { 
    getUser, 
    getViewProfile } from "../../controllers/users.controllers.js";
import { 
    getLogin, 
    getLogueado, 
    getPasswordLink, 
    getPasswordReset, 
    getRegister 
} from "../../controllers/sessions.controllers.js";
import { 
    getCartById, 
    getPayments 
} from "../../controllers/carts.controllers.js";

export default class ViewsRouter extends Router {
    init() {
        //view sessions
        this.get("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, getLogin);
        this.get("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, getRegister);
        this.get("/", ["PUBLIC"], passportStrategiesEnum.NOTHING, getLogueado);
        this.get("/passwordLink", ["PUBLIC"], passportStrategiesEnum.NOTHING, getPasswordLink);
        this.get("/passwordReset", ["PUBLIC"], passportStrategiesEnum.NOTHING, getPasswordReset);
        //view products
        this.get("/products", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getProductsPaginate);
        this.get("/products/:pid", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getProductById)
        this.get("/newProduct", ["ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, getNewProduct);
        //view cart
        this.get("/carts/:cid", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getCartById);
        this.get("/payments", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getPayments)
        //view users
        this.get("/viewProfile", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getViewProfile)
        this.get("/viewUsers", ["ADMIN"], passportStrategiesEnum.JWT, getUser)
    }
}