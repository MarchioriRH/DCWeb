/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/

import { showEventsLogoutBtns, showMessageModal } from "./utils.js";

//
// Scripts
// 

const SERVER_PORT = 3000;
const APP_PORT = 5500;

document.addEventListener('DOMContentLoaded', () => {
    
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
    
    /**
     * Si el token está presente, muestra los botones de eventos y logout
     * @returns {void}
     * 
     */
    async function showEventsLogoutBtnsAsync() {
        if (!localStorage.getItem('token')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/verifyToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },                
            });
            if (response.ok) {            
                showEventsLogoutBtns();
            } 
        } catch (error) {
            console.error('Error:', error);   
        }
    };
    showEventsLogoutBtnsAsync(); 
        
  
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

    
    
    /**
     * Cierra la sesión del usuario
     * @returns {void}
     * 
     */
    function clearUserData() {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
    }
    
    /**
     * Verifica si la página ha sido recargada
     * @returns {boolean}
     */
    function isPageReload() {
        const entries = performance.getEntriesByType("navigation");
        if (entries.length > 0 && entries[0].type === "reload") {
            return true;
        }
        return false;
    }
    
    /**
     * Cierra la sesión del usuario si la página no ha sido recargada
     * @returns {void}
     */
    // window.addEventListener('beforeunload', function() {
    //     if (!isPageReload()) {
    //         console.log('Sesión cerrada');
    //         clearUserData();
    //     }
    // });
    
            
});
        