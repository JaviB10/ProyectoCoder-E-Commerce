import { PRODUCTSDAO } from "../dao/factory.js";

export default class ProductsRepository {
    constructor() {
        this.dao = PRODUCTSDAO;
    }

    getProductsRepository = async () => {
        const products = await this.dao.getAll();
        return products;
    }
    
    getProductsPaginateRepository = async (filter, limit, page, sortBy) => {
        const products = await this.dao.getAllPaginate(filter, limit, page, sortBy);
        return products;
    }
    
    getProductByIdRepository = async (pid) => {
        const product = await this.dao.getProductById(pid);
        return product;
    }
    
    saveProductRepository = async (product) => {
        const result = await this.dao.save(product);
        return result;
    }
    
    updateProductRepository = async (pid, product) => {
        const result = await this.dao.update(pid, product);
        return result;
    }
    
    deleteOneProductRepository = async (pid) => {
        const result = await this.dao.delete(pid);
        return result;
    }
}