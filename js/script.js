/* ═══════════════════════════════════════════════════════════════
   script.js — Apoorv Jain Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ─── 1. CORE SELECTORS ─────────────────────────────────────── */
const menuIcon       = document.querySelector("#menu-icon");
const navbar         = document.querySelector(".navbar");
const themeToggle    = document.querySelector("#darkMode-icon");
const contactForm    = document.querySelector("#contactForm");
const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
const scrollProgress = document.querySelector(".scroll-progress");

/* Reduced-motion preference — used throughout */
const reducer = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ─── 2. SAFE STORAGE HELPERS ───────────────────────────────── */
const safeLocalStorageGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeLocalStorageSet = (key, val) => {
  try { localStorage.setItem(key, val); } catch { /* quota/private mode */ }
};

/* ─── 3. REDUCED-MOTION: SKIP ANIMATIONS ───────────────────── */
if (reducer.matches) {
  document.documentElement.style.scrollBehavior = "auto";

  /* Instantly reveal all scroll-animated sections */
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    el.classList.add("revealed");
  });
  document.querySelectorAll("section").forEach((s) => {
    s.classList.add("visible");
  });
}



/* ─── 4. MOBILE MENU TOGGLE ─────────────────────────────────── */
if (menuIcon && navbar) {
  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-x", isOpen);
    menuIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
    
    if (isOpen) {
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
    } else {
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    }
  });

  // Click outside to close mobile menu
  document.addEventListener("click", (e) => {
    if (navbar.classList.contains("active")) {
      if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
        navbar.classList.remove("active");
        menuIcon.classList.remove("bx-x");
        menuIcon.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");
      }
    }
  });
}

/* ─── 5. DARK MODE ──────────────────────────────────────────── */
/* Restore saved preference as early as possible (body class only) */
if (safeLocalStorageGet("portfolio-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle?.classList.replace("bx-moon", "bx-sun");
}

themeToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.classList.toggle("bx-sun", isDark);
  themeToggle.classList.toggle("bx-moon", !isDark);
  safeLocalStorageSet("portfolio-theme", isDark ? "dark" : "light");
});

/* ─── 6 + 7. SCROLL REVEAL & SECTION VISIBILITY (consolidated) ── */
/* Single observer adds both .revealed and .visible simultaneously */
if (!reducer.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed", "visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    revealObserver.observe(el);
  });
}

const header = document.querySelector('.header');
if (header) {
  header.classList.add('floating');
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;

      /* Header floating state */
      if (header) {
        if (y > 10) {
          header.classList.remove('floating');
        } else {
          header.classList.add('floating');
        }
      }

      /* Scroll progress bar */
      if (scrollProgress) {
        const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
        scrollProgress.style.width = `${pct}%`;
      }

      /* Back to top visibility */
      if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle("visible", y > 300);
      }

      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ─── 8. ACTIVE NAV HIGHLIGHT (IntersectionObserver) ────────── */
(function () {
  const sections = document.querySelectorAll(
    "#home, #about, #skills, #activity, #experience, #education, #portfolio, #contact"
  );
  const navLinks = document.querySelectorAll("header nav a[href^='#']");

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-100px 0px -40% 0px", threshold: 0 }
  );

  sections.forEach((sec) => activeObserver.observe(sec));
})();

/* ─── 9. SMOOTH SCROLL (navbar + footer links) ──────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".footer-nav a, .navbar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: reducer.matches ? "auto" : "smooth",
        block: "start",
      });

      /* Close mobile menu if open */
      if (navbar?.classList.contains("active")) {
        navbar.classList.remove("active");
        menuIcon?.classList.remove("bx-x");
        menuIcon?.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");
      }
    });
  });
});

/* ─── 10. SCROLL-TO-TOP BUTTON CLICK ────────────────────────── */
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducer.matches ? "auto" : "smooth" });
  });
}

/* ─── 11. DYNAMIC COPYRIGHT YEAR ────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector(".footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ─── 12. TEXTAREA CHARACTER COUNTER ────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const textarea = contactForm?.querySelector('textarea[name="message"]');
  const counter  = contactForm?.querySelector('.char-counter');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      counter.textContent = `${textarea.value.length} / 1000`;
      counter.style.color = textarea.value.length > 900
        ? 'var(--error-color)'
        : 'var(--muted-color)';
    });
  }
});

/* ─── 13. PROJECT FILTER BAR ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const show = filter === 'all' || tags.includes(filter);

        if (!show) {
          /* Fade out then hide */
          card.classList.add('hiding');
          card.addEventListener('transitionend', function handler() {
            card.style.display = 'none';
            card.removeEventListener('transitionend', handler);
          }, { once: true });
        } else {
          /* Show then fade in */
          card.style.display = '';
          /* rAF ensures display change paints before class flip */
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.remove('hiding'));
          });
        }
      });
    });
  });
});

/* ─── 14. COPY EMAIL TO CLIPBOARD ───────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-email-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.email;
      if (!email) return;

      const finish = (success) => {
        if (!success) return;
        btn.classList.add("copied");
        const tooltip = btn.querySelector(".copy-tooltip");
        const icon    = btn.querySelector("i");

        if (tooltip) { tooltip.style.opacity = "1"; tooltip.style.transform = "translateY(-4px)"; }
        if (icon)    icon.classList.replace("bx-copy", "bx-check");

        setTimeout(() => {
          btn.classList.remove("copied");
          if (tooltip) { tooltip.style.opacity = "0"; tooltip.style.transform = "translateY(0)"; }
          if (icon)    icon.classList.replace("bx-check", "bx-copy");
        }, 2000);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(email).then(() => finish(true)).catch(() => fallbackCopy(email, finish));
      } else {
        fallbackCopy(email, finish);
      }
    });
  });

  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    cb(ok);
  }
});

/* ─── 15. CONTACT FORM VALIDATION HELPERS ───────────────────── */
const setFieldError = (field, msg) => {
  const wrap = field.closest(".cf-field");
  wrap?.classList.add("has-error");
  const err = wrap?.querySelector(".error-message");
  if (err) err.textContent = msg;
};

const clearFieldError = (field) => {
  const wrap = field.closest(".cf-field");
  wrap?.classList.remove("has-error");
  const err = wrap?.querySelector(".error-message");
  if (err) err.textContent = "";
};

const validateField = (field) => {
  const val = field.value.trim();

  if (field.hasAttribute("required") && !val) {
    setFieldError(field, "This field is required.");
    return false;
  }
  if (field.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    setFieldError(field, "Please enter a valid email address.");
    return false;
  }

  clearFieldError(field);
  return true;
};

/* Validate on each keystroke */
contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => validateField(field));
});

/* ─── 16. CONTACT FORM — FORMSPREE AJAX SUBMIT ──────────────── */
(function () {
  const form       = document.querySelector("#contactForm");
  const submitBtn  = document.querySelector("#cfSubmitBtn");
  const successMsg = document.querySelector("#formSuccess");
  const errorMsg   = document.querySelector("#formError");
  const notice     = document.querySelector("#formspreeNotice");

  if (!form) return;

  /* Warn if Formspree ID is still a placeholder */
  const action = form.getAttribute("action") || "";
  if (action.includes("YOUR_FORM_ID") || action.trim() === "") {
    if (notice) notice.style.display = "block";
  }

  /* Blur-time validation */
  form.querySelectorAll("input:not([type='hidden']), textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  /* Submit */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* Validate all fields first */
    const fields = form.querySelectorAll("input:not([type='hidden']), textarea");
    let isValid  = true;
    fields.forEach((f) => { if (!validateField(f)) isValid = false; });
    if (!isValid) return;

    /* Loading state */
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add("loading"); }
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg)   errorMsg.style.display   = "none";

    try {
      const res = await fetch(form.action, {
        method:  "POST",
        body:    new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        const counter = form.querySelector(".char-counter");
        if (counter) counter.textContent = "0 / 1000";
        form.querySelectorAll("input, textarea").forEach((f) => f.blur());
        form.querySelectorAll(".cf-field").forEach((w) => {
          w.classList.remove("has-error");
          const err = w.querySelector(".error-message");
          if (err) err.textContent = "";
        });
        if (successMsg) {
          successMsg.style.display = "block";
          setTimeout(() => { successMsg.style.display = "none"; }, 6000);
        }
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Something went wrong. Please email me directly at apoorvjainji@gmail.com";
          errorMsg.style.display = "block";
          setTimeout(() => { errorMsg.style.display = "none"; }, 8000);
        }
      }
    } catch {
      if (errorMsg) {
        errorMsg.textContent = "Something went wrong. Please email me directly at apoorvjainji@gmail.com";
        errorMsg.style.display = "block";
        setTimeout(() => { errorMsg.style.display = "none"; }, 8000);
      }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove("loading"); }
    }
  });
})();

/* ─── 17. GITHUB HEATMAP ERROR FALLBACK ─────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const heatmapImg = document.getElementById("githubHeatmap");
  if (heatmapImg) {
    heatmapImg.addEventListener("error", () => {
      const container = heatmapImg.closest(".heatmap-container");
      if (container) {
        container.innerHTML = `
          <div class="heatmap-offline" style="text-align: center; padding: 2.5rem 1.5rem; color: var(--muted-color); font-size: 1.4rem;">
            <i class='bx bx-wifi-off' style='font-size: 3.2rem; margin-bottom: 0.8rem; display: block; color: var(--main-color);'></i>
            Contribution graph temporarily offline
          </div>
        `;
      }
    });
    if (heatmapImg.complete && heatmapImg.naturalWidth === 0) {
      heatmapImg.dispatchEvent(new Event("error"));
    }
  }
});
