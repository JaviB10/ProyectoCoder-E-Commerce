import { saveTicketService } from "../services/tickets.services.js";

const saveTicket = async (req, res) => {
    try {
        const result = await saveTicketService();
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    saveTicket
}