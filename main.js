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

    addProducts = async (title, description, price, thumbnail, code, stock) => {

        try {

            const products = await this.getProducts();

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            const codeValidation = products.find(product => product.code === code);

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

                console.log ("No se encontro ningun producto con la ID solicitada");

            } else {

                console.log("El producto con la ID solicitada es el siguiente: ");
                console.table(products[productIndex]);
                return productIndex

            }
        } catch (error) {

            console.log(error);

        }
        
    }

    getDelete = async (idProduct) => {

        try {

            const products = await this.getProducts();
            const productsID = await this.getProductById(idProduct);
            const productFound = products[productsID]
            if (productFound) {

                products.splice(productsID,idProduct)
                await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
                console.log("El producto con la ID solicitada fue eliminado con exito de la lista");

            }
            
        } catch (error) {

            console.log(error);

        }
        
    }
    
    getUpdate = async (idProduct, propiedad, nuevoValor) => {

        try {

            const products = await this.getProducts();
            const productsID = await this.getProductById(idProduct);
            const productFound = products[productsID]
            if (productFound) {

                for (let i in nuevoValor) {

                    if (propiedad.includes(i)) {

                        productFound[i] = nuevoValor[i];

                    }
                }
                await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
                console.log("El producto solicitado modificado correctamente: ");
                console.table(productFound)
            }
            
        } catch (error) {

            console.log(error);

        }

    }
}

