import mongoCartsDao from "./dbManagers/carts.dao.js"
import mongoProductsDao from "./dbManagers/products.dao.js"
import mongoUsersDao from "./dbManagers/users.dao.js"

const MongoCartsDao = new mongoCartsDao();
const MongoProductsDao = new mongoProductsDao();
const MongoUsersDao = new mongoUsersDao();

export const CARTSDAO = MongoCartsDao
export const PRODUCTSDAO = MongoProductsDao
export const USERSDAO = MongoUsersDao