import { TICKETSDAO } from "../dao/factory.js"

export default class TicketsRepository {
    constructor() {
        this.dao = TICKETSDAO;
    }
    
    saveTicketRepository = async (ticket) => {
        const result = await this.dao.save(ticket)
        return result;
    }
}