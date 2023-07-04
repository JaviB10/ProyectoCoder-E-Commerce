import { 
    getProductsService,
    getProductsPaginateService,
    getProductByIdService,
    saveProductService,
    updateProductService,
    deleteOneProductService
} from "../services/products.services.js"

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
        const { page = 1, limit = 10, category = "", status = "", sort = "" } = req.query;
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
        const products = await getProductsPaginateService(filter, limit, page, sortBy);
        const result = {
            status: "success",
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
        res.render("home", {products:result, user:req.user});
    } catch (error) {
        res.sendServerError(error.message);
    }
    
}

const getProductById = async (req, res) => {
    try {
        const { pid } = req.query;
        const productFound = await getProductByIdService(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        res.sendSuccess(productFound);
        res.render("productDetails", {productFound, user: req.user})
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const saveProduct = async (req, res) => {
    try {
        const product = req.body;
        if (product.status === null || product.status === undefined) {
            product.status = true;
        }
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnail){
            return res.sendClientError("Incomplete values");
        }
        const result = await saveProductService(product);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        const { pid } = req.query;
        const product = req.body;
        const productFound = await getProductById(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        const result = await updateProductService(pid, product);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteOneProduct = async (req, res) => {
    try {
        const { pid } = req.query;
        const productFound = await getProductById(pid);
        if (!productFound) {
            return res.sendClientError("Product not found");
        }
        const result = await deleteOneProductService(pid);
        res.sendSuccess(result);
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
    deleteOneProduct
}