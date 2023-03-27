const nuevoModulo = require("../Primera entrega/main");

const agregarProducto = new nuevoModulo.ProductManager();

console.log(agregarProducto.getProducts())

agregarProducto.addProducts("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25)

console.log(agregarProducto.getProducts())

agregarProducto.addProducts("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25)

agregarProducto.getProductById(0)
