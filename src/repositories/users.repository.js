import { USERSDAO } from "../dao/factory.js";

export default class UsersRepository {
    constructor() {
        this.dao = USERSDAO;
    }

    getUsersRepository = async () => {
        const users = await this.dao.getAll();
        return users;
    }
    
    getUserByIdRepository = async (uid) => {
        const user = await this.dao.getUserById(uid);
        return user;
    }
    
    getUserByEmailRepository = async (email) => {
        const user = await this.dao.getUserByEmail(email);
        return user;
    }
    
    saveUserRepository = async (user) => {
        const result = await this.dao.save(user);
        return result;
    }
    
    updateUserRepository = async (uid, user) => {
        const result = await this.dao.update(uid, user);
        return result;
    }
    
    deleteUserRepository = async (uid) => {
        const result = await this.dao.delete(uid);
        return result;
    }
}