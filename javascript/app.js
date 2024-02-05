$(document).ready(function(){
    $('.sliders').slick({
        arrows: false,
        dots: true,
        appendDots:'.slider-dots',
        dotsClass:'dots'
    });

    let hamburger = document.querySelector('.hamburger');
    let times = document.querySelector('.times');
    let mobilenav = document.querySelector('.mobile-nav');
    let shut = document.querySelector('.shut');
   
    hamburger.addEventListener('click', function(){
        mobilenav.classList.add('open');
    });

    times.addEventListener('click', function(){
        mobilenav.classList.remove('open');
    });

    shut.addEventListener('click', function(){
        mobilenav.classList.remove('open');
    });

    document.addEventListener('DOMContentLoaded', (event) => {
        const downloadButton = document.querySelector('.download');
        
        downloadButton.addEventListener('click', () => {
            console.log('Resume download initiated.');
        });
    });

});