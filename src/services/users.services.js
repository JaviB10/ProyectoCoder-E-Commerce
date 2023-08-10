import { loginNotification } from "../custom-html.js";
import UsersRepository from "../repositories/users.repository.js";
import { createHash, generateToken, isValidPassword, validateToken } from "../utils.js";
import { sendEmail } from "./email.service.js";

const usersRepository = new UsersRepository();

const getUsersService = async () => {
    const users = await usersRepository.getUsersRepository();
    return users;
}

const getUserByIdService = async (uid) => {
    const user = await usersRepository.getUserByIdRepository(uid);
    return user;
}

const getUserByEmailService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    return user;
}

const saveUserService = async (user) => {
    const result = await usersRepository.saveUserRepository(user);
    return result;
}

const updateUserService = async (uid, user) => {
    const result = await usersRepository.updateUserRepository(uid, user);
    return result;
}

const deleteUserService = async (uid) => {
    const result = await usersRepository.deleteUserRepository(uid);
    return result;
}

const login = async (password, user) => {
    const comparePassword = isValidPassword(user, password);

    if (!comparePassword) {
        throw new IncorrectLoginCredentials('incorrect credentials')
    }

    const accessToken = generateToken(user);

    const email = {
        to: user.email,
        subject: 'Intento de login',
        html: loginNotification
    }
    await sendEmail(email)
    return accessToken;
}

const passwordLinkService = async (user) => {
    const accessToken = generateToken(user);

    const email = {
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        html: loginNotification(accessToken)
    }

    await sendEmail(email)

    return accessToken
}

const verificarTokenService = async (token) => {
    const validate = validateToken(token)
    const { user } = validate
    return user
}

const passwordResetService = async (user, password) => {
    const comparePassword = isValidPassword(user, password);

    if (comparePassword) {
        throw Error
    }
    const hashedPassword = createHash(password);
    user.password = hashedPassword
    await updateUserService(user._id, user)
}

export {
    getUsersService,
    getUserByIdService,
    getUserByEmailService,
    saveUserService,
    updateUserService,
    deleteUserService,
    login,
    passwordLinkService,
    verificarTokenService,
    passwordResetService
}