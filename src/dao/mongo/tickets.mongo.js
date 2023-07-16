import { ticketModel } from "./models/tickets.model.js"; 

export default class Tickets {
    constructor() {
        console.log('Working tickets with DB');
    }
    save = async (ticket) => {
        return await ticketModel.create(ticket);
    }
}