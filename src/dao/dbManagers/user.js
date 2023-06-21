import { userModel } from "../models/user.model.js";

export default class Users {
    constructor() {
        console.log("Working users with DB");
    }

    getAll = async () => {
        const users = await userModel.find().lean();
        return users
    }

    getAllPaginate = async (limit, page) => {
        const users = await userModel.paginate({}, { limit, page, lean: true})
        return users
    }

    getUserById = async (id) => {
        const result = await userModel.findOne({_id:id}).lean();
        return result;
    }

    getUserByEmail = async (email) => {
        const result = await userModel.findOne({email}).lean();
        return result;
    }

    save = async (user) => {
        const result = await userModel.create(user);
        return result;
    }

    update = async (id, user) => {
        const result = await userModel.updateOne({_id:id}, user);
        return result;
    }
}