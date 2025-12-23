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

      // Wheel snap (desktop)
      window.addEventListener(
        "wheel",
        function (e) {
          if (hasSnapped) return;

          const y = window.scrollY || window.pageYOffset;
          const heroHeight = heroSection.offsetHeight;

          if (e.deltaY > 10 && y < heroHeight - 50) {
            hasSnapped = true;
            const headerOffset = header ? header.offsetHeight : 0;
            window.scrollTo({
              top: getAboutTop() - headerOffset,
              behavior: "smooth",
            });
          }
        },
        { passive: true }
      );

      // Touch/trackpad fallback (scroll-based)
      window.addEventListener(
        "scroll",
        function () {
          if (hasSnapped) return;

          const y = window.scrollY || window.pageYOffset;
          const aboutTop = getAboutTop();

          if (y > 40 && y < aboutTop - 200) {
            hasSnapped = true;
            const headerOffset = header ? header.offsetHeight : 0;
            window.scrollTo({
              top: aboutTop - headerOffset,
              behavior: "smooth",
            });
          }
        },
        { passive: true }
      );
    }
  }
});

/* ===================== SCROLL QUOTE (early start + slower reveal) ===================== */
(() => {
  const section = document.querySelector(".scroll-quote");
  if (!section) return;

  const textEl = section.querySelector(".scroll-quote__text");
  const authorEl = section.querySelector(".scroll-quote__author");
  if (!textEl) return;

  // If quote text isn't already split into spans, split it automatically
  const hasSpans = textEl.querySelector(".scroll-quote__word");
  if (!hasSpans) {
    const raw = (textEl.textContent || "").trim().replace(/\s+/g, " ");
    textEl.textContent = "";

    const parts = raw.split(" ");
    parts.forEach((w, idx) => {
      const span = document.createElement("span");
      span.className = "scroll-quote__word";
      span.textContent = w + (idx === parts.length - 1 ? "" : " ");
      // ensure transforms work even if your CSS forgets display:inline-block
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.style.opacity = "0.16";
      span.style.transform = "translate3d(0, 10px, 0)";
      textEl.appendChild(span);
    });
  }

  const words = Array.from(textEl.querySelectorAll(".scroll-quote__word"));
  // Also enforce inline-block for existing spans
  words.forEach((w) => {
    w.style.display = "inline-block";
    w.style.willChange = "transform, opacity";
  });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* TUNING (THIS is the "start" behavior you were asking for)
     - START_IN_VIEW bigger => starts earlier (when section enters viewport)
     - END_IN_VIEW smaller  => finishes later (slower overall)
  */
  const START_IN_VIEW = 0.85; // start when section top hits 85% of viewport height (EARLY)
  const END_IN_VIEW = 0.15;   // finish when section top hits 15% (SLOW, more scroll distance)
  const BUMP_PX = 12;         // how much the word "bumps" up while appearing
  const BASE_OPACITY = 0.14;  // dim grey start (clean, no glow)

  let ticking = false;

  function render() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const startY = vh * START_IN_VIEW;
    const endY = vh * END_IN_VIEW;

    // progress 0..1 across the scroll window
    let p = (startY - rect.top) / (startY - endY);
    p = clamp(p, 0, 1);

    const n = words.length || 1;

    for (let i = 0; i < words.length; i++) {
      const a = i / n;
      const b = (i + 1) / n;

      let t = (p - a) / (b - a);
      t = clamp(t, 0, 1);
      t = easeOutCubic(t);

      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * t;
      const y = BUMP_PX * (1 - t);

      words[i].style.opacity = opacity.toFixed(3);
      words[i].style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    // Author reveals near the end (same clean bump)
    if (authorEl) {
      let t = (p - 0.78) / 0.22; // start late, finish at end
      t = clamp(t, 0, 1);
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
  onScroll(); // initial
})();



