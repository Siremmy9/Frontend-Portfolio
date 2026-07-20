"use strict";

/* ── LOADER ──────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 900);
});

/* ── THEME ───────────────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = themeBtn.querySelector(".theme-icon");

const savedTheme = localStorage.getItem("ej-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeBtn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("ej-theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
});

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
const progressBar = document.getElementById("scroll-progress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
  progressBar.style.width = pct + "%";
}

/* ── NAVBAR ──────────────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function updateNavbar() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle("scrolled", scrolled);
}

hamburger.addEventListener("click", () => {
  const open = hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
  mobileMenu.classList.toggle("open", open);
  mobileMenu.setAttribute("aria-hidden", !open);
});

// Close mobile menu on link click
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// Active link highlight on scroll
function updateActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  navLinks.forEach((link) => {
    const href = link.getAttribute("href").slice(1);
    link.classList.toggle("active", href === current);
  });
}

/* ── BACK TO TOP ─────────────────────────────────────────────── */
const backToTop = document.getElementById("back-to-top");

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ── SCROLL HANDLER (throttled) ──────────────────────────────── */
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateActiveLink();
        revealElements();
        backToTop.hidden = window.scrollY < 600;
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

// Initial call
updateNavbar();
updateActiveLink();

/* ── TYPING ANIMATION ────────────────────────────────────────── */
const words = [
  "React Developer",
  "JavaScript Expert",
  "UI Engineer",
  "Frontend Developer",
  "Responsive Web Designer",
];
let wordIdx = 0;
let charIdx = 0;
let deleting = false;
const typingEl = document.getElementById("typing-text");

function typeWriter() {
  const current = words[wordIdx];
  if (deleting) {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = deleting ? 60 : 100;

  if (!deleting && charIdx === current.length) {
    delay = 1800;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

// Start after loader
setTimeout(typeWriter, 1200);

/* ── PARTICLE CANVAS ─────────────────────────────────────────── */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let mouseX = -9999;
let mouseY = -9999;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 12), 100);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = html.getAttribute("data-theme") !== "light";

  particles.forEach((p) => {
    // Mouse repulsion
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      p.vx += (dx / dist) * force * 0.6;
      p.vy += (dy / dist) * force * 0.6;
    }

    p.vx *= 0.98;
    p.vy *= 0.98;
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(99,130,246,${p.opacity})`
      : `rgba(59,100,200,${p.opacity * 0.6})`;
    ctx.fill();
  });

  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i],
        b = particles[j];
      const dx = a.x - b.x,
        dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        const alpha = (1 - dist / 100) * (isDark ? 0.12 : 0.07);
        ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

let canvasResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(canvasResizeTimer);
  canvasResizeTimer = setTimeout(() => {
    resizeCanvas();
    createParticles();
  }, 200);
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("mouseleave", () => {
  mouseX = -9999;
  mouseY = -9999;
});

/* ── MOUSE GLOW ──────────────────────────────────────────────── */
if (window.matchMedia("(pointer: fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "mouse-glow";
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
if (window.matchMedia("(pointer: fine)").matches) {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let fx = 0,
    fy = 0;
  let cx = 0,
    cy = 0;

  document.addEventListener("mousemove", (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
  });

  function animateFollower() {
    fx += (cx - fx) * 0.15;
    fy += (cy - fy) * 0.15;
    follower.style.left = fx + "px";
    follower.style.top = fy + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document
    .querySelectorAll("a, button, .project-card, .service-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-hover");
        follower.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-hover");
        follower.classList.remove("cursor-hover");
      });
    });
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────────── */
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -50px 0px",
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

function revealElements() {} // Kept as hook; observer handles it

document
  .querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
  .forEach((el) => {
    revealObserver.observe(el);
  });

/* ── ANIMATED COUNTERS ───────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"));
  const duration = 1800;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".stat-number").forEach((el) => {
  counterObserver.observe(el);
});

/* ── SKILL BARS ──────────────────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-fill").forEach((fill) => {
          fill.style.width = fill.getAttribute("data-width") + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".skill-category").forEach((cat) => {
  skillObserver.observe(cat);
});

/* ── PROJECT FILTERING & SEARCH ──────────────────────────────── */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const searchInput = document.getElementById("project-search");
const noResults = document.getElementById("no-results");

let activeFilter = "all";
let searchQuery = "";

function filterProjects() {
  let visible = 0;
  projectCards.forEach((card) => {
    const tags = card.getAttribute("data-tags") || "";
    const name = card.getAttribute("data-name") || "";
    const matchFilter = activeFilter === "all" || tags.includes(activeFilter);
    const matchSearch =
      !searchQuery ||
      name.includes(searchQuery.toLowerCase()) ||
      tags.includes(searchQuery.toLowerCase());
    const show = matchFilter && matchSearch;
    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });
  noResults.hidden = visible > 0;
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter");
    filterProjects();
  });
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  filterProjects();
});

/* ── TESTIMONIALS SLIDER ─────────────────────────────────────── */
const track = document.getElementById("testimonial-track");
const cards = track.querySelectorAll(".testimonial-card");
const dotsContainer = document.getElementById("testimonial-dots");
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");
let currentSlide = 0;
let slideTimer;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
  dot.setAttribute("aria-selected", i === 0);
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(idx) {
  currentSlide = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsContainer.querySelectorAll(".testimonial-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
    dot.setAttribute("aria-selected", i === currentSlide);
  });
  resetTimer();
}

prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

function resetTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

resetTimer();

// Pause on hover
track.addEventListener("mouseenter", () => clearInterval(slideTimer));
track.addEventListener("mouseleave", resetTimer);

// Touch/swipe
let touchStartX = 0;
track.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].clientX;
  },
  { passive: true },
);
track.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50)
      goToSlide(delta < 0 ? currentSlide + 1 : currentSlide - 1);
  },
  { passive: true },
);

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form = document.getElementById("contact-form");

function showError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add("error");
  error.textContent = msg;
  return false;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove("error");
  error.textContent = "";
}

function validateForm() {
  let valid = true;
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const subject = document.getElementById("contact-subject").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  clearError("contact-name", "name-error");
  clearError("contact-email", "email-error");
  clearError("contact-subject", "subject-error");
  clearError("contact-message", "message-error");

  if (!name) {
    showError("contact-name", "name-error", "Please enter your full name.");
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(
      "contact-email",
      "email-error",
      "Please enter a valid email address.",
    );
    valid = false;
  }
  if (!subject) {
    showError("contact-subject", "subject-error", "Please enter a subject.");
    valid = false;
  }
  if (message.length < 15) {
    showError(
      "contact-message",
      "message-error",
      "Message must be at least 15 characters.",
    );
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const submitText = document.getElementById("submit-text");
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitText.textContent = "Sending…";

  // Simulate send
  await new Promise((res) => setTimeout(res, 1500));

  submitBtn.disabled = false;
  submitText.textContent = "Send Message";
  form.reset();
  showToast("Message sent! I'll get back to you soon. 🎉", "success");
});

/* ── TOAST ───────────────────────────────────────────────────── */
const toast = document.getElementById("toast");
let toastTimer;

function showToast(msg, type = "success") {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className = "toast " + type;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ── FOOTER YEAR ─────────────────────────────────────────────── */
document.getElementById("footer-year").textContent = new Date().getFullYear();

/* ── STAGGER ANIMATION FOR CARDS ─────────────────────────────── */
function applyStagger(selector, delay = 100) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * delay}ms`;
  });
}

applyStagger(".skill-category", 80);
applyStagger(".service-card", 80);
applyStagger(".project-card", 60);
applyStagger(".about-card", 80);

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

/* ── KEYBOARD NAVIGATION ─────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu
    if (mobileMenu.classList.contains("open")) {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  }
});

/* ── LAZY IMAGE LOADING (future images) ─────────────────────── */
if ("loading" in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for older browsers
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  document
    .querySelectorAll("img[data-src]")
    .forEach((img) => lazyObserver.observe(img));
}

/* ── HERO PARALLAX ───────────────────────────────────────────── */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener(
    "scroll",
    () => {
      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        const offset = window.scrollY;
        heroContent.style.transform = `translateY(${offset * 0.15}px)`;
      }
    },
    { passive: true },
  );
}

/* ── PERFORMANCE: MARK INTERACTIVE ──────────────────────────── */
if (window.performance && window.performance.mark) {
  window.performance.mark("ej-portfolio-interactive");
}
