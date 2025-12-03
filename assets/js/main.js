

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

const sliderWrapper = document.querySelector('.sponsor-slider__wrapper');
const slides = document.querySelectorAll('.sponsor-slider__slide');

// Clone the slides to create a seamless loop
slides.forEach(slide => {
  const clone = slide.cloneNode(true);
  sliderWrapper.appendChild(clone);
});


function revealOnScroll() {
    var reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(function(element) {
      var windowHeight = window.innerHeight;
      var elementTop = element.getBoundingClientRect().top;
      var elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('revealed');
      } else {
        element.classList.remove('revealed');
      }
    });
  }
  
  window.addEventListener('scroll', revealOnScroll);

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== GSAP ANIMATION ===============*/
gsap.from('.home__points', 1.5, {opacity: 0, y: -300, delay: .2})
gsap.from('.home__rocket', 1.5, {opacity: 0, y: 300, delay: .3})
gsap.from('.home__planet-1', 1.5, {opacity: 0, x: -200, delay: .8})
gsap.from('.home__planet-2', 1.5, {opacity: 0, x: 200, delay: 1})
gsap.from('.home__cloud-1', 1.5, {opacity: 0, y: 200, delay: 1.2})
gsap.from('.home__cloud-2', 1.5, {opacity: 0, x: 200, delay: 1.3})
gsap.from('.home__content', 1.5, {opacity: 0, y: -100, delay: 1.4})
gsap.from('.home__title img', 1.5, {opacity: 0, x: 100, delay: 1.6})

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById('header');
  const firstSection = document.querySelector('.home');

  // Function to handle scroll event
  const handleScroll = () => {
    // Get the height of the first section
    const firstSectionHeight = firstSection.offsetHeight;

    // Add the class if the user has scrolled past the first section
    if (window.scrollY > firstSectionHeight) {
      header.classList.add('navbar--scrolled');
    } else {
      header.classList.remove('navbar--scrolled');
    }
  };

  // Attach the scroll event listener to the window
  window.addEventListener('scroll', handleScroll);
});

// Projects page header navbar scroll


document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  function initTabs() {
    console.log('Initializing tabs');
    const tabsContainer = document.querySelector('.tabs-container');
    
    if (!tabsContainer) {
      console.error('Tabs container not found');
      return;
    }

    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    const contentPanels = tabsContainer.querySelectorAll('.content-panel');

    console.log('Number of tab buttons:', tabButtons.length);
    console.log('Number of content panels:', contentPanels.length);

    if (tabButtons.length === 0 || contentPanels.length === 0) {
      console.error('No tab buttons or content panels found');
      return;
    }

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const panelId = this.getAttribute('data-tab');
        console.log('Tab button clicked:', panelId);

        // Deactivate all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        contentPanels.forEach(panel => panel.classList.remove('active'));

        // Activate the clicked tab button
        this.classList.add('active');

        // Activate the corresponding panel
        const panel = tabsContainer.querySelector(`#${panelId}`);
        if (panel) {
          panel.classList.add('active');
          console.log('Activated panel:', panelId);
        } else {
          console.error('No panel found with id:', panelId);
          console.log('Available panels:', Array.from(contentPanels).map(p => p.id).join(', '));
        }
      });
    });

    // Activate the first tab by default
    tabButtons[0].click();
  }

  // Initialize tabs
  initTabs();


  // Other existing JavaScript code...
  // (Keep your existing code for other functionalities here)
});

// ===== Small "push" scroll from hero to next section =====
document.addEventListener('DOMContentLoaded', function () {
  const homeSection  = document.querySelector('.home');
  const nextSection  = document.querySelector('#about'); // first section after hero
  const header       = document.querySelector('.header');

  if (!homeSection || !nextSection) return;

  let autoScrolling = false;
  let hasSnappedOnce = false; // only do the "push" one time per page load

  window.addEventListener('wheel', function (e) {
    // already auto scrolling or already did the push
    if (autoScrolling || hasSnappedOnce) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = homeSection.offsetHeight;

    // only trigger if:
    //  - user scrolls DOWN (deltaY > 0)
    //  - we're still inside the hero section
    //  - the scroll amount isn't just a tiny wobble
    if (e.deltaY > 10 && scrollY < heroHeight - 50) {
      autoScrolling = true;
      hasSnappedOnce = true;

      const headerOffset = header ? header.offsetHeight : 0;
      const targetTop = nextSection.offsetTop - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // let scrolling finish before we allow anything else
      setTimeout(function () {
        autoScrolling = false;
      }, 1200);
    }
  }, { passive: true });
});

// === Auto-snap from hero to "Our Mission" on first scroll ===
(function () {
  const aboutSection = document.querySelector('#about');
  const header = document.querySelector('.header');
  let hasSnapped = false;

  if (!aboutSection) return;

  // Helper to get the Y-position of the mission section
  const getAboutTop = () =>
    aboutSection.getBoundingClientRect().top + window.pageYOffset;

  window.addEventListener(
    'scroll',
    () => {
      if (hasSnapped) return; // only do this once

      const y = window.pageYOffset || document.documentElement.scrollTop;
      const aboutTop = getAboutTop();

      // User has left the hero a bit but isn't already close to the section
      if (y > 40 && y < aboutTop - 200) {
        hasSnapped = true;
        const headerOffset = header ? header.offsetHeight : 0;

        window.scrollTo({
          top: aboutTop - headerOffset,
          behavior: 'smooth',
        });
      }
    },
    { passive: true }
  );
})();

// ======== Auto "push" past the hero section on first scroll ========
(function () {
  const hero = document.querySelector('.home');
  if (!hero) return; // no hero on this page

  let hasAutoScrolled = false;
  const triggerOffset = 40; // how much user has to scroll before we take over

  window.addEventListener('scroll', () => {
    if (hasAutoScrolled) return;

    const heroHeight = hero.offsetHeight;
    const y = window.scrollY || window.pageYOffset;

    // User started scrolling but is still inside the hero area
    if (y > triggerOffset && y < heroHeight - 100) {
      hasAutoScrolled = true;
      window.scrollTo({
        top: heroHeight,
        behavior: 'smooth',
      });
    }
  });
})();

