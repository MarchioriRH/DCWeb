const SERVER_PORT = 5500;
const __STREETS_LIST__ = `http://localhost:${SERVER_PORT}/assets/data/calles_tandil.json`;
const __EVENTS_TYPES__ = `http://localhost:${SERVER_PORT}/assets/data/tipo_evento.json`;
const __DERIVATION_TYPES__ = `http://localhost:${SERVER_PORT}/assets/data/derivacion.json`;

document.addEventListener("DOMContentLoaded", () => {
    // document.getElementById('eventForm').onsubmit = function() {
    //     var title = document.getElementById('title').value;
    //     var date = document.getElementById('date').value;
    //     var time = document.getElementById('time').value;
    //     var location = document.getElementById('location').value;
    //     var description = document.getElementById('description').value;
    //     var event = {
    //         title: title,
    //         date: date,
    //         time: time,
    //         location: location,
    //         description: description
    //     };
    //     console.log(event);
    //     return false;
    // }

    
    const streets = document.querySelectorAll('#tandil-street-list');
    completeSelectOptions(streets, __STREETS_LIST__);

    const events_types = document.querySelectorAll('#event-type');
    completeSelectOptions(events_types, __EVENTS_TYPES__);

    const derivations = document.querySelectorAll('#derivation');
    completeSelectOptions(derivations, __DERIVATION_TYPES__);

    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', () => {
        document.getElementById('myForm').reset();
    });
});
    
    
function completeSelectOptions(selectList, dataSource) {
    fetch(dataSource)
    .then(response => response.json())
    .then(data => {
        data = Object.values(data)[0];             
        if (Array.isArray(data)) { 
            for (let i = 0; i < selectList.length; i++) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
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