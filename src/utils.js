import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "./config/contants.js";
import { faker } from "@faker-js/faker"
import nodemailer from "nodemailer"

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
const __dirname = dirname(__filename)

export default __dirname;

