import { DTOs } from "../dao/DTOs/users.dto.js";
import { loginService, passwordLinkService, passwordResetService, registerService, verificarTokenService } from "../services/sessions.services.js";
import { getUserByEmailLoginService, getUserByEmailRegisterService } from "../services/users.services.js";
import { IncompleteValues, IncorrectLoginCredentials, IncorrectToken, UseNewPassword, UserAlreadyExists, UserNotFound } from "../utils/custom-exceptions.js";
import { logger } from "../utils/logger.js";
import { generateToken } from "../utils/utils.js";

const login = async (req, res) => {
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

const register = async (req, res) => {
    try {
        const { email } = req.body;
        await getUserByEmailRegisterService(email);
        const result = await registerService({ ...req.body });
        logger.info("Register Success")
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserAlreadyExists) {
            return res.sendClientError(error.message)
        }
        if (error instanceof IncompleteValues) {
            return res.sendClientError(error.message)
        }
        res.sendServerError(error.message);
    }
    
}

const loginGithub = async (req, res) => {
    try {
        res.sendSuccess('User registered')
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
        const result = new DTOs.UserCurrentDTO(req.user)
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
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
        if (error instanceof IncompleteValues) {
            return res.sendClientError(error.message);
        }
        if (error instanceof UseNewPassword) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const getPasswordLink = async (req, res) => {
    try {
        res.render("passwordLink")
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getPasswordReset = async (req, res) => {
    try {
        const { token = "" } = req.query
        res.render("passwordReset", { token })
    } catch (error) {
        res.sendServerError(error.message);
    }
}


const getLogin = async (req, res) => {
    try {
        if (req.cookies["coderCookieToken"]) res.redirect("/products");
        res.render("login");
    } catch (error) {
        res.sendServerError(error.message);
    }
}


const getRegister = async (req, res) => {
    try {
        if (req.cookies["coderCookieToken"]) res.redirect("/products");
        res.render("register");
    } catch (error) {
        res.sendServerError(error.message);
    }
}


const getLogueado = async (req, res) => {
    try {
        res.redirect("/login");
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    login,
    register,
    loginGithub,
    callBackGithub,
    userLogout,
    userCurrent,
    passwordLink,
    passwordReset,
    getPasswordLink,
    getPasswordReset,
    getLogin,
    getRegister,
    getLogueado
}