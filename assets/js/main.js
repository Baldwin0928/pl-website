document.addEventListener("DOMContentLoaded", function () {
  /* ==================== NAV MENU (ALL PAGES) ==================== */
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // Remove menu when clicking any nav link (mobile)
  const navLinks = document.querySelectorAll(".nav__link");
  if (navMenu && navLinks.length) {
    navLinks.forEach((link) =>
      link.addEventListener("click", () => navMenu.classList.remove("show-menu"))
    );
  }

  /* ==================== HEADER SCROLL TOGGLE (ALL PAGES) ==================== */
  const header = document.getElementById("header");
  const hero = document.querySelector(".home");
  const isHomePage = !!document.querySelector(".home__video"); // only index has this

  function updateHeaderOnScroll() {
    if (!header) return;

    // Home page: wait until you pass the hero
    // Other pages: turn on after a small scroll so text stays readable
    const threshold = isHomePage && hero ? hero.offsetHeight : 40;

    if (window.scrollY > threshold) {
      header.classList.add("navbar--scrolled");
    } else {
      header.classList.remove("navbar--scrolled");
    }
  }

  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  window.addEventListener("resize", updateHeaderOnScroll);

  /* ==================== SPONSOR SLIDER CLONE (ONLY IF PRESENT) ==================== */
  const sliderWrapper = document.querySelector(".sponsor-slider__wrapper");
  if (sliderWrapper) {
    const slides = sliderWrapper.querySelectorAll(".sponsor-slider__slide");
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      sliderWrapper.appendChild(clone);
    });
  }

  /* ==================== SCROLL REVEAL (ONLY IF PRESENT) ==================== */
  function revealOnScroll() {
    const reveals = document.querySelectorAll(".scroll-reveal");
    if (!reveals.length) return;

    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("revealed");
      } else {
        el.classList.remove("revealed");
      }
    });
  }

  if (document.querySelector(".scroll-reveal")) {
    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll, { passive: true });
  }

  /* ==================== GSAP ANIMATIONS (ONLY IF GSAP IS LOADED) ==================== */
  if (window.gsap) {
    // These will just do nothing if the selector doesn't exist (safe)
    gsap.from(".home__points", 1.5, { opacity: 0, y: -300, delay: 0.2 });
    gsap.from(".home__rocket", 1.5, { opacity: 0, y: 300, delay: 0.3 });
    gsap.from(".home__planet-1", 1.5, { opacity: 0, x: -200, delay: 0.8 });
    gsap.from(".home__planet-2", 1.5, { opacity: 0, x: 200, delay: 1 });
    gsap.from(".home__cloud-1", 1.5, { opacity: 0, y: 200, delay: 1.2 });
    gsap.from(".home__cloud-2", 1.5, { opacity: 0, x: 200, delay: 1.3 });
    gsap.from(".home__content", 1.5, { opacity: 0, y: -100, delay: 1.4 });
    gsap.from(".home__title img", 1.5, { opacity: 0, x: 100, delay: 1.6 });
  }

  /* ==================== TABS (ONLY IF PRESENT) ==================== */
  const tabsContainer = document.querySelector(".tabs-container");
  if (tabsContainer) {
    const tabButtons = tabsContainer.querySelectorAll(".tab-button");
    const contentPanels = tabsContainer.querySelectorAll(".content-panel");

    if (tabButtons.length && contentPanels.length) {
      tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const panelId = this.getAttribute("data-tab");

          tabButtons.forEach((btn) => btn.classList.remove("active"));
          contentPanels.forEach((panel) => panel.classList.remove("active"));

          this.classList.add("active");

          const panel = tabsContainer.querySelector(`#${panelId}`);
          if (panel) panel.classList.add("active");
        });
      });

      // Activate first tab by default
      tabButtons[0].click();
    }
  }

  /* ==================== HOME PAGE AUTO-SNAP (ONLY ON INDEX) ==================== */
  if (isHomePage) {
    const aboutSection = document.querySelector("#about");
    const heroSection = document.querySelector(".home");
    if (aboutSection && heroSection) {
      let hasSnapped = false;

      const getAboutTop = () =>
        aboutSection.getBoundingClientRect().top + window.pageYOffset;
    }
  }
});

/* ===================== SCROLL QUOTE (end tied to #about so no dead zone) ===================== */
(() => {
  const section = document.querySelector(".scroll-quote");
  if (!section) return;

  const mission = document.querySelector("#about"); // Our Mission section
  const textEl = section.querySelector(".scroll-quote__text");
  const authorEl = section.querySelector(".scroll-quote__author");
  if (!textEl) return;

  // Split into spans if needed
  if (!textEl.querySelector(".scroll-quote__word")) {
    const raw = (textEl.textContent || "").trim().replace(/\s+/g, " ");
    textEl.textContent = "";
    raw.split(" ").forEach((w, idx, arr) => {
      const span = document.createElement("span");
      span.className = "scroll-quote__word";
      span.textContent = w + (idx === arr.length - 1 ? "" : " ");
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.style.opacity = "0.14";
      span.style.transform = "translate3d(0, 12px, 0)";
      textEl.appendChild(span);
    });
  }

  const words = Array.from(textEl.querySelectorAll(".scroll-quote__word"));
  words.forEach((w) => {
    w.style.display = "inline-block";
    w.style.willChange = "transform, opacity";
  });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // TUNING
  const START_BEFORE_SECTION_VH = 0.70; // start when you're a bit before the quote section
  const END_BEFORE_MISSION_VH = 0.65;   // finish right before Our Mission shows (smaller => later)
  const BUMP_PX = 12;
  const BASE_OPACITY = 0.14;

  let ticking = false;

  function getProgress() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const y = window.scrollY || window.pageYOffset;

    const sectionTop = section.offsetTop;
    const missionTop = mission ? mission.offsetTop : (sectionTop + section.offsetHeight);

    // Start earlier (before section top), end near mission entering viewport
    const start = sectionTop - vh * START_BEFORE_SECTION_VH;
    const end = missionTop - vh * END_BEFORE_MISSION_VH;

    const denom = Math.max(1, end - start);
    return clamp((y - start) / denom, 0, 1);
  }

  function render() {
    const p = getProgress();
    const n = words.length || 1;

    for (let i = 0; i < words.length; i++) {
      const a = i / n;
      const b = (i + 1) / n;

      let t = clamp((p - a) / (b - a), 0, 1);
      t = easeOutCubic(t);

      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * t;
      const y = BUMP_PX * (1 - t);

      words[i].style.opacity = opacity.toFixed(3);
      words[i].style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    // Author: same font as quote (you said you want exactly that)
    if (authorEl) {
      authorEl.style.font = "inherit";

      let t = clamp((p - 0.82) / 0.18, 0, 1);
      t = easeOutCubic(t);

      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * t;
      const y = BUMP_PX * (1 - t);

      authorEl.style.opacity = opacity.toFixed(3);
      authorEl.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      authorEl.style.willChange = "transform, opacity";
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();





