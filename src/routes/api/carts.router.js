import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import Carts from "../../dao/dbManagers/carts.js";
import Products from "../../dao/dbManagers/products.js";

const cartManager = new Carts();
const productManager = new Products();

export default class CartsRouter extends Router {
    init() {
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const carts = await cartManager.getAll();
                res.sendSuccess(carts)
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
        this.get('/:cid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const { cid } = req.query;
                const cart = await cartManager.getCartById(cid);
                if (!cart) {
                    return res.sendClientError("Cart not found")
                }
                res.sendSuccess(cart)
            } catch (error) {
                res.sendServerError(error.message)
            }
        
        });
        this.post('/', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cart = { products: [] };
                const result = await cartManager.save(cart);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });
        this.post('/:cid/product/:pid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cartID = req.params.cid;
                const productID = req.params.pid;
        
                const productFound = await productManager.getProductById(productID);
                if (!productFound) {
                    return res.sendClientError("Product not found")
                }
        
                const cartFound = await cartManager.getCartById(cartID)
                if (!cartFound) {
                    return res.sendClientError("Cart not found")
                }
        
                const result = await cartManager.addProductToCart(cartID, productID)
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });
        this.delete('/:cid/product/:pid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cartID = req.params.cid;
                const productID = req.params.pid;
        
                const product = await productManager.getProductById(productID);
                if (!product) {
                    return res.sendClientError("Product not found")
                }
        
                const cart = await cartManager.getCartById(cartID)
                if (!cart) {
                    return res.sendClientError("Cart not found")
                }
                
                const result = await cartManager.deleteProductToCart(cartID, productID)
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        
        });
        
        this.delete('/:cid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cartID = req.params.cid;
                const cart = await cartManager.getCartById(cartID)
        
                if (!cart) {
                    return res.sendClientError("Cart not found")
                }
        
                const result = await cartManager.deleteCart(cartID)
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });
        
        this.put('/:cid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cartID = req.params.cid;
                const products = req.body;
        
                const cart = await cartManager.getCartById(cartID)
                if (!cart) {
                    return res.sendClientError("Cart not found")
                }
        
                const result = await cartManager.updateCart(cartID, products);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });
        
        this.put('/:cid/product/:pid', ["ADMIN"], passportStrategiesEnum.JWT, async (req, res) => {
            try {
                const cartID = req.params.cid;
                const productID = req.params.pid;
                const quantity = req.body;
        
                const product = await productManager.getProductById(productID);
                if (!product) {
                    return res.sendClientError("Product not found")
                }
                const cart = await cartManager.getCartById(cartID)
                if (!cart) {
                    return res.sendClientError("Cart not found")
                }
        
                const result = await cartManager.updateQuantityToCart(cartID, productID, quantity);
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });
        
    }
}







