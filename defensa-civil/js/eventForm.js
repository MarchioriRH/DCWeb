import { completeSelectOptions } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const __STREETS_LIST__ = `http://localhost:${APP_PORT}/assets/data/calles_tandil.json`;
const __EVENTS_TYPES__ = `http://localhost:${APP_PORT}/assets/data/tipo_evento.json`;
const __DERIVATION_TYPES__ = `http://localhost:${APP_PORT}/assets/data/derivacion.json`;

document.addEventListener("DOMContentLoaded", () => {
    
    const streets = document.querySelectorAll('.tandil-street-list');
    completeSelectOptions(streets, __STREETS_LIST__);

    const events_types = document.querySelectorAll('#event-type');
    completeSelectOptions(events_types, __EVENTS_TYPES__);

    const derivations = document.querySelectorAll('#derivation');
    completeSelectOptions(derivations, __DERIVATION_TYPES__);

    const cancelBtn = document.getElementById('cancel-new-event-btn');
    cancelBtn.addEventListener('click', () => {
        document.getElementById('myForm').reset();
    });

    const submitBtn = document.getElementById('new-event-btn');
    submitBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var eventType = document.getElementById('event-type').value;
        var street_1 = document.getElementById('street-1').value;
        var street_1_number = document.getElementById('street-1-number').value;
        var street_2 = document.getElementById ('street-2').value;
        var street_3 = document.getElementById('street-3').value;
        var derivation = document.getElementById('derivation').value;
        var event_description = document.getElementById('description').value;
        var informer_name = document.getElementById('informer-name').value;
        var informer_last_name = document.getElementById('informer-last-name').value;
        var informer_phone = document.getElementById('informer-phone-number').value;
        var informer_email = document.getElementById('informer-email').value;        
       
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

