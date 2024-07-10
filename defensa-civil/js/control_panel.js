import { completeSelectOptions, generateEventsList, showMessageModal } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __SEARCH_URL__ = `http://localhost:${SERVER_PORT}/events`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/tipo_evento.json`;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/calles_tandil.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/derivacion.json`;


document.addEventListener("DOMContentLoaded", () => {  
    if (window.location.pathname === '/defensa-civil/eventos/control_panel.html') {
        fetch(`http://localhost:${SERVER_PORT}/protected` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => { 
            console.log('response: ', response);               
            if (!response.ok) {
                console.log('Access denied');
                showMessageModal('Acceso denegado');
                document.getElementById('msg-modal-close').addEventListener('click', () => {
                    window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`; 
                });                
            } 
        }).catch(error => {
            console.error('Error:', error);
        });
    }
    
    const searchAllBtn = document.getElementById('search-all-btn');
    searchAllBtn.addEventListener('click', async (e) => {
        e.preventDefault();        
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        try {
            const response = await searchEvents(__SEARCH_URL__);     
            generateEventsList(response);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
    });

    const searchByEventType = document.getElementById('search-by-event-type');
    searchByEventType.addEventListener('click', async (e) => {
        e.preventDefault();
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Buscar eventos por tipo';
        document.getElementById('card-text').innerHTML = 'Seleccione un tipo de evento para buscar registros.';
        const container = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'event-form';
        card.innerHTML = `
            <form id="search-event-type-form">
                <div class="form-group">
                    <label for="event-type">Tipo de evento:</label>
                    <select class="form-control" id="event-type" required>                        
                    </select>
                </div>
                <button type="button" class="btn btn-primary" id="search-event-type-btn">Buscar</button>
            </form>
        `;
        container.appendChild(card);

        const events_types = document.querySelectorAll('#event-type');
        completeSelectOptions(events_types, __EVENTS_TYPES__);
    
        const searchEventTypeBtn = document.getElementById('search-event-type-btn');
        searchByFunction(searchEventTypeBtn, 'event-type', 'type');
    }); 

    const searchByDerivation = document.getElementById('search-by-derivation');
    searchByDerivation.addEventListener('click', async (e) => {
        e.preventDefault();
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Buscar eventos por derivacion';
        document.getElementById('card-text').innerHTML = 'Seleccione a quien se derivo para buscar registros.';
        const container = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'event-form';
        card.innerHTML = `
            <form id="search-derivation-form">
                <div class="form-group">
                    <label for="event-type">Derivacion:</label>
                    <select class="form-control" id="derivation" required>                        
                    </select>
                </div>
                <button type="button" class="btn btn-primary" id="search-event-derivation-btn">Buscar</button>
            </form>
        `;
        container.appendChild(card);

        const derivationList = document.querySelectorAll('#derivation');
        completeSelectOptions(derivationList, __DERIVATION_TYPES__);

        const searchDerivationBtn = document.getElementById('search-event-derivation-btn');
        searchByFunction(searchDerivationBtn, 'derivation', 'derivation');        
    });

    const searchByStreet = document.getElementById('search-by-street');
    searchByStreet.addEventListener('click', async (e) => {
        e.preventDefault();
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Buscar eventos por calle';
        document.getElementById('card-text').innerHTML = 'Seleccione la calle para buscar registros.';
        const container = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'event-form';
        card.innerHTML = `
            <form id="search-event-street-form">
                <div class="form-group">
                    <label for="event-type">Calle del evento:</label>
                    <select class="form-control" id="street-list" required>                        
                    </select>
                </div>
                <button type="button" class="btn btn-primary" id="search-event-street-btn">Buscar</button>
            </form>
        `;
        container.appendChild(card);

        const streetList = document.querySelectorAll('#street-list');
        completeSelectOptions(streetList, __STREETS_LIST__);

        const searchStreetBtn = document.getElementById('search-event-street-btn');
        searchByFunction(searchStreetBtn, 'street-list', 'street') ;
    });

    const searchByDate = document.getElementById('search-by-date');
    searchByDate.addEventListener('click', async (e) => {
        e.preventDefault();
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Buscar eventos por fecha';
        document.getElementById('card-text').innerHTML = 'Seleccione la fecha para buscar registros.';
        const container = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'event-form';
        card.innerHTML = `
            <form id="search-date-form">
                <div class="form-group">
                    <label for="event-type">Fecha del evento:</label>
                    <div class="form-group">
                        <input type="date" id="search-date"></input>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" id="search-event-date-btn">Buscar</button>
            </form>
        `;
        container.appendChild(card);
    
        const searchDateBtn = document.getElementById('search-event-date-btn');
        searchByFunction(searchDateBtn, 'search-date', 'date');
    });

    const searchByDateRange = document.getElementById('search-by-date-range');
    searchByDateRange.addEventListener('click', async (e) => {
        e.preventDefault();
        if (document.getElementById('close-btn'))
            document.getElementById('close-btn').remove();
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Buscar eventos entre fechas';
        document.getElementById('card-text').innerHTML = 'Seleccione las fechas para buscar registros.';
        const container = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'event-form';
        card.innerHTML = `
            <form id="search-date-range-form">
                <div class="form-group">
                    <label for="event-type">Fechas posibles del evento:</label>
                    <div class="form-group">
                        <label for="event-type">Desde:</label>
                        <input type="date" id="search-before"></input>
                        <label for="event-type">Hasta:</label>
                        <input type="date" id="search-after"></input>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" id="search-event-date-range-btn">Buscar</button>
            </form>
        `;
        container.appendChild(card);
    
        const searchDateBtn = document.getElementById('search-event-date-range-btn');
        searchByRangeFunction(searchDateBtn, 'search-before', 'search-after');
    });
});

function searchByRangeFunction(btnId, inputId1, inputId2) {
    btnId.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputValue1 = document.getElementById(`${inputId1}`).value;
        const inputValue2 = document.getElementById(`${inputId2}`).value;
        const dataUrl = `${__SEARCH_URL__}?date1=${inputValue1}&date2=${inputValue2}`;
        const response = await searchEvents(dataUrl);
        generateEventsList(response);
    });
}

function searchByFunction(btnId, inputId, dbColumn) {
    btnId.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputValue = document.getElementById(`${inputId}`).value;
        const dataUrl = `${__SEARCH_URL__}?${dbColumn}=${inputValue}`;
        const response = await searchEvents(dataUrl);
        generateEventsList(response);
    });
}

async function searchEvents(dataUrl) {
    try {        
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        const data = await response.json();
        return data; // Retorna los datos como un array de objetos
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return []; // Retorna un array vacío en caso de error
    }
}





