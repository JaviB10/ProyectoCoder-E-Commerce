import UsersDTO from "../dao/DTOs/users.dto.js";
import CustomError from "../middleware/errors/customError.js";
import EErrors from "../middleware/errors/enums.js";
import { generateUserErrorExist, generateUserErrorInfo, generateUserErrorNotExist, generateUserErrorPassword } from "../middleware/errors/info.js";
import { saveCartService } from "../services/carts.services.js";
import {
    deleteUserService,
    getUserByEmailService,
    getUserByIdService,
    getUsersService,
    login,
    resetPasswordService,
    saveUserService,
    updateUserService
} from "../services/users.services.js"
import { createHash, generateToken, isValidPassword } from "../utils.js";
import { logger } from "../logger.js";

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
    const { email, password } = req.body;
    const user = await getUserByEmailService(email);
    if (!user) {
        logger.error("No se encontro al usuario")
        throw CustomError.createError({
            name: "UserError",
            cause: generateUserErrorNotExist({
                email
            }),
            message: "Error trying to login",
            code: EErrors.USER_NOT_FOUND
        })
    }

    const accessToken = await login(password, user);

    logger.info("Usuario correcto")
    return res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    ).send({ 
        status: "success",
        payload: accessToken 
    });
}
const resetPass = async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmailService(email);
    if (!user) {
        logger.error("No se encontro al usuario")
        throw CustomError.createError({
            name: "UserError",
            cause: generateUserErrorNotExist({
                email
            }),
            message: "Error trying to login",
            code: EErrors.USER_NOT_FOUND
        })
    }
    const accessToken = await resetPasswordService(user);
    res.sendSuccess({ accessToken });
}

const registerUser = async (req, res) => {
    const { name, last_name, phone, age, email, password } = req.body;
    const user = new UsersDTO({ name, last_name, phone, age, email, password })

    if (!name || !last_name || !age || !email || !password) {
        logger.error("No se recibieron todos los datos necesarios")
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
        logger.warning("El email ingresado ya se encuentra registrado")
        throw CustomError.createError({
            name: "UserError",
            cause: generateUserErrorExist({
                email
            }),
            message: "Error trying to create user",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
    const hashedPassword = createHash(password);
    const newCart = await saveCartService({ products: [] });
    const newUser = {
        ...req.body, cart: newCart._id
    }
    
    newUser.password = hashedPassword
    const result = await saveUserService(newUser);
    logger.info("El usuario se registro correctamente")
    res.send({
        status: "success",
        payload: result
    });
}
const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmailService(email);
        const comparePassword = isValidPassword(user, password);

        if (comparePassword) {
            throw Error
        }

        const hashedPassword = createHash(password);
        user.password = hashedPassword
        const uid = user._id
        const result = await updateUserService(uid, user)
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}
const userCurrent = async (req, res) => {
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

const getResetPassword = async (req, res) => {
    res.render("reset")
}
const getReset = async (req, res) => {
    res.render("reset-password")
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
    userCurrent,
    getResetPassword,
    resetPass,
    getReset,
    updatePassword
}