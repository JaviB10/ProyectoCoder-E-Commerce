import UsersDTO from "../dao/DTOs/users.dto.js";
import CustomError from "../middleware/errors/customError.js";
import EErrors from "../middleware/errors/enums.js";
import { generateUserErrorInfo } from "../middleware/errors/info.js";
import { saveCartService } from "../services/carts.services.js";
import { 
    deleteUserService,
    getUserByEmailService,
    getUserByIdService,
    getUsersService, 
    saveUserService,
    updateUserService
} from "../services/users.services.js"
import { createHash, generateToken, isValidPassword } from "../utils.js";

const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.sendSuccess(users);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getUserById = async (req, res) => {
    try {
        const { uid } = req.query;
        const user = await getUserByIdService(uid);
        res.sendSuccess(user);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const email = req.body;
        const user = await getUserByEmailService(email);
        res.sendSuccess(user);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmailService(email);
        const comparePassword = isValidPassword(user, password);
        if (!comparePassword) {
            return res.sendClientError("Incorrect credentials");
        }
        const accessToken = generateToken(user)
        return res.cookie(
            'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).sendSuccess({ accessToken });
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const registerUser = async (req, res) => {
    const { name, last_name, phone, age, email, password } = req.body;
    const user = new UsersDTO({name, last_name, phone})
    if (!name || !last_name || !age || !email || !password) {
        throw CustomError.createError({
            name: "UserError",
            cause: generateUserErrorInfo({
                name,
                last_name,
                age,
                email,
                password
            }),
            message: "Error trying to create user",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
    const exists = await getUserByEmailService(email);
    if (exists) {
        return res.sendClientError("Incomplete values");
    }    
    const hashedPassword = createHash(password);
    const newCart = await saveCartService({ products: [] });
    const newUser = {
        ...req.body,...user, cart: newCart._id
    }
    newUser.password = hashedPassword
    const result = await saveUserService(newUser);
    res.send({
        status: "success",
        payload: result
    });
}

const userCurrent = async (req,res) => {
    try {
        const result = new UsersDTO(req.user)
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { uid } = req.query;
        const user = req.body;
        const result = await updateUserService(uid, user);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { uid } = req.query;
        const result = await deleteUserService(uid);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const loginGithub = async (req, res) => {
    res.sendSuccess("User registered")
}

const callBackGithub = async (req, res) => {
    const accessToken = generateToken(req.user);
    res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    )
    res.redirect('/')
}

export {
    getUsers,
    getUserById,
    getUserByEmail,
    registerUser,
    updateUser,
    deleteUser,
    loginUser,
    loginGithub,
    callBackGithub,
    userCurrent
}