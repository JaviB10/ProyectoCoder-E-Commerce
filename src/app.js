import express from "express";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import routerProducts from "./routes/api/products.router.js";
import routerCarts from "./routes/api/carts.router.js";
import routerViews from './routes/web/views.router.js'
import routerSessions from "./routes/api/sessions.router.js"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import Messages from "./dao/dbManagers/messages.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express();

try {
    await mongoose.connect("mongodb+srv://javiballon07:8741236578952Javi@cluster1.er19kcj.mongodb.net/ecommerce?retryWrites=true&w=majority")
    console.log("DB connection");
} catch (error) {
    console.log(error);
}

app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))
app.use(express.json())

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 60
    }),
    secret: "secretCoder", 
    resave: true, 
    saveUninitialized: true
}))

//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use(`/`, routerViews);
app.use('/api/sessions', routerSessions);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

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