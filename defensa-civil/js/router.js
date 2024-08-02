const APP_PORT = 5500;

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
    console.log('route:', route);

    if (route) {
        try {
            const html = await fetch(route).then(data => data.text());
            document.getElementById('main-page').innerHTML = html;
            window.history.replaceState(null, '', path.slice(0, -1));
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

// Delegar el evento de clic en los enlaces
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
        route(e);
    }
});
