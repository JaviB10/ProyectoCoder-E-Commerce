class ProductManager {

    constructor() {
        this.products = [];
    }

    getProducts = () => {
        return this.products;
    }

    addProducts = (title, description, price, thumbnail, code, stock) => {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        const codeValidation = this.products.find(product => product.code === code);
        
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {

            console.log("Para que se valide el producto debe completar todos los campos");
            return

        } else if (codeValidation) {

            console.log ("El codigo ingresado ya esta en uso");
            return

        } else {

            if (this.products.length === 0) {

                product.id = 1;

            } else {

                product.id = this.products[this.products.length - 1].id + 1;

            }

            this.products.push(product);
        }
    }

    getProductById = (idProduct) => {

        const productIndex = this.products.findIndex(product => product.id === idProduct);

        if (productIndex === -1) {
            console.log ("Not found");
        } else {
            console.log (this.products[productIndex]);
        }
    }
    
}

exports.ProductManager = ProductManager
