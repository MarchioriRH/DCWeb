

// Función para formatear fecha
function formatDate(sqlDate) {
    const date = new Date(sqlDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
}
// Función para formatear hora
function formatTime(sqlTime) {
    const [hours, minutes] = sqlTime.split(':');

    return `${hours}:${minutes}`; // Formato HH:MM
}

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

export { formatDate, formatTime, completeSelectOptions };