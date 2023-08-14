import express from "express";
import __mainDirname from "./utils/utils.js";
import routerProducts from "./routes/api/products.router.js";
import routerCarts from "./routes/api/carts.router.js";
import routerViews from './routes/web/views.router.js'
import routerTickets from "./routes/api/tickets.router.js"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import Messages from "./dao/mongo/messages.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import routerUsers from "./routes/api/user.router.js"
import cookieParser from "cookie-parser";
import "./dao/factory.js"
import config from "./config/config.js";
import errorHandler from "./middleware/errors/index.js"
import { addLogger, logger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

const productsRouter = new routerProducts()
const cartsRouter = new routerCarts()
const usersRouter = new routerUsers()
const viewsRouter = new routerViews()
const ticketsRouter = new routerTickets()

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
app.use(errorHandler);

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

app.get("/faker", async (req, res) => {
    const user = {
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    res.send(user);
});
app.get("/operacionsencilla", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    }
    res.send({ message: "Operación sencilla", result: sum });
});

app.get("/operacioncompleja", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 5e8; i++) {
        sum += i;
    }
    res.send({ message: "Operación compleja", result: sum });
});
app.get('/loggerTest', (req, res) => {
    //default levels
    req.logger.fatal('Prueba fatal');
    req.logger.error('Prueba error');
    req.logger.warning('Prueba warning');
    req.logger.info('Prueba info');
    req.logger.http('Prueba http');
    req.logger.debug('Prueba debug');
});

const port = Number(config.port)
const server = app.listen(port, () => {

    logger.info(`Server running on port ${port}`)
})

const io = new Server(server);
app.set('socketio', io);

const messageManager = new Messages();

const messages = await messageManager.getAll();

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', async data => {
        messages.push(data);
        io.emit('messageLogs', messages);
        await messageManager.save(data);
    });

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
})