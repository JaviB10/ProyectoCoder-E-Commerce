import { 
    getProductsService,
    getProductsPaginateService,
    getProductByIdService,
    saveProductService,
    updateProductService,
    deleteOneProductService,
    getProductByIdOneService
} from "../services/products.services.js"
import { CantDeleteProduct, IncompleteValues, ProductNotFound } from "../utils/custom-exceptions.js";

const getProducts = async (req, res) => {
    try {
        const products = await getProductsService();
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getProductsPaginate = async (req, res) => {
    try {
        const { page = 1, limit = 10, category = '', status = '', sort = '' } = req.query;
        const products = await getProductsPaginateService(page, limit, category, status, sort);
        const result = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null
        }
        res.render('home', {products:result, user:req.user});
    } catch (error) {
        res.sendServerError(error.message);
    }
    
}

const getProductById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const productFound = await getProductByIdService(pid);
        res.render('productDetails', {productFound, user: req.user})
    } catch (error) {
        if (error instanceof ProductNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const saveProduct = async (req, res) => {
    try {
        const product = req.body;
        const result = await saveProductService(product, req.user);
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof IncompleteValues) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = req.body;
        const result = await updateProductService(pid, product);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteOneProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const productFound = await getProductByIdOneService(pid);
        const result = await deleteOneProductService(pid, productFound, req.user);
        res.sendSuccess(result);
    } catch (error) {
        if (error instanceof ProductNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantDeleteProduct) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const getNewProduct = async (req, res) => {
    try {
        res.render("newProduct")
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    getProducts,
    getProductsPaginate,
    getProductById,
    saveProduct,
    updateProduct,
    deleteOneProduct,
    getNewProduct
}