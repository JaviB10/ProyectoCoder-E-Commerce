import { userModel } from "./models/user.model.js";
import { logger } from "../../logger.js";

export default class Users {
    constructor() {
        logger.info("Working users with DB");
    }

    getAll = async () => {
        return await userModel.find().lean();
    }

    getAllPaginate = async (limit, page) => {
        return await userModel.paginate({}, { limit, page, lean: true})
    }

    getUserById = async (uid) => {
        return await userModel.findOne({_id:uid}).lean();
    }

    getUserByEmail = async (email) => {
        return await userModel.findOne({email}).lean();
    }

    save = async (user) => {
        return await userModel.create(user);
    }

    update = async (uid, user) => {
        return await userModel.updateOne({_id:uid}, user);
    }

    delete = async (uid) => {
        return await userModel.deleteOne({_id:uid});
    }
}