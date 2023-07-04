import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { addProductToCart, deleteAllProduct, deleteProduct, getCartById, getCarts, saveCart, updateCart, updateQuantity } from "../../controllers/carts.controllers.js";

export default class CartsRouter extends Router {
    init() {
        this.get("/", ["ADMIN", "USER"], passportStrategiesEnum.JWT, getCarts)
        this.get('/:cid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, getCartById);
        this.post('/', ["PUBLIC"], passportStrategiesEnum.NOTHING, saveCart);
        this.post('/:cid/product/:pid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, addProductToCart);
        this.put('/:cid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, updateCart);
        this.put('/:cid/product/:pid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, updateQuantity);
        this.delete('/:cid/product/:pid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, deleteProduct);
        this.delete('/:cid', ["ADMIN", "USER"], passportStrategiesEnum.JWT, deleteAllProduct);
    }
}