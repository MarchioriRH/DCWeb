document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
        document.getElementById('message').innerText = 'Login successful';
    } else {
        document.getElementById('message').innerText = 'Login failed';
    }
});

// Ejemplo de cómo acceder a una ruta protegida
async function accessProtectedRoute() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/protected', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.ok) {
        console.log('Protected route data:', data);
    } else {
        console.log('Failed to access protected route:', data);
    }
}

// Llama a la función para probar la ruta protegida
accessProtectedRoute();
