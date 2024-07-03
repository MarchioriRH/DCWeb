import { formatDate, formatTime, completeSelectOptions } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/assets/data/tipo_evento.json`;
const __SEARCH_URL__ = `http://localhost:${SERVER_PORT}/events`;

document.addEventListener("DOMContentLoaded", () => {
    const searchAllBtn = document.getElementById('search-all-btn');
    searchAllBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            const response = await searchEvents(__SEARCH_URL__);      
    
            generateEventsList(response);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
    });

    const searchByEventTypeBtn = document.getElementById('search-event-type');
    searchByEventTypeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
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
        searchEventTypeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const eventType = document.getElementById('event-type').value;
            const dataUrl = `${__SEARCH_URL__}?eventType=${eventType}`;
            const response = await searchEvents(dataUrl);
            generateEventsList(response);
        });

    });
});

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

function generateEventsList(response) {
    document.getElementById('card-title').innerHTML = 'Registros encontrados:';
    document.getElementById('card-text').innerHTML = '';
    generateCloseButton();

    if (Array.isArray(response)) {
        const container = document.getElementById('card-container');
        container.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos elementos

        const card = document.createElement('div');
        card.className = 'card-list';
        card.innerHTML = `
                    <table class="table table-striped" id="event-list">
                        <thead>
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Calle</th>
                                <th scope="col">Tipo de evento</th>
                                <th scope="col">Derivación</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Nombre del informante</th>
                                <th scope="col">Apellido del informante</th>
                                <th scope="col">Teléfono del informante</th>
                                <th scope="col">Email del informante</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                `;

        const tbody = card.querySelector('tbody');

        response.forEach(function (event) {
            const cardTr = document.createElement('tr');
            cardTr.innerHTML = `
                        <td class="event-list-text">${formatDate(event.date)}</td>
                        <td class="event-list-text">${formatTime(event.time)}</td>
                        <td class="event-list-text">${event.street}</td>
                        <td class="event-list-text">${event.type}</td>
                        <td class="event-list-text">${event.derivation}</td>
                        <td class="event-list-text">${event.event_description}</td>
                        <td class="event-list-text">${event.informer_name}</td>
                        <td class="event-list-text">${event.informer_last_name}</td>
                        <td class="event-list-text">${event.informer_phone}</td>
                        <td class="event-list-text">${event.informer_email}</td>
                    `;
            tbody.appendChild(cardTr);
        });
        container.appendChild(card);
    } else {
        console.error('La respuesta no es un array:', response);
    }
}

function generateCloseButton() {
    const cardBody = document.getElementById('card-body');
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-primary';
    closeBtn.innerHTML = 'Cerrar';
    cardBody.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
        document.getElementById('card-container').innerHTML = '';
        document.getElementById('card-title').innerHTML = 'Bienvenido al Panel de Control';
        document.getElementById('card-text').innerHTML = 'Utiliza el menú de la izquierda para navegar a través de las diferentes opciones.';
        closeBtn.remove();
    });
}



