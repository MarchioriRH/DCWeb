

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
function completeSelectOptions(selectList, dataSource) {
    fetch(dataSource)
    .then(response => response.json())
    .then(data => {
        data = Object.values(data)[0];             
        if (Array.isArray(data)) { 
            for (let i = 0; i < selectList.length; i++) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.data;
                    option.text = item.data;
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
                                <th scope="col">Tipo de evento</th>
                                <th scope="col">Calle</th>
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
                        <td class="event-list-text">${formatDate(event.date)}</td>
                        <td class="event-list-text">${formatTime(event.time)}</td>
                        <td class="event-list-text">${event.type}</td>
                        <td class="event-list-text">${event.street}</td>
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

export { formatDate, formatTime, completeSelectOptions, generateCloseButton, generateEventsList};