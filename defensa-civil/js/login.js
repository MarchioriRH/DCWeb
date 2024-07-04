const SERVER_PORT = 3000;
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //console.log(username, ' ',password);
    const response = await fetch(`http://localhost:${SERVER_PORT}/login` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    //console.log(response);
    const data = await response.json();   

    if (response.ok) {
        localStorage.setItem('token', data.token);
        //$('#messageModal').modal('show');
        //document.getElementById('message').innerText = 'Login successful';
        document.getElementById('loginForm').reset();
        document.getElementById('control-panel').style.display = 'block';
        document.getElementById('logout-button').style.display = 'block';
        document.getElementById('login-button').style.display = 'none';
    } else {
        console.log('Login failed')
        document.getElementById('message').innerText = 'Login failed';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    //console.log(username, ' ',password);

    const response = await fetch(`http://localhost:${SERVER_PORT}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    //console.log(data);

    if (response.ok) {
        document.getElementById('message').innerText = 'User registered';
    } else {
        document.getElementById('message').innerText = 'Failed to register user';
    }
});

// Logout
const logout = () => {
    console.log('Logout');
    localStorage.removeItem('token');
    document.getElementById('control-panel').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-button').style.display = 'block';
    console.log('users: ', users);
}
document.getElementById('logout-button').addEventListener('click', logout);



