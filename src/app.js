import express from "express";
import __dirname from "./utils.js";
import routerProducts from "./routes/api/products.router.js";
import routerCarts from "./routes/api/carts.router.js";
import routerViews from './routes/web/views.router.js'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Messages from "./dao/dbManagers/messages.js";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))
app.use(express.json())

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use(`/`, routerViews);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use(cookieParser("Coder39760"));
app.use(session({
    secret: "secretCoder", resave: true, saveUninitialized: true
}))

app.get("/c", (req, res) => {
    res.render("cookies");
})
app.post("/cookie", (req, res) => {
    const data = req.body;
    res.cookie("CoderCookie", data, { maxAge: 10000 }).send({ status: "success", message: "cookie set" })
})

app.get("/set-cookies", (req, res) => {
    res.cookie("CoderCookie", "Esta es una cookie seteada", { maxAge: 30000 }).send("Cookie seteada");
})
app.get("/cookies", (req, res) => {
    res.send(req.cookies);
})

app.get("/delete-cookies", (req, res) => {
    res.clearCookie("CoderCookie").send("Cookie removida");
})

app.get("/set-signed-cookie", (req, res) => {
    res.cookie("CoderSignedCookie", "Esta es una cookie muy poderosa", { maxAge: 30000, signed: true }).send("Cookie firmada")
})

app.get("/signed-cookies", (req, res) => {
    res.send(req.signedCookies);
})

app.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!")
    }
})
app.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if (!err) res.send("Ok")
        else res.send({ status: "Error", error: err })
    })
})
app.get("/login", (req, res) => {
    const { username, password } = req.body;
    if (username !== "pepe" || password !== "pepepass") {
        return res.send("login false")
    }
    req.session.username = username
    req.session.admin = true
    res.send("login success!")
})
function auth (req, res, next) {
    if (req.session?.username === "pepe" && req.session?.admin){
        return next();
    }
    return res.status(401).send("error de autenticacion")
}
app.get("/privado", auth, (req, res) => {
    res.send("Estas logueado")
})

try {
    await mongoose.connect("mongodb+srv://javiballon07:8741236578952Javi@cluster1.er19kcj.mongodb.net/ecommerce?retryWrites=true&w=majority")
    console.log("DB connection");
} catch (error) {
    console.log(error);
}

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