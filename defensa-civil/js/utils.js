//import { searchByEventId } from './control_panel.js';
//import { editEvent } from './eventForm.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/calles_tandil.json`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/tipo_evento.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/derivacion.json`;
const __EVENT_FORM_PATH_NAME__ = '/defensa-civil/eventos/forms/event_form.html';
const __SEARCH_URL__ = `http://localhost:${SERVER_PORT}/events`;

const __CONTROL_PANEL_PATH_NAME__ = '/defensa-civil/eventos/control_panel.html';

/** Función para formatear fecha
 * @param {String} sqlDate - Fecha en formato SQL
 * 
 * */
function formatDate(sqlDate) {
    const date = new Date(sqlDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
}
/** Función para formatear hora
 * @param {String} sqlTime - Hora en formato SQL
 */
function formatTime(sqlTime) {
    const [hours, minutes] = sqlTime.split(':');

    return `${hours}:${minutes}`; // Formato HH:MM
}

/** Función para completar las opciones de un select 
 * @param {Array} selectList - Lista de elementos select
 * @param {String} dataSource - URL de la fuente de datos
*/
async function completeSelectOptions(selectList, dataSource, defaultValue) {
    await fetch(dataSource)
    .then(response => response.json())
    .then(data => {
        data = Object.values(data)[0];             
        if (Array.isArray(data)) { 
            for (let i = 0; i < selectList.length; i++) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.data;
                    option.text = item.data;
                    if (defaultValue && item.data === defaultValue) {
                        option.selected = true;
                    }
                    selectList[i].appendChild(option);
                });
            }
        } else {
            console.error('Expected an array, received:', data);
            }
        }).catch(error => {
            console.error('Error:', error);
    });
}


/** Funcion para generar la lista de eventos 
* @param {Array} response - Respuesta de la petición fetch
*/
function generateEventsList(response) {
    document.getElementById('card-title').innerHTML = 'Registros hallados:';
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
                                <th scope="col">ID</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Tipo de evento</th>
                                <th scope="col">Calle</th>
                                <th scope="col">Nro</th>
                                <th scope="col">Entre calle</th>
                                <th scope="col">y calle</th>
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

        if (response.length === 0) {
            const cardTr = document.createElement('tr');
            cardTr.innerHTML = `
                        <td colspan="10" class="event-list-text">No se encontraron registros</td>
                    `;
            tbody.appendChild(cardTr);
        }

        response.forEach(function (event) {
            const cardTr = document.createElement('tr');
            cardTr.innerHTML = `
                        <td class="event-list-text" ><button id='edit-event-btn' type='button' >${event.id}</button></td>
                        <td class="event-list-text">${formatDate(event.date)}</td>
                        <td class="event-list-text">${formatTime(event.time)}</td>
                        <td class="event-list-text">${event.type}</td>
                        <td class="event-list-text">${event.street}</td>
                        <td class="event-list-text">${event.number}</td>
                        <td class="event-list-text">${event.street_1}</td>
                        <td class="event-list-text">${event.street_2}</td>
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

    const editEventBtn = document.querySelectorAll('#edit-event-btn');
    for (let i = 0; i < editEventBtn.length; i++) {
        editEventBtn[i].addEventListener('click', async (e) => {
            e.preventDefault();
            const eventId = Number(e.target.textContent);
            console.log(eventId);
            const response = await searchByEventId(eventId);
            console.log(response);  
            editEvent(response);
        });
    }
}

/** 
 * Función para generar un botón de cierre
 * @returns {void}
 * 
 */
function generateCloseButton() {
    const cardBody = document.getElementById('card-body');
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.id = 'close-btn';
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

/**
 * Funcion para mostrar un modal con un mensaje
 * @param {*} msg 
 */
function showMessageModal(msg) {
    //console.log('msg: ', msg);
    $('#messageModal').modal({
        backdrop: 'static',
        keyboard: false,
    });
    $('#message').html(`<p style="color:black;">hola</p>`);
    $('#messageModal').modal('show');
}

async function verifyAccessToken(pathName) {
    if (window.location.pathname === pathName && !localStorage.getItem('token')) {
        console.log('No token found. Redirecting to index page.');
        showMessageModal('Acceso denegado');
        document.getElementById('msg-modal-close').addEventListener('click', () => {
            window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
        });
    } else {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/verifyToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Using Bearer scheme for tokens
                },
            });

            if (!response.ok) {
                console.log('Access denied');
                showMessageModal('Acceso denegado');
                document.getElementById('msg-modal-close').addEventListener('click', () => {
                    window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
                });
            } else {
                console.log('Access granted');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessageModal('Error en la conexión');
            document.getElementById('msg-modal-close').addEventListener('click', () => {
                window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
            });
        }
    }
}



// async function verifyAccessToken(pathName) {
//     if (window.location.pathname === pathName && !localStorage.getItem('token')) {
//         console.log('No token found. Redirecting to index page.');
//         showMessageModal('Acceso denegado');
//         document.getElementById('msg-modal-close').addEventListener('click', () => {
//             window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
//         });
//     } else {
//         await fetch(`http://localhost:${SERVER_PORT}/verifyToken`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'token': `${localStorage.getItem('token')}`,
//             },
//         })
//         .then(response => {
//             if (!response.ok) {
//                 console.log('Access denied');
//                 showMessageModal('Acceso denegado');
//                 document.getElementById('msg-modal-close').addEventListener('click', () => {
//                     window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
//                 });
//             } else {
//                 console.log('Access granted');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             showMessageModal('Error en la conexión');
//             document.getElementById('msg-modal-close').addEventListener('click', () => {
//                 window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
//             });
//         });
//     }
// }

function showEventsLogoutBtns() {
    if (document.getElementById('control-panel') && document.getElementById('logout')) {
        return
    }
    const navbarUlList = document.getElementById('navbar-list-ul');

    const eventFormLiControlPanel = document.createElement('li');
    eventFormLiControlPanel.className = 'nav-item';
    eventFormLiControlPanel.id = 'control-panel';
    eventFormLiControlPanel.innerHTML = '<a class="nav-link" id="control-panel-btn" href="#">Eventos</a>';
    navbarUlList.appendChild(eventFormLiControlPanel);

    const eventFormLiLogout = document.createElement('li');
    eventFormLiLogout.className = 'nav-item';
    eventFormLiLogout.id = 'logout';
    eventFormLiLogout.innerHTML = '<a class="nav-link" id="logout-btn" href="#">Cerrar sesion</a>';
    navbarUlList.appendChild(eventFormLiLogout);

    // Ocultar el botón de inicio de sesión
    document.getElementById('login-btn').style.display = 'none';

    // Añadir event listener al botón "Eventos"
    document.getElementById('control-panel-btn').addEventListener('click', () => {
        // Acción a realizar cuando se hace clic en el botón "Eventos"
        //console.log('Botón Eventos clicado');
        // Aquí puedes redirigir o cargar la página de eventos
        window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`;
    });

    // Añadir event listener al botón "Cerrar sesión"
    document.getElementById('logout-btn').addEventListener('click', () => {
        // Acción a realizar cuando se hace clic en el botón "Cerrar sesión"
        //console.log('Botón Cerrar sesión clicado');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = `http://localhost:${APP_PORT}/defensa-civil/index.html`;
    });
}


function editEvent(eventData) {
    console.log(eventData);
    // Guardar los datos en localStorage
    localStorage.setItem('editEventData', JSON.stringify(eventData));
    window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/forms/event_form.html`;
}

async function fillFormWithEventData(eventData) {
    eventData = eventData[0];
    document.getElementById('date').textContent = eventData.date;
    document.getElementById('time').textContent = eventData.time;
    document.getElementById('event-type').value = eventData.type;
    document.getElementById('street-1').value = eventData.street;
    document.getElementById('street-1-number').value = eventData.number;
    document.getElementById('street-2').value = eventData.street_1;
    document.getElementById('street-3').value = eventData.street_2;
    document.getElementById('derivation').value = eventData.derivation;
    document.getElementById('description').value = eventData.event_description;
    document.getElementById('informer-name').value = eventData.informer_name;
    document.getElementById('informer-last-name').value = eventData.informer_last_name;
    document.getElementById('informer-phone-number').value = eventData.informer_phone;
    document.getElementById('informer-email').value = eventData.informer_email;
}

export async function initializeForm() {
    await verifyAccessToken(__EVENT_FORM_PATH_NAME__);    
    // Verificar si hay datos guardados en localStorage
    const storedEventData = localStorage.getItem('editEventData');
    if (storedEventData) {
        const eventData = JSON.parse(storedEventData);
        console.log(eventData);
        const streets = document.querySelectorAll('.tandil-street-list');
        await completeSelectOptions(streets, __STREETS_LIST__, eventData.street_1);
        const events_types = document.querySelectorAll('#event-type');
        await completeSelectOptions(events_types, __EVENTS_TYPES__, eventData.type);
        const derivations = document.querySelectorAll('#derivation');
        await completeSelectOptions(derivations, __DERIVATION_TYPES__, eventData.derivation);
        fillFormWithEventData(eventData);
        // Limpiar el localStorage
        localStorage.removeItem('editEventData');
    } else {
        const date = document.getElementById('date');
        date.textContent = new Date().toISOString().split('T')[0];

        const time = document.getElementById('time');
        time.textContent = new Date().toLocaleTimeString().split(' ')[0];

        const streets = document.querySelectorAll('.tandil-street-list');
        await completeSelectOptions(streets, __STREETS_LIST__);

        const events_types = document.querySelectorAll('#event-type');
        await completeSelectOptions(events_types, __EVENTS_TYPES__);

        const derivations = document.querySelectorAll('#derivation');
        await completeSelectOptions(derivations, __DERIVATION_TYPES__);
    }
}

export async function addNewEvent(date, time, eventType, street_1, street_1_number, street_2, street_3, 
    derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email) {
    await fetch(`http://localhost:${SERVER_PORT}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Using Bearer scheme for tokens
        },
        body: JSON.stringify({
            date, time, eventType, street_1, street_1_number, street_2, street_3, derivation, event_description,
            informer_name, informer_last_name, informer_phone, informer_email
        })
    }).then(response => {
        if (response.ok) {
            console.log('Event added');
            window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`;
        } else {
            console.log('Event failed to add');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}



async function searchByEventId(eventId) {
   try {
        const dataUrl = `${__SEARCH_URL__}?id=${eventId}`;
        const response = await searchEvents(dataUrl);
        return response;
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    }    
}

export async function searchAllEvents() {
    try {
        const response = await searchEvents(__SEARCH_URL__);
        generateEventsList(response);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    }
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


export { formatDate, formatTime, completeSelectOptions, generateCloseButton, 
    generateEventsList, showMessageModal, verifyAccessToken , 
    showEventsLogoutBtns, editEvent, searchByEventId, searchEvents };