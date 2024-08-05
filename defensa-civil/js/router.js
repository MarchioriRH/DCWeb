import { showEventsLogoutBtns, showMessageModal } from "./utils.js";

const APP_PORT = 5500;
const SERVER_PORT = 3000;

// Función para manejar el evento submit del formulario de login
const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    const keepSession = e.target.elements.remember_me.value;
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
    window.history.replaceState(null, '', window.location.pathname.slice(0, -(hash.length + 1)));
};

// Agregar el evento submit al formulario de login cuando el contenido se carga
const addLoginEventListener = async () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
};


// router.js
const route = (e) => {
    e = e || window.e;
    e.preventDefault();
    window.history.pushState({}, '', e.target.href);
    router();
};

// Objeto que almacena las rutas y sus correspondientes funciones
const routes = {
    '/defensa-civil': `http://localhost:${APP_PORT}/defensa-civil/eventos/main.html`,
    '/defensa-civil/eventos': `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`,
};

// Función que renderiza el contenido según la ruta
const router = async () => {
    const fullPath = window.location.pathname + window.location.hash;
    console.log('fullPath:', fullPath);
    let path = window.location.pathname;
    let hash = window.location.hash;
    

    if (hash === '#!' || hash === '#') {
        window.history.replaceState(null, '', fullPath.slice(0, -(hash.length + 1)));
        hash = '';
        path = window.location.pathname.slice(0, -(hash.length + 1)) || '/';
    } 
    
    
    console.log('path:', path);
    console.log('hash:', hash);
    let route = '';
    if (hash) {
        route = routes[fullPath.slice(0, -(hash.length + 1))];
    } else {
        route = routes[fullPath.slice(0, -1)];
    }
    if (hash === '#events') {
        path = '/defensa-civil/eventos';
        route = routes[path];
    }
    console.log('route:', route);
    
    if (route) {
        try {
            const html = await fetch(route).then(data => data.text());
            document.getElementById('main-page').innerHTML = html;
            window.history.replaceState(null, '', path);//.slice(0, -1));
            await addLoginEventListener();
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    if (hash === '#page-top') {
                        window.history.replaceState(null, '', fullPath.slice(0, -hash.length));
                    } else {
                        if (hash === '#loginModal') {
                            window.history.replaceState(null, '', path + '#login');
                        } else {
                            window.history.replaceState(null, '', fullPath);
                        }
                    }
                }
            }
        } catch (error) {
            document.getElementById('main-page').innerHTML = `<h1>404</h1><p>Página no encontrada.</p>`;
            console.error(error);
        }
    } else if (hash) {
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (hash === '#page-top') {
                window.history.replaceState(null, '', fullPath.slice(0, -hash.length));
            } else {
                if (hash === '#loginModal') {
                    window.history.replaceState(null, '', path + '#login');
                } else {
                    window.history.replaceState(null, '', fullPath);
                }
            }
        }
    } 
};

// Evento que escucha los cambios en el hash de la URL
window.addEventListener('hashchange', router);

// Llamar al router para cargar la ruta inicial
window.addEventListener('load', router);

window.addEventListener('DOMContentLoaded', router);

// Delegar el evento de clic en los enlaces
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
        route(e);
    }
});
