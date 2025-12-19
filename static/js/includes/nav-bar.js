// This is for the hamburger button.

const button = document.getElementById('hamburger-button')
const card = document.getElementById('hamburger-card')


if (button.addEventListener('click', function(){
    card.classList.toggle('-left-full');
    card.classList.toggle('left-0');
}));