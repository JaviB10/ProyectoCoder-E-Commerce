import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { addProductToCart, deleteAllProduct, deleteProduct, purchaseCart, getCartById, updateCart, updateQuantity } from "../../controllers/carts.controllers.js";

export default class CartsRouter extends Router {
    init() {
        this.get('/:cid', ["ADMIN", "USER", "PREMIUM"], passportStrategiesEnum.JWT, getCartById);
        this.post('/:cid/product/:pid', ["ADMIN", "USER", "PREMIUM"], passportStrategiesEnum.JWT, addProductToCart);
        this.put('/:cid', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, updateCart);
        this.put('/:cid/product/:pid', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, updateQuantity);
        this.delete('/:cid/product/:pid', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, deleteProduct);
        this.delete('/:cid', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, deleteAllProduct);
        this.post('/:cid/purchase', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, purchaseCart);
    }
}