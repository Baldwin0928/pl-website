document.addEventListener("DOMContentLoaded", function () {

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
  const navLinks = document.querySelectorAll(".nav__link");
  if (navMenu && navLinks.length) {
    navLinks.forEach((link) =>
      link.addEventListener("click", () => navMenu.classList.remove("show-menu"))
    );
  }

  const header = document.getElementById("header");
  const hero = document.querySelector(".home");
  const isHomePage = !!document.querySelector(".home__video");

  function updateHeaderOnScroll() {
    if (!header) return;
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

  const sliderWrapper = document.querySelector(".sponsor-slider__wrapper");
  if (sliderWrapper) {
    const slides = sliderWrapper.querySelectorAll(".sponsor-slider__slide");
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      sliderWrapper.appendChild(clone);
    });
  }

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

  if (window.gsap) {
    gsap.from(".home__points", 1.5, { opacity: 0, y: -300, delay: 0.2 });
    gsap.from(".home__rocket", 1.5, { opacity: 0, y: 300, delay: 0.3 });
    gsap.from(".home__planet-1", 1.5, { opacity: 0, x: -200, delay: 0.8 });
    gsap.from(".home__planet-2", 1.5, { opacity: 0, x: 200, delay: 1 });
    gsap.from(".home__cloud-1", 1.5, { opacity: 0, y: 200, delay: 1.2 });
    gsap.from(".home__cloud-2", 1.5, { opacity: 0, x: 200, delay: 1.3 });
    gsap.from(".home__content", 0.75, { opacity: 0, y: -36, delay: 0.18, ease: "power2.out" });
    gsap.from(".home__title img", 0.75, { opacity: 0, x: 40, delay: 0.26, ease: "power2.out" });
  }

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
      tabButtons[0].click();
    }
  }

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

(() => {
  const section = document.querySelector(".scroll-quote");
  if (!section) return;

  const mission = document.querySelector("#about");
  const textEl = section.querySelector(".scroll-quote__text");
  const authorEl = section.querySelector(".scroll-quote__author");
  if (!textEl) return;

  if (!textEl.querySelector(".scroll-quote__word")) {
    const raw = (textEl.textContent || "").trim().replace(/\s+/g, " ");
    textEl.textContent = "";
    raw.split(" ").forEach((w, idx, arr) => {
      const span = document.createElement("span");
      span.className = "scroll-quote__word";
      span.textContent = w + (idx === arr.length - 1 ? "" : " ");
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity, filter";
      span.style.opacity = "0.12";
      span.style.transform = "translate3d(0, 18px, 0)";
      span.style.filter = "blur(1.2px)";
      textEl.appendChild(span);
    });
  }

  const words = Array.from(textEl.querySelectorAll(".scroll-quote__word"));
  words.forEach((w) => {
    w.style.display = "inline-block";
    w.style.willChange = "transform, opacity, filter";
  });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const smoothstep = (t) => t * t * (3 - 2 * t);

  const START_BEFORE_SECTION_VH = 0.88;
  const END_BEFORE_MISSION_VH = 0.38;
  const REVEAL_RANGE = 0.50;
  const REVEAL_WINDOW = 0.20;
  const BUMP_PX = 18;
  const BASE_OPACITY = 0.12;
  const PROGRESS_EASE = 0.14;

  let targetProgress = 0;
  let currentProgress = 0;
  let isAnimating = false;

  function getProgress() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const y = window.scrollY || window.pageYOffset;

    const sectionTop = section.offsetTop;
    const missionTop = mission ? mission.offsetTop : (sectionTop + section.offsetHeight);

    const start = sectionTop - vh * START_BEFORE_SECTION_VH;
    const end = missionTop - vh * END_BEFORE_MISSION_VH;

    const denom = Math.max(1, end - start);
    return clamp((y - start) / denom, 0, 1);
  }

  function renderProgress(p) {
    const n = words.length || 1;
    const lastIndex = Math.max(1, n - 1);

    for (let i = 0; i < words.length; i++) {
      const start = (i / lastIndex) * REVEAL_RANGE;
      const t = smoothstep(clamp((p - start) / REVEAL_WINDOW, 0, 1));

      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * t;
      const y = BUMP_PX * (1 - t);
      const blur = 1.2 * (1 - t);

      words[i].style.opacity = opacity.toFixed(3);
      words[i].style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      words[i].style.filter = `blur(${blur.toFixed(2)}px)`;
    }

    if (authorEl) {
      authorEl.style.font = "inherit";

      let t = clamp((p - 0.66) / 0.16, 0, 1);
      t = smoothstep(t);

      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * t;
      const y = BUMP_PX * (1 - t);
      const blur = 1.2 * (1 - t);

      authorEl.style.opacity = opacity.toFixed(3);
      authorEl.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      authorEl.style.filter = `blur(${blur.toFixed(2)}px)`;
      authorEl.style.willChange = "transform, opacity, filter";
    }
  }

  function animate() {
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) < 0.001) {
      currentProgress = targetProgress;
      renderProgress(currentProgress);
      isAnimating = false;
      return;
    }

    currentProgress += delta * PROGRESS_EASE;
    renderProgress(currentProgress);
    requestAnimationFrame(animate);
  }

  function updateTarget() {
    targetProgress = getProgress();
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animate);
    }
  }

  targetProgress = getProgress();
  currentProgress = targetProgress;
  renderProgress(currentProgress);

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", updateTarget);
  updateTarget();
})();

