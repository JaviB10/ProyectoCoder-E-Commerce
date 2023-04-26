import express from "express";
import routerProducts from "./routes/api/products.router.js";
import routerViews from './routes/web/views.router.js'
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))
app.use(express.json())

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use(`/`, routerViews);
app.use("/api/products", routerProducts);

const server = app.listen(8081, () => {
    console.log("Listening on 8081")
})
const io = new Server(server);
app.set('socketio', io);

io.on('connection', socket =>{
    console.log('Nuevo cliente conectado');
})