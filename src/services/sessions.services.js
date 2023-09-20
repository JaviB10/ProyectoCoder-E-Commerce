import { DTOs } from "../dao/DTOs/users.dto.js";
import UsersRepository from "../repositories/users.repository.js";
import { IncompleteValues, IncorrectLoginCredentials, IncorrectToken, UseNewPassword } from "../utils/custom-exceptions.js";
import { resetPassword } from "../utils/custom-html.js";
import { createHash, generateToken, isValidPassword, validateToken } from "../utils/utils.js";
import { saveCartService } from "./carts.services.js";
import { sendEmail } from "./email.service.js";

const usersRepository = new UsersRepository();

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
    if (!user.name || !user.last_name || !user.phone || !user.age || !user.email || !user.password) {
        throw new IncompleteValues('The user has not provided all the required values')
    }
    const userDTO = new DTOs.UsersDTO({ ...user })
    const hashedPassword = createHash(user.password)
    const newCart = await saveCartService({ products: [] });
    const newUser = {
        ...userDTO, cart: newCart._id
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
        html: resetPassword(accessToken)
    }
    await sendEmail(email)
    return accessToken
}

const passwordResetService = async (user, password) => {
    if (password.length === 0) {
        throw new IncompleteValues('The user has not entered any password')
    }
    const comparePassword = isValidPassword(user, password);
    if (comparePassword) {
        throw new UseNewPassword('The password is the same as the old password')
    }
    const hashedPassword = createHash(password);
    user.password = hashedPassword
    const result = await usersRepository.updateUserRepository(user._id, user);
    return result;
}

const verificarTokenService = async (token) => {
    const validate = validateToken(token)
    if (!validate) {
        throw new IncorrectToken('Access token invalidate')
    }
    const { user } = validate
    return user
}

export {
    loginService,
    registerService,
    passwordLinkService,
    passwordResetService,
    verificarTokenService
}