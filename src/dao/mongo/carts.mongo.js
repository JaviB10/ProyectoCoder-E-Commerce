import { cartModel } from "./models/carts.model.js";
import { logger } from "../../utils/logger.js";

export default class Carts {
    constructor() {
        logger.info("Working carts with DB");
    }

    newCart = async () => {
        return await cartModel.create();
    }

    getAll = async () => {
        return await cartModel.find().lean();
    }

    getCartById = async (cid) => {
        return await cartModel.findOne({_id:cid}).lean();
    }

    save = async (cart) => {
        return await cartModel.create(cart);
    }

    updateCart = async (cid, product) =>{
        return await cartModel.updateOne({_id:cid}, product);
    }

    deleteCart = async (cid) =>{
        return await cartModel.deleteOne({_id:cid});
    }
}