const endPointBase = '/api/ticket';
const lblPending = document.querySelector( '#lbl-pending' );
const deskHeader = document.querySelector( 'h1' ); // obtiene el primer h1 del html
const noMoreAlert = document.querySelector( '.alert' );
const lblCurrentTicket = document.querySelector( 'small' );

const btnDraw = document.querySelector( '#btn-draw' );
const btnDone = document.querySelector( '#btn-done' );

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has( 'escritorio' ) ) {
    
    window.location = 'index.html';// lo retorna a la pagina principal.
    throw new Error( 'Escritorio es requerido' );

}

const deskNumber = searchParams.get( 'escritorio' );
let workingTicket = null;

deskHeader.innerText = deskNumber;


function checkTicketCount( currentCount = 0 ) {
    
    if ( currentCount === 0 ) {
        noMoreAlert.classList.remove( 'd-none' );
    } else {
        noMoreAlert.classList.add( 'd-none' );
    }

    lblPending.innerHTML = currentCount;

}


async function loadInitialCount() {
    
    const pendingTickets = await fetch( `${ endPointBase }/pending` ).then( resp => resp.json() );
    checkTicketCount( pendingTickets.length );

}

async function getNextTicket() {

    await finishTicket();

    const { status, ticket, message } = await fetch( `${ endPointBase }/draw/${ deskNumber }` ).then( res => res.json() );
    
    if ( status === 'error' ) {
        lblCurrentTicket.innerText = message;
        return;
    }

    workingTicket = ticket;
    lblCurrentTicket.innerText = ticket.number;

}

async function finishTicket() {

    if ( !workingTicket ) return;
    
    const { status, message } = await fetch( `${ endPointBase }/done/${ workingTicket.id }`, { method: 'PUT' } ).then( res => res.json() );

    console.log({ status, message });
    if ( status === 'ok' ) {
        workingTicket = null;
        lblCurrentTicket.innerText = 'Nadie';
    }

}


function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );

    socket.onmessage = ( event ) => {
        // console.log(event.data);
        const { type, payload } = JSON.parse(  event.data );
        if ( type !== 'on-ticket-count-changed' ) return;
        checkTicketCount( payload );

    };

    socket.onclose = ( event ) => {

        console.log( 'Connection closed' );
        setTimeout( () => {
            console.log( 'retrying to connect' );
            connectToWebSockets();
        }, 1500 );

    };

    socket.onopen = ( event ) => {
        console.log( 'Connected' );
    };

}


//Listeners
btnDraw.addEventListener( 'click', getNextTicket );
btnDone.addEventListener( 'click', finishTicket );


// Init
loadInitialCount();
connectToWebSockets();