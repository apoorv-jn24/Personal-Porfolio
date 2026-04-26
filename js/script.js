/* ═══════════════════ SELECTORS ═══════════════════ */
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

const themeToggle = document.querySelector("#darkMode-icon");
const contactForm = document.querySelector("#contactForm");
const activitySection = document.querySelector("#activity");
const scrollToTopBtn = document.querySelector("#scrollToTopBtn");

/* ═══════════════════ MOBILE MENU TOGGLE ═══════════════════ */
if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });
}
/* Scroll-spy handled by IntersectionObserver below */

/* ═══════════════════ DARK MODE ═══════════════════ */
const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle?.classList.replace("bx-moon", "bx-sun");
  // Set initial dark theme for github stats
  const ghStatsImg = document.getElementById("github-stats-img");
  if(ghStatsImg) {
      ghStatsImg.src = `https://github-readme-stats.vercel.app/api?username=apoorv-jn24&show_icons=true&theme=dark&hide_border=true&count_private=true`;
  }
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.classList.toggle("bx-sun", isDark);
  themeToggle.classList.toggle("bx-moon", !isDark);
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  // Update GitHub stats theme
  const ghStatsImg = document.getElementById("github-stats-img");
  if(ghStatsImg) {
      ghStatsImg.src = `https://github-readme-stats.vercel.app/api?username=apoorv-jn24&show_icons=true&theme=${isDark ? 'dark' : 'default'}&hide_border=true&count_private=true`;
  }
});

/* ═══════════════════ SCROLL REVEAL ═══════════════════ */
const revealItems = document.querySelectorAll(".reveal-on-scroll");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ═══════════════════ SCROLL-TO-TOP BUTTON ═══════════════════ */
if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ═══════════════════ TYPED.JS HERO SUBTITLE ═══════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Typed !== "undefined" && document.querySelector("#typed-output")) {
    new Typed("#typed-output", {
      strings: [
        "Full-Stack Developer",
        "Problem Solver",
        "Java & React Developer",
        "Open Source Contributor",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }
});

/* ═══════════════════ DYNAMIC COPYRIGHT YEAR ═══════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("#copyrightYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/* ═══════════════════ COPY-TO-CLIPBOARD ═══════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-email-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.email;
      if (!email) return;

      navigator.clipboard
        .writeText(email)
        .then(() => {
          btn.classList.add("copied");
          const tooltip = btn.querySelector(".copy-tooltip");
          if (tooltip) {
            tooltip.style.opacity = "1";
            tooltip.style.transform = "translateY(-4px)";
          }

          // Change icon temporarily
          const icon = btn.querySelector("i");
          if (icon) {
            icon.classList.replace("bx-copy", "bx-check");
          }

          setTimeout(() => {
            btn.classList.remove("copied");
            if (tooltip) {
              tooltip.style.opacity = "0";
              tooltip.style.transform = "translateY(0)";
            }
            if (icon) {
              icon.classList.replace("bx-check", "bx-copy");
            }
          }, 2000);
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        });
    });
  });
});

/* ═══════════════════ CHATBOT ═══════════════════ */
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  chatLi.innerHTML =
    className === "outgoing" ? "<p></p>" : '<i class="bx bx-bot"></i><p></p>';
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (chatElement, userMessage) => {
  const messageElement = chatElement.querySelector("p");
  const msg = userMessage.toLowerCase();
  let response =
    "I'm not sure about that! But you can easily reach out to Apoorv directly via the contact form below.";

  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
    response =
      "Hello! I'm Apoorv's virtual assistant. Ask me about skills, education, experience, or projects.";
  } else if (
    msg.includes("skill") ||
    msg.includes("tech") ||
    msg.includes("stack")
  ) {
    response =
      "Apoorv works with Java, Python, React, Node.js, Spring Boot, and modern DevOps tools like Git, Docker, and Maven.";
  } else if (
    msg.includes("education") ||
    msg.includes("college") ||
    msg.includes("degree")
  ) {
    response =
      "He is pursuing a B.Tech in Computer Science at Coer University (2022–2026) with a CGPA of 8.72/10.";
  } else if (msg.includes("project") || msg.includes("build")) {
    response =
      "He has built 6+ projects including a full-stack trading marketplace, e-commerce clones, a budget tracker, and this interactive portfolio.";
  } else if (msg.includes("experience") || msg.includes("intern")) {
    response =
      "He completed two internships at CodSoft — as a Java Developer (2024) and Python Developer (2023), building desktop apps and Python utilities.";
  } else if (
    msg.includes("contact") ||
    msg.includes("email") ||
    msg.includes("hire")
  ) {
    response =
      "You can email him at apoorvjainji@gmail.com or use the contact form on this page. He's open to opportunities!";
  } else if (msg.includes("leetcode") || msg.includes("dsa")) {
    response =
      "Apoorv has solved 200+ LeetCode problems with a 200-day streak and a Gold badge. His focus areas are Arrays, Trees, and Dynamic Programming.";
  }

  setTimeout(() => {
    messageElement.textContent = response;
    chatbox?.scrollTo(0, chatbox.scrollHeight);
  }, 500);
};

const handleChat = () => {
  const userMessage = chatInput?.value.trim();
  if (!userMessage || !chatbox || !chatInput) {
    return;
  }

  chatInput.value = "";
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi, userMessage);
  }, 500);
};

chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleChat();
  }
});

sendChatBtn?.addEventListener("click", handleChat);
closeBtn?.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot"),
);
chatbotToggler?.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot"),
);

/* ═══════════════════ GITHUB API ═══════════════════ */
const setText = (selector, value, scope = document) => {
  const element = scope.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : "--";
};

const formatRelativeDate = (dateString) => {
  if (!dateString) {
    return "Recently";
  }

  const date = new Date(dateString);
  const diffInMs = Date.now() - date.getTime();
  const diffInDays = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));

  return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
};

const renderGithubEvents = (events) => {
  const feed = activitySection?.querySelector("[data-github-events]");
  if (!feed) {
    return;
  }

  const eventItems = events
    .filter((event) =>
      ["PushEvent", "CreateEvent", "PullRequestEvent"].includes(event.type),
    )
    .slice(0, 4);

  if (!eventItems.length) {
    feed.innerHTML =
      '<li class="feed-item muted">Public event data is not available right now.</li>';
    return;
  }

  feed.innerHTML = eventItems
    .map((event) => {
      let action = "Updated activity";

      if (event.type === "PushEvent") {
        const commits = event.payload?.commits?.length || 0;
        action = `Pushed ${commits} commit${commits === 1 ? "" : "s"} to ${event.repo.name}`;
      } else if (event.type === "CreateEvent") {
        action = `Created ${event.payload?.ref_type || "item"} in ${event.repo.name}`;
      } else if (event.type === "PullRequestEvent") {
        action = `${event.payload?.action || "Updated"} pull request in ${event.repo.name}`;
      }

      return `<li class="feed-item"><span>${action}</span><strong>${formatRelativeDate(event.created_at)}</strong></li>`;
    })
    .join("");
};

const loadGithubActivity = async (username) => {
  try {
    const [profileResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/events/public?per_page=10`,
      ),
    ]);

    if (!profileResponse.ok || !eventsResponse.ok) {
      throw new Error("GitHub data unavailable");
    }

    const profile = await profileResponse.json();
    const events = await eventsResponse.json();

    setText(
      "[data-github-followers]",
      formatNumber(profile.followers),
      activitySection,
    );
    setText(
      "[data-github-repos]",
      formatNumber(profile.public_repos),
      activitySection,
    );
    setText(
      "[data-github-following]",
      formatNumber(profile.following),
      activitySection,
    );
    setText(
      "[data-github-pushes]",
      formatNumber(events.filter((event) => event.type === "PushEvent").length),
      activitySection,
    );
    setText(
      "[data-github-updated]",
      `Updated ${formatRelativeDate(events[0]?.created_at)}`,
      activitySection,
    );

    renderGithubEvents(events);
  } catch (error) {
    setText("[data-github-followers]", "Live", activitySection);
    setText("[data-github-repos]", "Live", activitySection);
    setText("[data-github-following]", "Live", activitySection);
    setText("[data-github-pushes]", "N/A", activitySection);
    setText("[data-github-updated]", "GitHub API unavailable", activitySection);

    const feed = activitySection?.querySelector("[data-github-events]");
    if (feed) {
      feed.innerHTML =
        '<li class="feed-item muted">GitHub activity is temporarily unavailable.</li>';
    }
  }
};

if (activitySection?.dataset.githubUsername) {
  loadGithubActivity(activitySection.dataset.githubUsername);
}

/* ═══════════════════ CONTACT FORM VALIDATION ═══════════════════ */
const setFieldError = (field, message) => {
  const wrapper = field.closest(".cf-field");
  wrapper?.classList.add("has-error");
  const error = wrapper?.querySelector(".error-message");
  if (error) {
    error.textContent = message;
  }
};

const clearFieldError = (field) => {
  const wrapper = field.closest(".cf-field");
  wrapper?.classList.remove("has-error");
  const error = wrapper?.querySelector(".error-message");
  if (error) {
    error.textContent = "";
  }
};

const validateField = (field) => {
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setFieldError(field, "Please enter a valid email address.");
      return false;
    }
  }

  clearFieldError(field);
  return true;
};

contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => validateField(field));
});

contactForm?.addEventListener("submit", (event) => {
  const fields = contactForm.querySelectorAll("input, textarea");
  let isValid = true;

  fields.forEach((field) => {
    if (field.type === "hidden" || field.type === "submit") {
      return;
    }

    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!isValid) {
    event.preventDefault();
  }
});

/* ═══════════════════ SECTION VISIBILITY ANIMATIONS ═══════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll("section").forEach((s) => observer.observe(s));
});

/* ═══════════════════ SMOOTH SCROLL FOR FOOTER LINKS ═══════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".footer-nav a, .navbar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });

          // Close mobile menu if open
          if (navbar && menuIcon) {
            navbar.classList.remove("active");
            menuIcon.classList.remove("bx-x");
          }
        }
      }
    });
  });
});

// === NEW: Active nav IntersectionObserver at threshold 0.4 (Fix #13) ===
// Replaces the scroll-position approach with a proper IntersectionObserver.
(function () {
  const allSections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll("header nav a[href^='#']");

  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          allNavLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  allSections.forEach((sec) => activeSectionObserver.observe(sec));
})();

// === Contact form — Formspree AJAX submit with spinner + inline error messages ===
(function () {
  var form = document.querySelector("#contactForm");
  var submitBtn = document.querySelector("#cfSubmitBtn");
  var successMsg = document.querySelector("#formSuccess");
  var errorMsg = document.querySelector("#formError");
  var notice = document.querySelector("#formspreeNotice");

  if (!form) return;

  // ── Show setup notice if Formspree ID is still a placeholder ──
  var action = form.getAttribute("action") || "";
  if (action.includes("YOUR_FORM_ID") || action.trim() === "") {
    if (notice) notice.style.display = "block";
  }

  // ── Blur-time validation ──
  form
    .querySelectorAll("input:not([type='hidden']), textarea")
    .forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

  // ── Submit handler ──
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Validate all visible fields
    var fields = form.querySelectorAll("input:not([type='hidden']), textarea");
    var isValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });
    if (!isValid) return;

    // ── Loading state: add .loading class for CSS-driven spinner ──
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
    }
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";

    try {
      var data = new FormData(form);
      var res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        // ── Success ──
        form.reset();
        // Reset floating labels (clear :not(:placeholder-shown) state)
        form.querySelectorAll("input, textarea").forEach(function (f) {
          f.blur();
        });
        // Clear validation error states
        form.querySelectorAll(".cf-field").forEach(function (w) {
          w.classList.remove("has-error");
          var err = w.querySelector(".error-message");
          if (err) err.textContent = "";
        });
        if (successMsg) {
          successMsg.style.display = "block";
          setTimeout(function () {
            successMsg.style.display = "none";
          }, 6000);
        }
      } else {
        // ── Server error — show inline error div ──
        var json = {};
        try { json = await res.json(); } catch (_) {}
        if (errorMsg) {
          errorMsg.style.display = "block";
          setTimeout(function () {
            errorMsg.style.display = "none";
          }, 8000);
        }
      }
    } catch (err) {
      // ── Network error — show inline error div ──
      if (errorMsg) {
        errorMsg.style.display = "block";
        setTimeout(function () {
          errorMsg.style.display = "none";
        }, 8000);
      }
    } finally {
      // ── Always restore button ──
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }
    }
  });
})();
