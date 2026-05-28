/* ═══════════════════════════════════════════════════════════════
   script.js — Apoorv Jain Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ─── 1. CORE SELECTORS ─────────────────────────────────────── */
const menuIcon       = document.querySelector("#menu-icon");
const navbar         = document.querySelector(".navbar");
const themeToggle    = document.querySelector("#darkMode-icon");
const contactForm    = document.querySelector("#contactForm");
const activitySection = document.querySelector("#activity");
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
const safeSessionStorageGet = (key) => {
  try { return sessionStorage.getItem(key); } catch { return null; }
};
const safeSessionStorageSet = (key, val) => {
  try { sessionStorage.setItem(key, val); } catch { /* quota/private mode */ }
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

  /* Stop the marquee */
  document.querySelectorAll(".marquee-track").forEach((t) => {
    t.style.animation = "none";
  });
}

/* ─── 4. MOBILE MENU TOGGLE ─────────────────────────────────── */
if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-x", isOpen);
    menuIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}

/* ─── 5. DARK MODE ──────────────────────────────────────────── */
/* Restore saved preference as early as possible (body class only) */
if (safeLocalStorageGet("portfolio-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle?.classList.replace("bx-moon", "bx-sun");
}

/* Swap GitHub stats img after DOM is ready (Fix 8) */
document.addEventListener("DOMContentLoaded", () => {
  if (safeLocalStorageGet("portfolio-theme") === "dark") {
    const ghImg = document.getElementById("github-stats-img");
    if (ghImg) {
      ghImg.src = "https://github-readme-stats.vercel.app/api?username=apoorv-jn24&show_icons=true&theme=dark&hide_border=true&count_private=true";
    }
  }
});

themeToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.classList.toggle("bx-sun", isDark);
  themeToggle.classList.toggle("bx-moon", !isDark);
  safeLocalStorageSet("portfolio-theme", isDark ? "dark" : "light");

  /* Swap GitHub stats card theme */
  const ghImg = document.getElementById("github-stats-img");
  if (ghImg) {
    ghImg.src = `https://github-readme-stats.vercel.app/api?username=apoorv-jn24&show_icons=true&theme=${isDark ? "dark" : "default"}&hide_border=true&count_private=true`;
  }
});

/* ─── 6 + 7. SCROLL REVEAL & SECTION VISIBILITY (consolidated — Fix 6) ── */
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
  document.querySelectorAll(".reveal-on-scroll, section").forEach((el) => {
    revealObserver.observe(el);
  });
}

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
        document.body.style.overflow = "";
      }
    });
  });
});

/* ─── 10. SCROLL PROGRESS BAR + SCROLL-TO-TOP BUTTON ────────── */
/* Fix 32 — passive listener + rAF throttle for scroll performance */
if (scrollToTopBtn) {
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        /* Progress bar */
        if (scrollProgress) {
          const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
          scrollProgress.style.width = `${pct}%`;
        }
        /* Show/hide button */
        scrollToTopBtn.classList.toggle("visible", window.scrollY > 300);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducer.matches ? "auto" : "smooth" });
  });
}

/* ─── 11. TYPED.JS HERO SUBTITLE ────────────────────────────── */
/* Use window 'load' event (Fix 1) so both defer scripts are guaranteed parsed */
window.addEventListener("load", () => {
  const typedEl = document.querySelector("#typed-output");
  if (!typedEl) return;

  const roles = [
    "Full-Stack Developer",
    "Problem Solver",
    "Java & React Developer",
    "Open Source Contributor",
  ];

  if (reducer.matches || typeof Typed === "undefined") {
    typedEl.textContent = roles[0];
    return;
  }

  new Typed("#typed-output", {
    strings: roles,
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  });
});

/* ─── 12. DYNAMIC COPYRIGHT YEAR ────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector(".footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* Fix 18 — Textarea character counter */
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

/* Fix 20 — Project filter bar */
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
        card.style.display = show ? '' : 'none';
      });
    });
  });
});

/* ─── 13. COPY EMAIL TO CLIPBOARD ───────────────────────────── */
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

/* ─── 14. GITHUB API + CACHING ──────────────────────────────── */
const GITHUB_CACHE_MS = 30 * 60 * 1000; /* 30 minutes */

const setText = (selector, value, scope = document) => {
  const el = scope.querySelector(selector);
  if (el) el.textContent = value;
};

const formatNumber = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n.toLocaleString() : "--";
};

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return "Recently";
  const days = Math.max(1, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000));
  return days === 1 ? "1 day ago" : `${days} days ago`;
};

const renderGithubEvents = (events) => {
  const feed = activitySection?.querySelector("[data-github-events]");
  if (!feed) return;

  const items = events
    .filter((e) => ["PushEvent", "CreateEvent", "PullRequestEvent"].includes(e.type))
    .slice(0, 4);

  if (!items.length) {
    feed.innerHTML = '<li class="feed-item muted">No recent public activity found.</li>';
    return;
  }

  feed.innerHTML = items.map((e) => {
    let action = "Updated activity";
    if (e.type === "PushEvent") {
      const c = e.payload?.commits?.length || 0;
      action = `Pushed ${c} commit${c === 1 ? "" : "s"} to ${e.repo.name}`;
    } else if (e.type === "CreateEvent") {
      action = `Created ${e.payload?.ref_type || "item"} in ${e.repo.name}`;
    } else if (e.type === "PullRequestEvent") {
      action = `${e.payload?.action || "Updated"} pull request in ${e.repo.name}`;
    }
    return `<li class="feed-item"><span>${action}</span><strong>${formatRelativeDate(e.created_at)}</strong></li>`;
  }).join("");
};

const loadGithubActivity = async (username) => {
  const cacheKey = `github-activity-${username}`;
  let profile, events;

  /* Try cache first */
  try {
    const cached = safeSessionStorageGet(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < GITHUB_CACHE_MS) {
        profile = parsed.profile;
        events  = parsed.events;
      }
    }
  } catch { /* corrupt cache — ignore */ }

  /* Fetch if cache miss */
  if (!profile || !events) {
    try {
      const [pRes, eRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=10`),
      ]);

      if (!pRes.ok || !eRes.ok) throw new Error("GitHub API error");

      profile = await pRes.json();
      events  = await eRes.json();

      safeSessionStorageSet(cacheKey, JSON.stringify({ timestamp: Date.now(), profile, events }));
    } catch {
      /* Show graceful fallback */
      setText("[data-github-followers]", "--", activitySection);
      setText("[data-github-repos]",    "--", activitySection);
      setText("[data-github-following]","--", activitySection);
      setText("[data-github-pushes]",   "--", activitySection);
      setText("[data-github-updated]",  "GitHub API unavailable", activitySection);
      const feed = activitySection?.querySelector("[data-github-events]");
      if (feed) feed.innerHTML = '<li class="feed-item muted">GitHub activity is temporarily unavailable.</li>';
      return;
    }
  }

  /* Populate stats */
  setText("[data-github-followers]", formatNumber(profile.followers),   activitySection);
  setText("[data-github-repos]",     formatNumber(profile.public_repos), activitySection);
  setText("[data-github-following]", formatNumber(profile.following),   activitySection);
  setText(
    "[data-github-pushes]",
    formatNumber(events.filter((e) => e.type === "PushEvent").length),
    activitySection
  );
  setText(
    "[data-github-updated]",
    `Updated ${formatRelativeDate(events[0]?.created_at)}`,
    activitySection
  );
  renderGithubEvents(events);
};

if (activitySection?.dataset.githubUsername) {
  loadGithubActivity(activitySection.dataset.githubUsername);
}

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
