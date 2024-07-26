import { initializeForm, addNewEvent } from './utils.js';


const APP_PORT = 5500;

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();    

    
    const form = document.getElementById('myForm');

    const date = document.getElementById('date');
    const time = document.getElementById('time');
    const eventType = document.getElementById('event-type');
    const street_1 = document.getElementById('street-1');
    const street_1_number = document.getElementById('street-1-number');
    const street_2 = document.getElementById('street-2');
    const street_3 = document.getElementById('street-3');
    const derivation = document.getElementById('derivation');
    const event_description = document.getElementById('description');
    const informer_name = document.getElementById('informer-name');
    const informer_last_name = document.getElementById('informer-last-name');
    const informer_phone = document.getElementById('informer-phone-number');
    const informer_email = document.getElementById('informer-email');

    const elements = [
        { element: date, error: 'date-error', message: 'La fecha es obligatoria' },
        { element: time, error: 'time-error', message: 'La hora es obligatoria' },
        { element: eventType, error: 'event-type-error', message: 'El tipo es obligatorio' },
        { element: street_1, error: 'street-1-error', message: 'La calle es obligatoria' },
        { element: street_1_number, error: 'street-1-number-error', message: 'El número es obligatorio' },
        { element: street_2, error: 'street-2-error', message: 'La calle intermedia es obligatoria' },
        { element: street_3, error: 'street-3-error', message: 'La calle intermedia es obligatoria' },
        { element: derivation, error: 'derivation-error', message: 'La derivación es obligatoria' },
        { element: event_description, error: 'description-error', message: 'La descripción es obligatoria' },
        { element: informer_name, error: 'informer-name-error', message: 'El nombre es obligatorio' },
        { element: informer_last_name, error: 'informer-last-name-error', message: 'El apellido es obligatorio' },
        { element: informer_phone, error: 'informer-phone-number-error', message: 'El teléfono es obligatorio y debe tener 10 dígitos', pattern: /^\d{10}$/ },
        { element: informer_email, error: 'informer-email-error', message: 'El email es obligatorio y debe ser válido', type: 'email' },
    ];

    // const elements = [
    //     { element: document.getElementById('date'), error: 'date-error', message: 'La fecha es obligatoria' },
    //     { element: document.getElementById('time'), error: 'time-error', message: 'La hora es obligatoria' },
    //     { element: document.getElementById('event-type'), error: 'event-type-error', message: 'El tipo es obligatorio' },
    //     { element: document.getElementById('street-1'), error: 'street-1-error', message: 'La calle es obligatoria' },
    //     { element: document.getElementById('street-1-number'), error: 'street-1-number-error', message: 'El número es obligatorio' },
    //     { element: document.getElementById('street-2'), error: 'street-2-error', message: 'La calle intermedia es obligatoria' },
    //     { element: document.getElementById('street-3'), error: 'street-3-error', message: 'La calle intermedia es obligatoria' },
    //     { element: document.getElementById('derivation'), error: 'derivation-error', message: 'La derivación es obligatoria' },
    //     { element: document.getElementById('description'), error: 'description-error', message: 'La descripción es obligatoria' },
    //     { element: document.getElementById('informer-name'), error: 'informer-name-error', message: 'El nombre es obligatorio' },
    //     { element: document.getElementById('informer-last-name'), error: 'informer-last-name-error', message: 'El apellido es obligatorio' },
    //     { element: document.getElementById('informer-phone-number'), error: 'informer-phone-number-error', message: 'El teléfono es obligatorio y debe tener 10 dígitos', pattern: /^\d{10}$/ },
    //     { element: document.getElementById('informer-email'), error: 'informer-email-error', message: 'El email es obligatorio y debe ser válido', type: 'email' },
    // ];
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        let isValid = true;
        
        elements.forEach(({ element, error, message, pattern, type }) => {
            const errorElement = document.getElementById(error);
            if (!element.value) {
                isValid = false;
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else if (pattern && !pattern.test(element.value)) {
                isValid = false;
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else if (type === 'email' && !element.checkValidity()) {
                isValid = false;
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else {
                errorElement.style.display = 'none';
            }
        });
        
        console.log(elements);
        if (isValid) {
           try {
                const response = await addNewEvent(date.value, time.value, eventType.value, street_1.value, street_1_number.value, street_2.value, street_3.value, 
                    derivation.value, event_description.value, informer_name.value, informer_last_name.value, informer_phone.value, informer_email.value);
                if (response.status === 201) {
                    //closeForm();
                } else {
                    console.log('Error al crear el evento');
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
    
    elements.forEach(({ element, error, message, pattern, type }) => {
        element.addEventListener('input', function() {
            const errorElement = document.getElementById(error);
            if (!element.value) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else if (pattern && !pattern.test(element.value)) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else if (type === 'email' && !element.checkValidity()) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            } else {
                errorElement.style.display = 'none';
            }
        });
    });

    document.getElementById('cancel-new-event-btn').addEventListener('click', () => {
        closeForm();
    });    
});



// document.addEventListener("DOMContentLoaded", async () => {
//     initializeForm();    

//     document.getElementById('cancel-new-event-btn').addEventListener('click', () => {
//         closeForm();
//     });


//     document.getElementById('new-event-btn').addEventListener('click', async(e) => {
//         e.preventDefault();

//         let isValid = true;

//         const date = document.getElementById('date').textContent;
//         const time = document.getElementById('time').textContent;
//         const eventType = document.getElementById('event-type').value;
//         const street_1 = document.getElementById('street-1').value;
//         const street_1_number = document.getElementById('street-1-number').value;
//         const street_2 = document.getElementById ('street-2').value;
//         const street_3 = document.getElementById('street-3').value;
//         const derivation = document.getElementById('derivation').value;
//         const event_description = document.getElementById('description').value;
//         const informer_name = document.getElementById('informer-name').value;
//         const informer_last_name = document.getElementById('informer-last-name').value;
//         const informer_phone = document.getElementById('informer-phone-number').value;
//         const informer_email = document.getElementById('informer-email').value;        
       
//         const elements = [
//             { element: date, error: 'date-error', message: 'La fecha es obligatoria' },
//             { element: time, error: 'time-error', message: 'La hora es obligatoria' },
//             { element: eventType, error: 'event-type-error', message: 'El tipo es obligatorio' },
//             { element: street_1, error: 'street-1-error', message: 'La calle es obligatoria' },
//             { element: street_1_number, error: 'street-1-number-error', message: 'El número es obligatorio' },
//             { element: street_2, error: 'street-2-error', message: 'La calle intermedia es obligatoria' },
//             { element: street_3, error: 'street-3-error', message: 'La calle intermedia es obligatoria' },
//             { element: derivation, error: 'derivation-error', message: 'La derivación es obligatoria' },
//             { element: event_description, error: 'description-error', message: 'La descripción es obligatoria' },
//             { element: informer_name, error: 'informer-name-error', message: 'El nombre es obligatorio' },
//             { element: informer_last_name, error: 'informer-last-name-error', message: 'El apellido es obligatorio' },
//             { element: informer_phone, error: 'informer-phone-number-error', message: 'El teléfono es obligatorio y debe tener 10 dígitos', pattern: /^\d{10}$/ },
//             { element: informer_email, error: 'informer-email-error', message: 'El email es obligatorio y debe ser válido', type: 'email' },
//         ];
    
//         elements.forEach(({ element, error, message, pattern, type }) => {
//             const errorElement = document.getElementById(error);
//             if (!element.value) {
//                 isValid = false;
//                 errorElement.textContent = message;
//                 errorElement.style.display = 'block';
//             } else if (pattern && !pattern.test(element.value)) {
//                 isValid = false;
//                 errorElement.textContent = message;
//                 errorElement.style.display = 'block';
//             } else if (type === 'email' && !element.checkValidity()) {
//                 isValid = false;
//                 errorElement.textContent = message;
//                 errorElement.style.display = 'block';
//             } else {
//                 errorElement.style.display = 'none';
//             }
//         });

//         if (isValid) {
//             try {
//                 const response = await addNewEvent(date, time, eventType, street_1, street_1_number, street_2, street_3, 
//                     derivation, event_description, informer_name, informer_last_name, informer_phone, informer_email);
//                 if (response.status === 201) {
//                     //closeForm();
//                 } else {
//                     console.log('Error al crear el evento');
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         } 
//     });
// });

function closeForm() {
    document.getElementById('myForm').reset();
    window.location.href = `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`;
}