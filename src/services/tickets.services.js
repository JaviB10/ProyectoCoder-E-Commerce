import TicketsRepository from "../repositories/tickets.repository.js";

const ticketsRepository = new TicketsRepository();

const saveTicketService = async (ticket) => {
    const result = await ticketsRepository.saveTicketRepository(ticket);
    return result;
}

export {
    saveTicketService
}