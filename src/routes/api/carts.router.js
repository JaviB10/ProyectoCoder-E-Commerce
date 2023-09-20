import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { 
    addProductToCart, 
    deleteAllProduct, 
    deleteProduct, 
    purchaseCart, 
    getCartById, 
    updateCart, 
    updateQuantity 
} from "../../controllers/carts.controllers.js";

export default class CartsRouter extends Router {
    init() {
        this.get('/:cid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getCartById);
        this.post('/:cid/product/:pid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, addProductToCart);
        this.post('/:cid/purchase', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, purchaseCart);
        this.put('/:cid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, updateCart);
        this.put('/:cid/product/:pid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, updateQuantity);
        this.delete('/:cid/product/:pid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, deleteProduct);
        this.delete('/:cid', ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, deleteAllProduct);
    }
}