import config from "../config/config.js";

let CARTSDAO;
let PRODUCTSDAO;
let USERSDAO;
let TICKETSDAO
const persistence = config.persistence

switch(persistence){
    case "MONGO":
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: MongoCartsDao } = await import("./mongo/carts.mongo.js")
        const { default: MongoProductsDao } = await import("./mongo/products.mongo.js")
        const { default: MongoUsersDao } = await import("./mongo/users.mongo.js")
        const { default: MongoTicketsDao } = await import("./mongo/tickets.mongo.js")
        CARTSDAO  = new MongoCartsDao();
        PRODUCTSDAO  = new MongoProductsDao();
        USERSDAO  = new MongoUsersDao();
        TICKETSDAO = new MongoTicketsDao()
        break;
}

export {
    CARTSDAO,
    PRODUCTSDAO,
    USERSDAO,
    TICKETSDAO
}