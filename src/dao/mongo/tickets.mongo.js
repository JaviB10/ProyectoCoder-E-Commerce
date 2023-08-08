import { ticketModel } from "./models/tickets.model.js"; 
import { logger } from "../../logger.js";

export default class Tickets {
    constructor() {
        logger.info('Working tickets with DB');
    }
    save = async (ticket) => {
        return await ticketModel.create(ticket);
    }
}