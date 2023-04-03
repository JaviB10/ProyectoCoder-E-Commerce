import fs from "fs";

const path = "./files/Productos.json"

export default class ProductManager {

    getProducts = async () => {

        try {

            if (fs.existsSync(path)) {

                const data = await fs.promises.readFile(path, "utf-8");
                const products = JSON.parse(data);
                return products;

            } else {

                return [];

            }
        } catch (error) {

            console.log(error);

        }
    }

    addProducts = async (product) => {

        try {

            const products = await this.getProducts();

            const codeValidation = products.map(function (products) {

                if (products.code === product.code) {

                    return true

                } else {

                    return products;

                }
            
            });

            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {

                console.log("Para que se valide el producto debe completar todos los campos");
                return
    
            } else if (codeValidation) {
    
                console.log ("El codigo ingresado ya esta en uso");
                return

            } else {

                if (products.length === 0) {

                    product.id = 1;
    
                } else {
    
                    product.id = products[products.length - 1].id + 1;
    
                }
    
                await products.push(product);
                await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
            }

            return product
            
        } catch (error) {

            console.log(error);

        }
        
    }

    getProductById = async (idProduct) => {

        try {

            const products = await this.getProducts();
    
            const productIndex = products.findIndex(product => product.id === idProduct);

            if (productIndex === -1) {

                console.log ("Not found");

            } else {

                return products[productIndex]

            }
        } catch (error) {

            console.log(error);

        }
        
    }

    getDelete = async (idProduct) => {

        try {

            const products = await this.getProducts();
            const newProducts = products.filter( product => {
                
                return product.id !== idProduct;

            });
            
            await fs.promises.writeFile(path, JSON.stringify(newProducts, null, '\t'));
            
        } catch (error) {

            console.log(error);

        }
        
    }
    
    getUpdate = async (idProduct, product) => {

        try {

            const products = await this.getProducts();
            const newProducts = products.map(function (element) {

                if (element.id === idProduct) {

                    return {...element,...product}

                } else {

                    return element;

                }
            
            });
            await fs.promises.writeFile(path, JSON.stringify(newProducts, null, '\t'));
            
        } catch (error) {

            console.log(error);

        }

    }
}

