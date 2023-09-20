import express from "express";
import handlebars from "express-handlebars";
import __mainDirname from "./utils/utils.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import "./dao/factory.js"
import routerProducts from "./routes/api/products.router.js";
import routerCarts from "./routes/api/carts.router.js";
import routerUsers from "./routes/api/user.router.js"
import routerViews from './routes/web/views.router.js'
import routerTickets from "./routes/api/tickets.router.js"
import routerSessions from "./routes/api/sessions.router.js"
import { addLogger, logger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

const productsRouter = new routerProducts()
const cartsRouter = new routerCarts()
const usersRouter = new routerUsers()
const viewsRouter = new routerViews()
const ticketsRouter = new routerTickets()
const sessionsRouter = new routerSessions()

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__mainDirname}/public`))
app.use(cookieParser())
app.use(express.json())

//Passport
initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine())
app.set("views", `${__mainDirname}/views`)
app.set("view engine", "handlebars")

app.use(addLogger);
app.use(`/`, viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/api/ticket", ticketsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion del proyecto',
            description: 'API pensada para resolver el proceso de un ecommerce'
        }
    },
    apis: [`${__mainDirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const port = Number(config.port)
app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})