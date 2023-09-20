import ProductsRepository from "../repositories/products.repository.js";
import { CantDeleteProduct, IncompleteValues, ProductNotFound } from "../utils/custom-exceptions.js";
import { deleteProductNotification } from "../utils/custom-html.js";
import { sendEmail } from "./email.service.js";

const productsRepository = new ProductsRepository();

const getProductsService = async () => {
    const products = await productsRepository.getProductsRepository();
    return products;
}

const getProductsPaginateService = async (page, limit, category, status, sort) => {
    const filter = {};
    if (category) {
        filter.category = category; // Agregar filtro por categoría si se especifica
    }
    if (status) {
        filter.status = status; // Agregar filtro por categoría si se especifica
    }
    const sortBy = {};
    if (sort) {
        sortBy.price = sort;
    } 
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

const saveProductService = async (product, user) => {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnail){
        throw new IncompleteValues('The user has not provided all the required values')
    }
    if (product.status === null || product.status === undefined) {
        product.status = true;
    }
    if (user.role === 'ADMIN') {
        product.owner = 'ADMIN';
    } else {
        product.owner = user.email;
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
    if (productFound.owner !== 'ADMIN' && productFound.owner !== user.email) {
        const email = {
            to: productFound.owner,
            subject: 'Your product was delete',
            html: deleteProductNotification(productFound)
        }
        
        await sendEmail(email)
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