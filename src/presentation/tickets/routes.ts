import { Router } from "express";
import { TickectController } from "./controller";



export class TicketRoutes {

    static get Routes() {

        const router = Router();
        const ticketController = new TickectController();

        router.get( '/', ticketController.getTickets );
        router.get( '/last', ticketController.getLastTicketNumber );
        router.get( '/pending', ticketController.pendigTickets );

        router.post( '/', ticketController.createTicket );

        router.get( '/draw/:desk', ticketController.drawTicket );
        router.put( '/done/:ticketId', ticketController.ticketFinished );

        router.get( '/working-on', ticketController.workingOn );

        return router;

    }


}