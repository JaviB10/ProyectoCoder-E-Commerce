import { PRODUCTSDAO } from "../dao/index.js";

const getProductsService = async () => {
    const products = await PRODUCTSDAO.getAll();
    return products;
}

const getProductsPaginateService = async (filter, limit, page, sortBy) => {
    const products = await PRODUCTSDAO.getAllPaginate(filter, limit, page, sortBy);
    return products;
}

const getProductByIdService = async (pid) => {
    const product = await PRODUCTSDAO.getProductById(pid);
    return product;
}

const saveProductService = async (product) => {
    const result = await PRODUCTSDAO.save(product);
    return result;
}

const updateProductService = async (pid, product) => {
    const result = await PRODUCTSDAO.update(pid, product);
    return result;
}

const deleteOneProductService = async (pid) => {
    const result = await PRODUCTSDAO.delete(pid);
    return result;
}

export {
    getProductsService,
    getProductsPaginateService,
    getProductByIdService,
    saveProductService,
    updateProductService,
    deleteOneProductService
}