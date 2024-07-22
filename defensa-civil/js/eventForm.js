import { completeSelectOptions, verifyAccessToken } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/calles_tandil.json`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/tipo_evento.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/defensa-civil/assets/data/derivacion.json`;
const __PATH_NAME__ = '/defensa-civil/eventos/forms/event_form.html';

document.addEventListener("DOMContentLoaded", async () => {

    await verifyAccessToken(__PATH_NAME__);    
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


    const cancelBtn = document.getElementById('cancel-new-event-btn');
    cancelBtn.addEventListener('click', () => {
        document.getElementById('myForm').reset();
        window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`;
    });


    const submitBtn = document.getElementById('new-event-btn').addEventListener('click', async(e) => {
        e.preventDefault();
        const date = document.getElementById('date').textContent;
        const time = document.getElementById('time').textContent;
        const eventType = document.getElementById('event-type').value;
        const street_1 = document.getElementById('street-1').value;
        const street_1_number = document.getElementById('street-1-number').value;
        const street_2 = document.getElementById ('street-2').value;
        const street_3 = document.getElementById('street-3').value;
        const derivation = document.getElementById('derivation').value;
        const event_description = document.getElementById('description').value;
        const informer_name = document.getElementById('informer-name').value;
        const informer_last_name = document.getElementById('informer-last-name').value;
        const informer_phone = document.getElementById('informer-phone-number').value;
        const informer_email = document.getElementById('informer-email').value;        
       
        await addNewEvent(date, time, eventType, street_1, street_1_number, street_2, street_3, 
            derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email); 
    });
});
    
async function addNewEvent(date, time, eventType, street_1, street_1_number, street_2, street_3, 
    derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email) {
    await fetch(`http://localhost:${SERVER_PORT}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date, time, eventType, street_1, street_1_number, street_2, street_3, derivation, event_description,
            informer_name, informer_last_name, informer_phone, informer_email
        })
    }).then(response => {
        if (response.ok) {
            console.log('Event added');
        } else {
            console.log('Event failed to add');
        }
    }).catch(error => {
        console.error('Error:', error);
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


export { editEvent };
