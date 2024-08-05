import { showMessageModal, showEventsLogoutBtns } from './utils.js';

const SERVER_PORT = 3000;
const APP_PORT = 5500;
const MSG_LOGIN_SUCCESS = 'Login exitoso';
const MSG_LOGIN_FAILED = 'Login fallido';
const MSG_REGISTER_SUCCESS = 'Usuario registrado';
const MSG_REGISTER_FAILED = 'Error al registrar el usuario';

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Event listener para el formulario de login
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @param {boolean} keepSession - Mantener la sesión activa
     * @returns {void}
     */
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            debbuger;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const keepSession = document.getElementById('remember_me').checked;
            console.log('loginForm:', username, password, keepSession);
            try {
                const response = await fetch(`http://localhost:${SERVER_PORT}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, keepSession })
                });
        
                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.setItem('token', responseData.token);
                    localStorage.setItem('rol', responseData.rol);
                    showMessageModal('Loggin exitoso');
                    console.log('logginsuccess:', responseData);
                    showEventsLogoutBtns();
                } else {
                    const errorMessage = await response.text();
                    console.log('loginfailed:', errorMessage);
                    showMessageModal(errorMessage);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            document.getElementById('loginForm').reset();
        });
    }

    /**
     * Event listener para el formulario de registro
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @param {string} rol - Rol del usuario
     * @returns {void}
     * 
     */
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const rol = 'USER';

            await fetch(`http://localhost:${SERVER_PORT}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, rol })
            }).then(async response => {
                response.text().then(text => showMessageModal(text));
                document.getElementById('registerForm').reset();
            }).catch(error => {
                console.error('Error:', error);
            });       
        });
    }
});







