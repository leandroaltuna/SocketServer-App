const currentTicketLbl = document.querySelector( 'span' );
const createTicketBtn = document.querySelector( 'button' );

const endPointBase = '/api/ticket';

async function getLastTicket() {

    const lastTicket = await fetch( `${ endPointBase }/last` ).then( resp => resp.json() );

    currentTicketLbl.innerText = lastTicket;

}

async function createTicket() {

    const newTicket = await fetch( endPointBase, {
        method: 'POST',
    }).then( resp => resp.json() );

    currentTicketLbl.innerText = newTicket.number;

}

createTicketBtn.addEventListener( 'click', createTicket );

getLastTicket();