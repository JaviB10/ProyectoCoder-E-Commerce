import ProductManager from "./manager/ProductManager.js";

const newProduct = new ProductManager();

const testing = async () => {

    
    //Se llama a la funcion getProducts, la cual debera mostrar por esta vez un array vacio.
    console.table(await newProduct.getProducts())
    //Se llama a la funcion addProducts, la cual añadira un nuevo producto al array.
    const product = {
        title: "Producto de prueba segundo",
        description: "Este es un producto de prueba segundo",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 50
    }
    await newProduct.addProducts(product);
    //Se vuelve a llamar a la funcion getProducts, la cual ahora debera mostrar el producto anteriormente añadido.
    console.table(await newProduct.getProducts())
    //Se llama a la funcion getProductById, la cual nos devolvera en caso de existir un objeto del array
    await newProduct.getProductById(1)
    //Se llama a la funcion getUpdate, la cual modificara los campos del objeto solicitado por el usuario.
    await newProduct.getUpdate(1, {title: "Producto de prueba 2.0", description: "Este producto de prueba fue actualizado con exito"})
    //Se llama a la funcion getDelete, la cual eliminara el objeto solicitado por el usuario que se encuentre dentro del array.
    await newProduct.getDelete(2)

}

testing();



