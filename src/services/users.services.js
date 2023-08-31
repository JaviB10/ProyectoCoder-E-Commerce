import { loginNotification } from "../utils/custom-html.js";
import UsersRepository from "../repositories/users.repository.js";
import { createHash, generateToken, isValidPassword, validateToken } from "../utils/utils.js";
import { sendEmail } from "./email.service.js";
import { CantSwitchRoles, IncorrectLoginCredentials, IncorrectToken, UseNewPassword, UserAlreadyExists, UserNotFound } from "../utils/custom-exceptions.js";
import { saveCartService } from "./carts.services.js";

const usersRepository = new UsersRepository();

const getUserByIdService = async (uid) => {
    const user = await usersRepository.getUserByIdRepository(uid);
    if (!user) {
        throw new UserNotFound('User not found');
    }
    return user;
}

const getUserByEmailService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    return user;
}

const getUserByEmailLoginService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    if (!user) {
        throw new UserNotFound('User not found');
    }
    return user;
}

const getUserByEmailRegisterService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    if (user) {
        throw new UserAlreadyExists('User already exists');
    }
    return user;
}

const loginService = async (password, user) => {
    const comparePassword = isValidPassword(user, password);
    if (!comparePassword) {
        throw new IncorrectLoginCredentials('Incorrect credentials')
    }
    const accessToken = generateToken(user);
    const lastConnection =  new Date();
    await usersRepository.updateUserRepository(user._id, { 'last_connection': lastConnection });
    return accessToken;
}

const registerService = async (user) => {
    const hashedPassword = createHash(user.password)
    const newCart = await saveCartService({ products: [] });
    const newUser = {
        ...user, role: "USER", cart: newCart._id
    }
    newUser.password = hashedPassword
    const result = await usersRepository.saveUserRepository(newUser);
    return result;
}

const passwordLinkService = async (user) => {
    const accessToken = generateToken(user);
    const email = {
        to: user.email,
        subject: 'Reset your password',
        html: loginNotification(accessToken)
    }
    await sendEmail(email)
    return accessToken
}

const verificarTokenService = async (token) => {
    const validate = validateToken(token)
    if (!validate) {
        throw new IncorrectToken('Access token invalidate')
    }
    const { user } = validate
    return user
}

const passwordResetService = async (user, password) => {
    const comparePassword = isValidPassword(user, password);
    if (!comparePassword) {
        throw new UseNewPassword('The password is the same as the old password')
    }
    const hashedPassword = createHash(password);
    user.password = hashedPassword
    const result = await usersRepository.updateUserRepository(user._id, user);
    return result;
}

const userToPremiumService = async (user) => {
    const newUser = user
    
    if (user.role === "ADMIN") {
        throw new CantSwitchRoles('The user has a role as ADMIN')
    } 
    const requiredDocuments = ["identificacion", "domicilio", "estadoCuenta"];
    const userDocuments = user.documents.map(document => document.name);

    const areRequiredDocumentsUploaded = requiredDocuments.every(document => userDocuments.includes(document));

    if (!areRequiredDocumentsUploaded) {
        throw new Error('The user has not uploaded all required documents');
    }
    newUser.role = user.role === "USER" ? "PREMIUM" : "USER"
    const result = await usersRepository.updateUserRepository(user._id, newUser);
    res.sendSuccess(result);
}

const updateUserService = async (cid, product) => {
    const result = await usersRepository.updateUserRepository(cid, product);
    return result;
}
export {
    getUserByIdService,
    getUserByEmailService,
    getUserByEmailLoginService,
    getUserByEmailRegisterService,
    loginService,
    passwordLinkService,
    verificarTokenService,
    passwordResetService,
    registerService,
    userToPremiumService,
    updateUserService
}