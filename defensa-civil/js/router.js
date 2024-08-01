

const APP_PORT = 5500;


    // router.js
    const route = (e) => {
        e = e || window.e;
        e.preventDefault();
        window.history.pushState({}, '', e.target.href);
    }

    // Objeto que almacena las rutas y sus correspondientes funciones
    const routes = {
        '/defensa-civil/': `http://localhost:${APP_PORT}/defensa-civil/eventos/main.html`,
        '/defensa-civil/eventos': `http://localhost:${APP_PORT}/defensa-civil/eventos/control_panel.html`,
    };

    // Función que renderiza el contenido según la ruta
    const router = async () => {
        //const path = location.hash.slice(1) || '/';
        const path = window.location.pathname;
        
        console.log(path);
        const route = routes[path];
        console.log(route);
        try {
            const html = await fetch(route).then(data => data.text());
            document.getElementById('main-page').innerHTML = html
        } catch (error) {
            document.getElementById('main-page').innerHTML = `<h1>404</h1><p>Página no encontrada.</p>`;
            console.error(error);
        }
    };

    // Evento que escucha los cambios en el hash de la URL
    window.addEventListener('hashchange', router);

    // Llamar al router para cargar la ruta inicial
    window.addEventListener('load', router);

    window.route = route;
