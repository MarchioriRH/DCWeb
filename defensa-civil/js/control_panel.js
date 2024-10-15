import { completeSelectOptions, generateEventsList, searchAllEvents, verifyAccessToken, searchEvents } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __SEARCH_URL__ = `http://localhost:${SERVER_PORT}/events`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/tipo_evento.json`;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/calles_tandil.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/derivacion.json`;
const __CONTROL_PANEL_PATH_NAME__ = '/defensa-civil/eventos/control_panel.html';



document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem('token')) {
        return;
    }

    window.history.replaceState(null, '', '/defensa-civil/eventos/control_panel)');
    verifyAccessToken(__CONTROL_PANEL_PATH_NAME__);

    const searchConfig = [
        {
            buttonId: 'search-all-btn',
            handler: searchAllEvents
        },
        {
            buttonId: 'search-by-type',
            title: 'Buscar eventos por tipo',
            text: 'Seleccione un tipo de evento para buscar registros.',
            formHtml: generateSelectFormHtml('search-type', 'Tipo de evento:', 'search-by-type-btn'),
            selectId: 'type',
            selectUrl: __EVENTS_TYPES__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'type')
        },
        {
            buttonId: 'search-by-derivation',
            title: 'Buscar eventos por derivacion',
            text: 'Seleccione a quien se derivo para buscar registros.',
            formHtml: generateSelectFormHtml('search-derivation', 'Derivacion:', 'search-by-derivation-btn'),
            selectId: 'derivation',
            selectUrl: __DERIVATION_TYPES__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'derivation')
        },
        {
            buttonId: 'search-by-street',
            title: 'Buscar eventos por calle',
            text: 'Seleccione la calle para buscar registros.',
            formHtml: generateSelectFormHtml('search-street', 'Calle del evento:', 'search-by-street-btn'),
            selectId: 'street',
            selectUrl: __STREETS_LIST__,
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'street')
        },
        {
            buttonId: 'search-by-date',
            title: 'Buscar eventos por fecha',
            selectId: 'date',
            text: 'Seleccione la fecha para buscar registros.',
            formHtml: generateDateFormHtml('search-date', 'Fecha del evento:', 'search-by-date-btn'),
            searchFunction: (btn, inputId) => searchByFunction(btn, inputId, 'date')
        },
        {
            buttonId: 'search-by-date-range',
            title: 'Buscar eventos entre fechas',
            selectId: 'date-range',
            text: 'Seleccione las fechas para buscar registros.',
            btn: 'search-by-date-range-btn',
            beforeId: 'search-before',
            afterId: 'search-after',
            formHtml: generateDateRangeFormHtml('search-before', 'Desde:', 'search-after', 'Hasta:', 'search-by-date-range-btn'),
            searchFunction: (btn, beforeId, afterId) => searchByRangeFunction(btn, beforeId, afterId)
        }
    ];

    searchConfig.forEach(config => registerSearchEvent(config));
    document.getElementById('exit-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        //window.location.href = '/defensa-civil/';
    });
});

function registerSearchEvent({ buttonId, handler, title, text, btn, beforeId, afterId, formHtml, selectId, selectUrl, searchFunction }) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        removeCloseButton();
        clearCardContainer();
        if (handler) {
            await handler();
        } else {
            setupSearchForm(title, text, btn, beforeId, afterId, formHtml, selectId, selectUrl, searchFunction);
        }
    });
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

function setupSearchForm(title, text, btn, beforeId, afterId, formHtml, selectId, selectUrl, searchFunction) {
    document.getElementById('card-title').innerHTML = title;
    document.getElementById('card-text').innerHTML = text;

    const container = document.getElementById('card-container');
    const card = document.createElement('div');
    card.className = 'event-form';
    card.innerHTML = formHtml;
    container.appendChild(card);

    if (selectId && selectUrl) {
        const selectedElements = [document.querySelector(`#search-${selectId}`)];
        completeSelectOptions(selectedElements, selectUrl);
    }

    const searchBtn = document.getElementById(`search-by-${selectId}-btn`);
    if (searchFunction) {
        if (btn) {            
            searchFunction(searchBtn, beforeId, afterId);
        } else {
            searchFunction(searchBtn, selectId);
        }
    }
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


function searchByFunction(button, inputId, searchParam) {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const value = document.getElementById(`search-${inputId}`).value;
        try {
            const response = await searchEvents(`${__SEARCH_URL__}?${searchParam}=${value}`);
            generateEventsList(response);
        } catch (error) {
            console.error(`Error al buscar eventos por ${searchParam}:`, error);
        }
    });
}

function searchByRangeFunction(button, beforeId, afterId) {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const beforeDate = document.getElementById(`${beforeId}`).value;
        const afterDate = document.getElementById(`${afterId}`).value;
        try {
            const response = await searchEvents(`${__SEARCH_URL__}?date_from=${beforeDate}&date_to=${afterDate}`);
            generateEventsList(response);
        } catch (error) {
            console.error('Error al buscar eventos por rango de fechas:', error);
        }
    });
}


