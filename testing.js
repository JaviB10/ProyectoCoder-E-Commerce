import ProductManager from "./main.js";

const newProduct = new ProductManager();

const testing = async () => {

    //Se llama a la funcion getProducts, la cual debera mostrar por esta vez un array vacio.
    console.table(await newProduct.getProducts())
    //Se llama a la funcion addProducts, la cual añadira un nuevo producto al array.
    await newProduct.addProducts("Producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25);
    await newProduct.addProducts("Producto prueba segundo", "Este es un producto de prueba segundo", 300, "Sin imagen", "abc457", 50);
    //Se vuelve a llamar a la funcion getProducts, la cual ahora debera mostrar el producto anteriormente añadido.
    console.table(await newProduct.getProducts())
    //Se llama a la funcion getProductById, la cual nos devolvera en caso de existir un objeto del array
    await newProduct.getProductById(1)
    //Se llama a la funcion getUpdate, la cual modificara los campos del objeto solicitado por el usuario.
    await newProduct.getUpdate(1, ["title", "description"], {title: "Producto de prueba 2.0", description: "Este producto de prueba fue actualizado con exito"})
    //Se llama a la funcion getDelete, la cual eliminara el objeto solicitado por el usuario que se encuentre dentro del array.
    await newProduct.getDelete(2)

}

testing();



