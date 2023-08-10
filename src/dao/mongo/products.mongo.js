import { productModel } from "./models/products.model.js";
import { logger } from "../../logger.js";

export default class Products {
    constructor() {
        logger.info("Working products with DB");
    }

    getAll = async () => {
        return await productModel.find().lean();
    }

    getAllPaginate = async (filter, limit, page, sortBy) => {
        return await productModel.paginate(filter, { limit, page, lean: true, sort:sortBy });
    }

    getProductById = async (pid) => {
        return await productModel.find({_id:pid}).lean();
    }

    getProductByIdOne = async (pid) => {
        return await productModel.findOne({_id:pid}).lean();
    }

    save = async (product) => {
        return await productModel.create(product);
    }

    update = async (pid, product) => {
        return await productModel.updateOne({_id:pid}, product);
    }

    delete = async (pid) => {
        return await productModel.deleteOne({_id:pid});
    }
}