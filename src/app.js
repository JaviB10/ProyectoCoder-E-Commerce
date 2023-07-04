import express from "express";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import routerProducts from "./routes/api/products.router.js";
import routerCarts from "./routes/api/carts.router.js";
import routerViews from './routes/web/views.router.js'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import Messages from "./dao/dbManagers/messages.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import routerUsers from "./routes/api/user.router.js"
import cookieParser from "cookie-parser";

const cartsRouter = new routerCarts()
const usersRouter = new routerUsers()
const productsRouter = new routerProducts()
const viewsRouter = new routerViews()

const app = express();

try {
    console.log("entra aca");
    await mongoose.connect("mongodb+srv://javiballon07:O8m5iVRnYXnSNBvh@cluster1.er19kcj.mongodb.net/ecommerce?retryWrites=true&w=majority")
    console.log("DB connection");
} catch (error) {
    console.log(error);
}

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

app.use(`/`, viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());

const server = app.listen(8081, () => {
    console.log("Listening on 8081")
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