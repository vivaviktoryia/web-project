'use strict';

// Selectors
const header = document.querySelector('.header');
const menuBar = document.querySelector('.nav');
const menuBarLink = document.querySelectorAll('.nav__link');
const menuBarLinks = document.querySelector('.nav__links');

const h1 = document.querySelector('h1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

// Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container')
const tabsContetnt = document.querySelectorAll('.operations__content');

// SLIDER COMPONENT
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

// modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Modal window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll to

btnScrollTo.addEventListener('click', function (event) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Navigation
// use bubbling
menuBarLinks.addEventListener('click', function (event) {
  event.preventDefault();

  if (event.target.classList.contains('nav__link')) {

    const id = event.target.getAttribute('href');
    // console.log(this); // menuBarLinks
    // console.log('currentTarget -------->', event.currentTarget); // menuBarLinks
    // console.log('target -------->', event.target); // menuBarLink
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  };
});

// Tabbed components

tabContainer.addEventListener('click', function (event) {
  const clickedTab = event.target.closest('.operations__tab');
  // console.log(clickedTab);
  if (!clickedTab) return; // will fix any clicks - Uncaught TypeError: Cannot read properties of null (reading 'classList')
  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active')); // remove active class
  tabsContetnt.forEach(content => content.classList.remove('operations__content--active'));

  // activate tab
  clickedTab.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clickedTab.dataset.tab}`).classList.add('operations__content--active')
});

// Hover
// Event Delegation - as parent container that handle links that will bubble up, events bubble up of their target

const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};


menuBar.addEventListener('mouseover', handleHover.bind(0.5));

menuBar.addEventListener('mouseout', handleHover.bind(1));


//STICKY NAVIGATION

const menuBarHeight = menuBar.getBoundingClientRect().height;

const stickyMenuBar = function (entries) {
  const [entry] = entries; // entries[0]

  if (!entry.isIntersecting) menuBar.classList.add('sticky');
  else menuBar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyMenuBar, {
  root: null, // entire viewport
  threshold: 0, // Trigger when 0% of the target is visible
  rootMargin: `-${menuBarHeight}px`
});
headerObserver.observe(header);

// Reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries; // entries[0]

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
})

//LAZY LOADING IMAGES

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // remove blur filter once loading is done
  });
  observer.unobserve(entry.target);
};


const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img =>
  imgObserver.observe(img));

// SLIDER COMPONENT
const slider = function () {
  let currentSlide = 0;
  const maxSlide = slides.length;

  // FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    const targetDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);

    if (targetDot) {
      targetDot.classList.add('dots__dot--active');
    }
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };

  // slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * i}%)`);
  // // 0%, 100%,200%

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  init();

  // Next Slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0
    } else {
      // currentSlide ++;
      currentSlide += 1;
    }
    goToSlide(currentSlide);
    // next slide => change transform property
    // slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`);
    activateDot(currentSlide);
  };

  // Previous Slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1
    } else {
      // currentSlide --;
      currentSlide -= 1;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };


  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);


  document.addEventListener('keydown', function (event) {
    console.log(event.key);
    if (event.key === 'ArrowRight') nextSlide();
    // if (event.key === 'ArrowLeft') prevSlide();
    event.key === 'ArrowLeft' && prevSlide();
  })

  // will deligate eventListener to parent Container
  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      // const slide = event.target.dataset.slide;
      const { slide } = event.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  })
}

slider();

// DOM LOADED
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('html parsed and dom tree built', event);
})

window.addEventListener('load', function (event) {
  console.log('page fully loaded', event);
})

// window.addEventListener('beforeunload', function (event) {
//   event.preventDefault();
//   console.log(event);
//   event.returnValue = '';
// })
