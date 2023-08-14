import ProductsRepository from "../repositories/products.repository.js";
import { CantDeleteProduct, ProductNotFound } from "../utils/custom-exceptions.js";

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

const getProductByIdOneService = async (pid) => {
    const product = await productsRepository.getProductByIdOneRepository(pid);
    if (!product) {
        throw new ProductNotFound('Product not found');
    }
    return product;
}

const saveProductService = async (product) => {
    if (product.status === null || product.status === undefined) {
        product.status = true;
    }
    if (!product.owner || product.owner.trim() === "") {
        product.owner = "ADMIN";
    } else if (product.owner && product.owner.trim() !== "") {
        product.owner = req.user.email;
    }
    const result = await productsRepository.saveProductRepository(product);
    return result;
}

const updateProductService = async (pid, product) => {
    const result = await productsRepository.updateProductRepository(pid, product);
    return result;
}

const deleteOneProductService = async (pid, productFound, user) => {
    if (productFound.owner !== user.email && user.role === "PREMIUM") {
        throw new CantDeleteProduct('User premium cant delete your product')
    }
    const result = await productsRepository.deleteOneProductRepository(pid);
    return result;
}

export {
    getProductsService,
    getProductsPaginateService,
    getProductByIdService,
    getProductByIdOneService,
    saveProductService,
    updateProductService,
    deleteOneProductService
}