/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

//import { JSZip } from 'jszip';
window.addEventListener('DOMContentLoaded', event => {
    
    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

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

    const myCarouselElement = document.querySelector('#adviceCarousel')

    const carousel = new bootstrap.Carousel(myCarouselElement, {
        interval: 3000,
        touch: false
    });


    
    
        // URL del archivo .zip
        //const zipFileUrl = 'https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=tiepre';

        // Función para descargar y descomprimir el archivo .zip
        // async function downloadAndExtractZip() {
        //     try {
        //         const response = await fetch(zipFileUrl,  { mode: 'no-cors' });
        //         const blob = await response.blob();
        //         console.log(response);
        //         console.log(blob);

                // Crea un objeto File con el blob descargado
                //const zipFile = new File([blob], 'datos_clima.zip');

                // Descomprime el archivo .zip (requiere una librería como JSZip)
                // const jszip = new JSZip();
                // const zip = await jszip.loadAsync(zipFile);
                // const txtFile = zip.file('datos_clima.txt');

                // if (txtFile) {
                //     const txtData = await txtFile.async('text');
                    // Procesa los datos y muestra la información en el widget
                    // (como se hizo en el ejemplo anterior)
                    // ...
            //         console.log(txtData);
            //     } else {
            //         console.error('No se encontró el archivo .txt dentro del .zip.');
            //     }
            // } catch (error) {
            //     console.error('Error al descargar o descomprimir el archivo .zip:', error);
            // }
        //}

        // Llama a la función para iniciar la descarga y descompresión
        //downloadAndExtractZip();
    

});
