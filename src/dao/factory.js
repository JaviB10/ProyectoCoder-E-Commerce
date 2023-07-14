import config from "../config/config.js";

let CARTSDAO;
let PRODUCTSDAO;
let USERSDAO;
const persistence = config.persistence

switch(persistence){
    case "MONGO":
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: MongoCartsDao} = await import("./mongo/carts.mongo.js")
        const { default: MongoProductsDao} = await import("./mongo/products.mongo.js")
        const { default: MongoUsersDao} = await import("./mongo/users.mongo.js")
        CARTSDAO  = new MongoCartsDao();
        PRODUCTSDAO  = new MongoProductsDao();
        USERSDAO  = new MongoUsersDao();
        break;
}

export {
    CARTSDAO,
    PRODUCTSDAO,
    USERSDAO
}