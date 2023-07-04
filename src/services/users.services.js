import { USERSDAO } from "../dao/index.js";

const getUsersService = async () => {
    const users = await USERSDAO.getAll();
    return users;
}

const getUserByIdService = async (uid) => {
    const user = await USERSDAO.getUserById(uid);
    return user;
}

const getUserByEmailService = async (email) => {
    const user = await USERSDAO.getUserByEmail(email);
    return user;
}

const saveUserService = async (user) => {
    const result = await USERSDAO.save(user);
    return result;
}

const updateUserService = async (uid, user) => {
    const result = await USERSDAO.update(uid, user);
    return result;
}

const deleteUserService = async (uid) => {
    const result = await USERSDAO.delete(uid);
    return result;
}

export {
    getUsersService,
    getUserByIdService,
    getUserByEmailService,
    saveUserService,
    updateUserService,
    deleteUserService
}