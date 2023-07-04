import { messagesModel } from "./models/messages.model.js";

export default class Messages {
    
    constructor() {
        console.log("Working messages with DB");
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