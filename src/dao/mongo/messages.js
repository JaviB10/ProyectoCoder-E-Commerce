import { messagesModel } from "./models/messages.model.js";
import { logger } from "../../utils/logger.js";

export default class Messages {
    constructor() {
        logger.info("Working messages with DB");
    }

    getAll = async () => {
        const carts = await messagesModel.find().lean();
        return carts
    }

    save = async (message) => {
        const result = await messagesModel.create(message);
        return result;
    }
}