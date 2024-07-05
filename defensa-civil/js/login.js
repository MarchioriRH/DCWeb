import { showMessageModal } from './utils.js';

const SERVER_PORT = 3000;
const MSG_LOGIN_SUCCESS = 'Login successful';
const MSG_LOGIN_FAILED = 'Login failed';
const MSG_REGISTER_SUCCESS = 'User registered';
const MSG_REGISTER_FAILED = 'Failed to register user';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const keepSession = document.getElementById('remember_me').checked;
        //console.log(username, ' ',password);
        const response = await fetch(`http://localhost:${SERVER_PORT}/login` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, keepSession })
        }).then(response => {                
            if (response.ok) {
                //showMessageModal(MSG_LOGIN_SUCCESS);
                console.log('response: ', response.token);
                localStorage.setItem('token', response.token);
                localStorage.setItem('rol', response.rol);
                showMessageModal(response.token);
                document.getElementById('loginForm').reset();
            } else {
                response.text().then(text => showMessageModal(text));
                document.getElementById('loginForm').reset();
                console.log('Login failed');   
            }
        }).catch(error => {
            console.error('Error:', error);
        });
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
            showMessageModal(MSG_REGISTER_SUCCESS);
            document.getElementById('registerForm').reset();
        } else {
            showMessageModal(MSG_REGISTER_FAILED);
            document.getElementById('registerForm').reset();
        }
    });

});




