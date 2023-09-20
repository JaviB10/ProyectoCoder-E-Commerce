import { fileURLToPath } from "url";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from '../config/contants.js';
import { faker } from "@faker-js/faker"
import nodemailer from "nodemailer"
import multer from 'multer'

faker.locale = "es";

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(10),
        price: faker.commerce.price(),
        status: true,
        category: faker.commerce.department(),
        stock: faker.random.numeric(1),
        thumbnail: faker.image.image(),
        id: faker.database.mongodbObjectId()
    }
}

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" })
    return token
}

export const generateTokenPassword = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" })
    return token
}

export const validateToken = (token) => {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    return decoded;
};

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: "javi4195@gmail.com",
        pass: "wxsjoypljufoltta"
    }
})

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __mainDirname = path.join(__dirname, "..")

export default __mainDirname;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        switch (file.fieldname) {
            case "profile":
                cb(null, `${__mainDirname}/public/files/profiles`);
                break;
            case "product":
                cb(null, `${__mainDirname}/public/files/products`);
                break;
            case "idCard":
                cb(null, `${__mainDirname}/public/files/documents`);
                break;    
            case "address":
                cb(null, `${__mainDirname}/public/files/documents`);
                break;   
            case "accountStatus":
                cb(null, `${__mainDirname}/public/files/documents`);
                break;    
            default:
                break;
        }  
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err)
        next()
    }
}) 
