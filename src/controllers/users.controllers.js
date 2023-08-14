import UsersDTO from "../dao/DTOs/users.dto.js";
import {
    getUserByEmailLoginService,
    getUserByEmailRegisterService,
    getUserByIdService,
    loginService,
    passwordLinkService,
    passwordResetService,
    registerService,
    userToPremiumService,
    verificarTokenService
} from "../services/users.services.js"
import { generateToken } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { CantSwitchRoles, IncorrectLoginCredentials, IncorrectToken, UseNewPassword, UserAlreadyExists, UserNotFound } from "../utils/custom-exceptions.js";


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmailLoginService(email);
        const accessToken = await loginService(password, user);
        logger.info("Login Success")
        return res.cookie(
            'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).send({ 
            status: "success",
            payload: accessToken 
        });
    } catch (error) {
        if (error instanceof UserNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof IncorrectLoginCredentials) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, last_name, phone, age, email, password } = req.body;
        if (!name || !last_name || !phone || !age || !email || !password) {
            return res.sendClientError('Incomplete values')
        }
        await getUserByEmailRegisterService(email);
        const result = await registerService({ ...req.body });
        logger.info("Register Success")
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserAlreadyExists) {
            return res.sendClientError('User already exists')
        }
        res.sendServerError(error.message);
    }
    const user = new UsersDTO({ name, last_name, phone, age, email, password })
}

const passwordLink = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmailLoginService(email);
        const accessToken = await passwordLinkService(user);
        res.sendSuccess({ accessToken });
    } catch (error) {
        if (error instanceof UserNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const passwordReset = async (req, res) => {
    try {
        const { password, token } = req.body;
        const user = await verificarTokenService(token);
        if (user) {
            const result = await passwordResetService(user, password)
            res.sendSuccess(result);
        }
    } catch (error) {
        if (error instanceof IncorrectToken) {
            return res.sendClientError(error.message);
        }
        if (error instanceof UseNewPassword) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const userToPremium = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await getUserByIdService(uid);
        const result = await userToPremiumService(user)
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantSwitchRoles) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const userLogout = (req, res) => {
    try {
        logger.info('access token deleted successfully');
        res.clearCookie("coderCookieToken").redirect('/login')
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

const loginGithub = async (req, res) => {
    try {
        res.sendSuccess("User registered")
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const callBackGithub = async (req, res) => {
    try {
        const accessToken = generateToken(req.user);
    res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    )
    res.redirect('/')
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getPasswordLink = async (req, res) => {
    try {
        res.render("password-link")
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getPasswordReset = async (req, res) => {
    try {
        const { token = "" } = req.query
    res.render("password-reset", { token })
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    loginUser,
    registerUser,
    passwordLink,
    passwordReset,
    userToPremium,
    userLogout,
    userCurrent,
    loginGithub,
    callBackGithub,
    getPasswordLink,
    getPasswordReset
}