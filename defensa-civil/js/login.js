import { showMessageModal } from './utils.js';

const SERVER_PORT = 3000;
const MSG_LOGIN_SUCCESS = 'Login exitoso';
const MSG_LOGIN_FAILED = 'Login fallido';
const MSG_REGISTER_SUCCESS = 'Usuario registrado';
const MSG_REGISTER_FAILED = 'Error al registrar el usuario';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const keepSession = document.getElementById('remember_me').checked;
        //console.log(username, ' ',password);
        
        await fetch(`http://localhost:${SERVER_PORT}/login` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, keepSession })
        }).then(response => {                
            if (response.ok) {
                response.json().then(response => {
                    localStorage.setItem('token', response.token); 
                    localStorage.setItem('rol', response.rol);
                });        
                showMessageModal('Loggin exitoso');
            } else {
                response.text().then(text => showMessageModal(text));
            }
        }).catch(error => {
            console.error('Error:', error);
        });
        document.getElementById('loginForm').reset();
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const rol = 'USER';
        //console.log(username, ' ',password);

        await fetch(`http://localhost:${SERVER_PORT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, rol })
        }).then(async response => {
            // if (response.ok) {
            //     response.text().then(text => showMessageModal(text));
            //     document.getElementById('registerForm').reset();
            // } else {
                response.text().then(text => showMessageModal(text));
                document.getElementById('registerForm').reset();
            // }
        }).catch(error => {
            console.error('Error:', error);
        });       
    });

});




