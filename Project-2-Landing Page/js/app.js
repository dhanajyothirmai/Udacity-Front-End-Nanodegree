// VARIABLES
const header = document.querySelector('.page__header')
const navbar = document.querySelector('nav');
const navbarList = document.querySelector('.navbar__list');
const sections = Array.from(document.querySelectorAll('section'));
const fragment = document.createDocumentFragment();
const buttonToTop = document.querySelector('.button--totop');

// FUNCTIONS

// <----addNavbarItem---->
// for each <section> element the function creates corresponding navigation item pointing to the section ID.
function addNavbarItem() {
  sections.forEach((section, i) => {
    const navbarItem = document.createElement('li');
    navbarItem.setAttribute('class', 'menu__item');
    navbarItem.innerHTML = `<a href=#section${i + 1} class="menu__link">${section.dataset.nav}</a>`;
    fragment.appendChild(navbarItem);
  });
}
addNavbarItem();
navbarList.appendChild(fragment);

// <----addActive---->
// for each section in viewport the function adds and removes 'active' class and highlights section to the user, it also adds a 'current' state to corresponding navigation item
function addActive() {
  sections.forEach(section => {
    const bounding = section.getBoundingClientRect();
    const sectionLink = document.querySelector(`a[href="#${section.getAttribute('id')}"]`);
    const sectionHalfShown = section.offsetTop - (section.offsetHeight / 2);
    const sectionBehind = section.offsetTop + (section.offsetHeight / 2);
    if (
      (bounding.top >= 0) &&
      (bounding.left >= 0) &&
      (Math.floor(bounding.right) <= window.innerWidth) &&
      (window.pageYOffset > sectionHalfShown) && (window.pageYOffset <= sectionBehind)) {
      section.classList.add('active');
      sectionLink.classList.add('current');
    } else if (window.pageYOffset >= sectionBehind || window.pageYOffset < section.offsetTop) {
      section.classList.remove('active');
      sectionLink.classList.remove('current');
    }
  })
}

// <----scrollToSection---->
// for each navigation item clicked, this function scrolls to the corresponding section (section which id is the same as item's href)
function scrollToSection(e) {
  navbarList.querySelectorAll('a[href^="#"]').forEach(anchor => {
    e.preventDefault();
    if (anchor === e.target) {
      console.log(anchor);
      document.querySelector(e.target.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    }
  })
}


// this function ensures navbar is visible on page load
window.onload = function () {
  header.classList.add('slide-down');
};

// <----hideNavbar---->
// this function hides navbar when user is not scrolling, apart from when user is hovering over it.
let scrolling = false;

function hideNavbar(e) {
  if (scrolling !== false) {
    clearTimeout(scrolling);
    header.classList.remove('slide-up');
    header.classList.add('slide-down');
  }
  scrolling = setTimeout(function () {
    if (header.matches(':hover')) {
      header.classList.remove('slide-up');
    } else {
      header.classList.remove('slide-down');
      header.classList.add('slide-up');
    }
  }, 1000);
}

// <----addButtonToTop---->
// this function adds buttonToTop when user starts scrolling

function addButtonToTop(e) {
  if (window.pageYOffset > 15) {
    buttonToTop.classList.remove('no-show');
  } else {
    buttonToTop.classList.add('no-show');
  }
}

// <----scrollToTop---->
// this function scrolls window page to top when buttonToTop is clicked

function scrollToTop() {
  window.scrollTo(0, 0);
}

// EVENT LISTENERS
window.addEventListener('scroll', addActive);
navbarList.addEventListener('click', scrollToSection);
window.addEventListener('scroll', hideNavbar, false);
window.addEventListener('scroll', addButtonToTop);
buttonToTop.addEventListener('click', scrollToTop);

