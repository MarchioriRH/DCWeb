import { completeSelectOptions, generateEventsList, initializeControlPanel, searchByEventId, searchByRangeFunction, searchAllEvents } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __SEARCH_URL__ = `http://localhost:${SERVER_PORT}/events`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/tipo_evento.json`;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/calles_tandil.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/derivacion.json`;


document.addEventListener("DOMContentLoaded", async () => {
    await initializeControlPanel();

    const searchConfig = [
        {
            buttonId: 'search-all-btn',
            handler: searchAllEvents
        },
        {
            buttonId: 'search-by-event-type',
            title: 'Buscar eventos por tipo',
            text: 'Seleccione un tipo de evento para buscar registros.',
            formHtml: generateSelectFormHtml('event-type', 'Tipo de evento:', 'search-event-type-btn'),
            selectId: 'event-type',
            selectUrl: __EVENTS_TYPES__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'type')
        },
        {
            buttonId: 'search-by-derivation',
            title: 'Buscar eventos por derivacion',
            text: 'Seleccione a quien se derivo para buscar registros.',
            formHtml: generateSelectFormHtml('derivation', 'Derivacion:', 'search-event-derivation-btn'),
            selectId: 'derivation',
            selectUrl: __DERIVATION_TYPES__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'derivation')
        },
        {
            buttonId: 'search-by-street',
            title: 'Buscar eventos por calle',
            text: 'Seleccione la calle para buscar registros.',
            formHtml: generateSelectFormHtml('street-list', 'Calle del evento:', 'search-event-street-btn'),
            selectId: 'street-list',
            selectUrl: __STREETS_LIST__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'street')
        },
        {
            buttonId: 'search-by-date',
            title: 'Buscar eventos por fecha',
            text: 'Seleccione la fecha para buscar registros.',
            formHtml: generateDateFormHtml('search-date', 'Fecha del evento:', 'search-event-date-btn'),
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'date')
        },
        {
            buttonId: 'search-by-date-range',
            title: 'Buscar eventos entre fechas',
            text: 'Seleccione las fechas para buscar registros.',
            formHtml: generateDateRangeFormHtml('search-before', 'Desde:', 'search-after', 'Hasta:', 'search-event-date-range-btn'),
            searchFunction: (btn, beforeId, afterId) => searchByRangeFunction(btn, beforeId, afterId)
        }
    ];

    searchConfig.forEach(config => registerSearchEvent(config));
});

function registerSearchEvent({ buttonId, handler, title, text, formHtml, selectId, selectUrl, searchFunction }) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        removeCloseButton();
        clearCardContainer();
        if (handler) {
            await handler();
        } else {
            setupSearchForm(title, text, formHtml, selectId, selectUrl, searchFunction);
        }
    });
}

async function searchAllEvents() {
    try {
        const response = await searchEvents(__SEARCH_URL__);
        generateEventsList(response);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    }
}

function removeCloseButton() {
    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) closeBtn.remove();
}

function clearCardContainer() {
    document.getElementById('card-container').innerHTML = '';
    document.getElementById('card-title').innerHTML = '';
    document.getElementById('card-text').innerHTML = '';
}

function setupSearchForm(title, text, formHtml, selectId, selectUrl, searchFunction) {
    document.getElementById('card-title').innerHTML = title;
    document.getElementById('card-text').innerHTML = text;

    const container = document.getElementById('card-container');
    const card = document.createElement('div');
    card.className = 'event-form';
    card.innerHTML = formHtml;
    container.appendChild(card);

    if (selectId && selectUrl) {
        const selectElements = document.querySelectorAll(`#${selectId}`);
        completeSelectOptions(selectElements, selectUrl);
    }

    const searchBtn = document.getElementById(`${selectId}-btn`);
    if (searchFunction) searchFunction(searchBtn, selectId);
}

function generateSelectFormHtml(selectId, label, btnId) {
    return `
        <form>
            <div class="form-group">
                <label for="${selectId}">${label}</label>
                <select class="form-control" id="${selectId}" required></select>
            </div>
            <button type="button" class="btn btn-primary" id="${btnId}">Buscar</button>
        </form>
    `;
}

function generateDateFormHtml(inputId, label, btnId) {
    return `
        <form>
            <div class="form-group">
                <label for="${inputId}">${label}</label>
                <input type="date" class="form-control" id="${inputId}" required>
            </div>
            <button type="button" class="btn btn-primary" id="${btnId}">Buscar</button>
        </form>
    `;
}

function generateDateRangeFormHtml(beforeId, beforeLabel, afterId, afterLabel, btnId) {
    return `
        <form>
            <div class="form-group">
                <label for="${beforeId}">${beforeLabel}</label>
                <input type="date" class="form-control" id="${beforeId}" required>
                <label for="${afterId}">${afterLabel}</label>
                <input type="date" class="form-control" id="${afterId}" required>
            </div>
            <button type="button" class="btn btn-primary" id="${btnId}">Buscar</button>
        </form>
    `;
}



// function searchByRangeFunction(btnId, inputId1, inputId2) {
//     btnId.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const inputValue1 = document.getElementById(`${inputId1}`).value;
//         const inputValue2 = document.getElementById(`${inputId2}`).value;
//         const dataUrl = `${__SEARCH_URL__}?date1=${inputValue1}&date2=${inputValue2}`;
//         const response = await searchEvents(dataUrl);
//         generateEventsList(response);
//     });
// }

// function searchByFunction(btnId, inputId, dbColumn) {
//     btnId.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const inputValue = document.getElementById(`${inputId}`).value;
//         const dataUrl = `${__SEARCH_URL__}?${dbColumn}=${inputValue}`;
//         const response = await searchEvents(dataUrl);
//         generateEventsList(response);
//     });
// }

// async function searchEvents(dataUrl) {
//     try {        
//         const response = await fetch(dataUrl);
//         if (!response.ok) {
//             throw new Error('Network response was not ok' + response.statusText);
//         }
//         const data = await response.json();
//         return data; // Retorna los datos como un array de objetos
//     } catch (error) {
//         console.error('Error al obtener los eventos:', error);
//         return []; // Retorna un array vacío en caso de error
//     }
// }

//export { searchByEventId };



