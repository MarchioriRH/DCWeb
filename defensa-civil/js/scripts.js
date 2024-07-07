/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

const SERVER_PORT = 3000;
const APP_PORT = 5500;

window.addEventListener('DOMContentLoaded', event => {
    
    // Navbar shrink function
    document.addEventListener('scroll', () => {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        const navLinkStyle = document.body.querySelectorAll('.nav-link');
        const scrollUp = document.body.querySelector('.scrollup');

        if (!navbarCollapsible) {
            return;
        }

        if (window.scrollY === 0)  {
            navbarCollapsible.classList.remove('navbar-shrink');
            scrollUp.classList.remove('show-back-to-top');
            navLinkStyle.forEach(element => {
                element.style.color = 'black';            
            });
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
            scrollUp.classList.add('show-back-to-top');
            navLinkStyle.forEach(element => {
                element.style.color = 'white';            
            }); 
        }                
    });   
    
    // If user is logged in, show event form and logout button
    if (localStorage.getItem('token')) {
        const navbarUlList = document.getElementById('navbar-list-ul');
        const eventFormLiControlPanel = document.createElement('li');
        eventFormLiControlPanel.className = 'nav-item';
        eventFormLiControlPanel.id = 'control-panel';
        eventFormLiControlPanel.innerHTML = '<a class="nav-link" id="control-panel-btn" href="#">Eventos</a>';

        const eventFormLiLogout = document.createElement('li');
        eventFormLiLogout.className = 'nav-item';
        eventFormLiLogout.id = 'logout';
        eventFormLiLogout.innerHTML = '<a class="nav-link" id="logout-btn" href="#">Cerrar sesion</a>';
        
        navbarUlList.appendChild(eventFormLiControlPanel);
        navbarUlList.appendChild(eventFormLiLogout);
        document.getElementById('login-btn').style.display = 'none';
    }

    // Change navbar link color when toggler is clicked
    const togglerMenuBtn = document.querySelector('.navbar-toggler');
    togglerMenuBtn.addEventListener('click', event => { 
        const navLinkStyle = document.body.querySelectorAll('.nav-link');        
        navLinkStyle.forEach(element => {
            element.style.color = 'white';            
        });
    });

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Carousel
    const myCarouselElement = document.querySelector('#adviceCarousel');
    const carousel = new bootstrap.Carousel(myCarouselElement, {
        interval: 3000,
        touch: false
    });

    if (document.getElementById('control-panel')) {
        const eventsControlPanelBtn = document.getElementById('control-panel-btn');
        eventsControlPanelBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:${SERVER_PORT}/protected`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/html',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (response.ok) {
                    console.log('Protected route data:', response);
                    response.text().then(text => {
                        window.location.href = `http://localhost:${APP_PORT}${text}`;
                        console.log('text: ', text)});
                } else {
                    console.log('Error al acceder a la ruta protegida:', response);
                }
            } catch (error) {
                console.log('Error al acceder a la ruta protegida:', error);
            }
        });
    }
    
    

    // Logout
    const logout = () => {
        console.log('Logout');
        localStorage.removeItem('token');
        document.getElementById('control-panel').remove();
        document.getElementById('logout').remove();
        document.getElementById('login-btn').style.display = 'block';
    }
    if (document.getElementById('logout-btn'))
        document.getElementById('logout-btn').addEventListener('click', logout);


    if (document.getElementById('messageModal')) {
        const messageModal = document.getElementById('msg-modal-close');
        messageModal.addEventListener('click', () => {
            location.reload();
        });
    }
});
