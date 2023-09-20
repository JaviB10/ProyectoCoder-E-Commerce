import Router from "../router.js";
import { passportStrategiesEnum } from "../../config/enums.js";
import { 
    deleteOneProduct, 
    getProductById, 
    getProducts, 
    saveProduct, 
    updateProduct 
} from "../../controllers/product.controllers.js";

export default class ProductsRouter extends Router {
    init() {
        this.get("/", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getProducts)
        this.get("/:pid", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, getProductById)
        this.post("/", ["ADMIN", "PREMIUM",], passportStrategiesEnum.JWT, saveProduct)
        this.put("/:pid", ["ADMIN", "PREMIUM",], passportStrategiesEnum.JWT, updateProduct)
        this.delete("/:pid", ["ADMIN", "PREMIUM",], passportStrategiesEnum.JWT, deleteOneProduct)
    }
}