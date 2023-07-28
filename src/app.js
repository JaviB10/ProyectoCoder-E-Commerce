import express from "express";
import __dirname from "./utils.js";
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
import { addLogger } from "./logger.js";

const productsRouter = new routerProducts()
const cartsRouter = new routerCarts()
const usersRouter = new routerUsers()
const viewsRouter = new routerViews()
const ticketsRouter = new routerTickets()

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser())
app.use(express.json())

//Passport
initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use(addLogger);
app.use(`/`, viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/api/ticket", ticketsRouter.getRouter());
app.use(errorHandler);


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
const server = app.listen(port, (req) => {
    console.log(`Server running on port ${port}`)
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