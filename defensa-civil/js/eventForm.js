import { initializeForm } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;


document.addEventListener("DOMContentLoaded", async () => {
    await initializeForm();    

    const cancelBtn = document.getElementById('cancel-new-event-btn');
    cancelBtn.addEventListener('click', () => {
        document.getElementById('myForm').reset();
        window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`;
    });


    document.getElementById('new-event-btn').addEventListener('click', async(e) => {
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
    
// async function addNewEvent(date, time, eventType, street_1, street_1_number, street_2, street_3, 
//     derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email) {
//     await fetch(`http://localhost:${SERVER_PORT}/events`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             date, time, eventType, street_1, street_1_number, street_2, street_3, derivation, event_description,
//             informer_name, informer_last_name, informer_phone, informer_email
//         })
//     }).then(response => {
//         if (response.ok) {
//             console.log('Event added');
//         } else {
//             console.log('Event failed to add');
//         }
//     }).catch(error => {
//         console.error('Error:', error);
//     });
// }
