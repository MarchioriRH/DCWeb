const APP_PORT = 5500;


    // router.js

    // Objeto que almacena las rutas y sus correspondientes funciones
    const routes = {
        '/': () => `http://localhost:${APP_PORT}/defensa-civil/index.html`,
        '/eventos': () => `http://localhost:${APP_PORT}/defensa-civil/assets/sections/forms/control_panel.html`,
    };

    // Función que renderiza el contenido según la ruta
    const router = () => {
        const path = location.hash.slice(1) || '/';
        const render = routes[path] || (() => `<h1>404</h1><p>Página no encontrada.</p>`);
        href = render();
    };

    // Evento que escucha los cambios en el hash de la URL
    window.addEventListener('hashchange', router);

    // Llamar al router para cargar la ruta inicial
    window.addEventListener('load', router);


