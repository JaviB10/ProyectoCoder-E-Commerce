import { userModel } from "./models/user.model.js";
import { logger } from "../../utils/logger.js";

export default class Users {
    constructor() {
        logger.info("Working users with DB");
    }

    getAll = async () => {
        return await userModel.find().lean();
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