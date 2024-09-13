import ticketModel from '../models/ticket.model.js'

const createTicket = async (ticket) => {
    return await ticketModel.create(ticket)
}

export default {createTicket}