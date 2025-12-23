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

/* ===================== SCROLL REVEAL QUOTE ===================== */
(function initScrollRevealQuote() {
  const section = document.getElementById("scroll-quote");
  const textEl = document.getElementById("scroll-quote-text");
  if (!section || !textEl) return;

  // Respect reduced-motion
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Split text into word spans (preserve spaces)
  const raw = textEl.textContent.trim();
  const parts = raw.split(/(\s+)/); // keep spaces as tokens
  textEl.textContent = "";

  const wordSpans = [];
  parts.forEach((token) => {
    if (token.trim() === "") {
      textEl.appendChild(document.createTextNode(token));
      return;
    }
    const span = document.createElement("span");
    span.className = "scroll-quote__word";
    span.textContent = token;
    textEl.appendChild(span);
    wordSpans.push(span);
  });

  if (reduceMotion) {
    wordSpans.forEach((w) => w.classList.add("is-on"));
    return;
  }

  let ticking = false;

  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }

  function update() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // Progress through the section's scrollable range:
    // when top hits top -> 0, when bottom hits bottom -> 1
    const total = rect.height - vh;
    const scrolled = -rect.top;
    const p = clamp01(total <= 0 ? 1 : scrolled / total);

    const count = Math.floor(p * (wordSpans.length + 2)); // +2 gives a nicer finish
    for (let i = 0; i < wordSpans.length; i++) {
      wordSpans[i].classList.toggle("is-on", i < count);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

// ===== Scroll-reveal quote: word-by-word bump + fade (clean) =====
(function () {
  const stage = document.querySelector(".scroll-quote__stage");
  const textEl = document.getElementById("scroll-quote-text");
  const authorEl = document.querySelector(".scroll-quote__author");
  if (!stage || !textEl) return;

  // Wrap each word in a span so we can animate individually
  const raw = textEl.textContent.trim();
  const words = raw.split(/\s+/);

  textEl.innerHTML = words
    .map((w) => `<span class="scroll-quote__word">${w}</span>`)
    .join(" ");

  const wordEls = Array.from(textEl.querySelectorAll(".scroll-quote__word"));
  const N = wordEls.length;

  // Tuning knobs: "slow" reveal but not endless black
  const baseOpacity = 0.18; // unrevealed grey
  const bumpPx = 14;        // how much it rises
  const revealWindow = 0.12; // slower + uses more of the stage so less dead black

  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function update() {
    const r = stage.getBoundingClientRect();
    const stageTop = r.top;
    const stageH = r.height;

    // 0..1 progress through the stage while sticky holds the text
    const progress = clamp01((0 - stageTop) / (stageH - window.innerHeight));

    for (let i = 0; i < N; i++) {
      const start = i / N;
      const t = clamp01((progress - start) / revealWindow);

      const op = lerp(baseOpacity, 1, t);
      const y = lerp(bumpPx, 0, t);

      wordEls[i].style.opacity = op.toFixed(3);
      wordEls[i].style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    if (authorEl) {
      // Author appears near the end
      const tA = clamp01((progress - 0.82) / 0.18);
      authorEl.style.opacity = lerp(0.18, 1, tA).toFixed(3);
      authorEl.style.transform = `translate3d(0, ${lerp(10, 0, tA).toFixed(2)}px, 0)`;
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();






