import ProductsRepository from "../repositories/products.repository.js";

const productsRepository = new ProductsRepository();

const getProductsService = async () => {
    const products = await productsRepository.getProductsRepository();
    return products;
}

const getProductsPaginateService = async (filter, limit, page, sortBy) => {
    const products = await productsRepository.getProductsPaginateRepository(filter, limit, page, sortBy);
    return products;
}

const getProductByIdService = async (pid) => {
    const product = await productsRepository.getProductByIdRepository(pid);
    return product;
}

const saveProductService = async (product) => {
    const result = await productsRepository.saveProductRepository(product);
    return result;
}

const updateProductService = async (pid, product) => {
    const result = await productsRepository.updateProductRepository(pid, product);
    return result;
}

const deleteOneProductService = async (pid) => {
    const result = await productsRepository.deleteOneProductRepository(pid);
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