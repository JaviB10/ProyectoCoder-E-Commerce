import UsersRepository from "../repositories/users.repository.js";

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

export {
    getUsersService,
    getUserByIdService,
    getUserByEmailService,
    saveUserService,
    updateUserService,
    deleteUserService
}