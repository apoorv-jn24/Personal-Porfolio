/*========== Menu Icon Navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/*========== Scroll Sections Active Link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            let activeLink = document.querySelector('header nav a[href*=' + id + ']');
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    /*========== Sticky Navbar ==========*/
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /*========== Close Menu on Scroll ==========*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

/*========== Swiper Initialization ==========*/
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*========== Dark Light Mode Toggle ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

if (darkModeIcon) {
    darkModeIcon.onclick = () => {
        darkModeIcon.classList.toggle('bx-sun');
        document.body.classList.toggle('dark-mode');
    };
}

/*========== Scroll Reveal ==========*/
ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });

/*========== Chatbot Functionality ==========*/
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");

let userMessage = null; 

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<i class="bx bx-bot"></i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement, userMessage) => {
    const messageElement = chatElement.querySelector("p");
    
    // Smart Portfolio Assistant Logic
    let response = "I'm not sure about that! But you can easily reach out to Apoorv directly via the contact form below. 😊";
    const msg = userMessage.toLowerCase();

    if(msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
        response = "Hello! 👋 I'm Apoorv's virtual assistant. Ask me about his skills, education, experience, or projects!";
    } else if(msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("know")) {
        response = "Apoorv is highly skilled in Frontend (HTML, CSS, JS, React, Tailwind) and Backend/Core (Java, Python, C++, SQL). He's also a DSA enthusiast!";
    } else if(msg.includes("education") || msg.includes("college") || msg.includes("study") || msg.includes("degree")) {
        response = "He is currently pursuing his B.Tech in Computer Science at Coer University (2022-2026), maintaining an excellent 8.72 CGPA.";
    } else if(msg.includes("project") || msg.includes("build") || msg.includes("made")) {
        response = "He has built several projects: a GUI Tic Tac Toe game, an Amazon Shopping UI clone, and this interactive portfolio! Check the 'Projects' section for links.";
    } else if(msg.includes("experience") || msg.includes("intern") || msg.includes("work")) {
        response = "He has completed internships at CodSoft as a Python Developer (Aug '23) and Java Developer (Aug '24), building foundational apps and polishing his OOP logic.";
    } else if(msg.includes("contact") || msg.includes("hire") || msg.includes("email") || msg.includes("phone")) {
        response = "You can email him at apoorvjainji@gmail.com, call +91 8477838480, or use the contact form at the bottom of the page! Let's build something meaningful.";
    } else if(msg.includes("who are you") || msg.includes("about") || msg.includes("name")) {
        response = "Apoorv Jain is a passionate Web Developer, Problem Solver, and a final-year CS student from Roorkee. He loves turning ideas into interactive apps!";
    } else if(msg.includes("certif") || msg.includes("achievement")) {
        response = "Apoorv holds a 200-Day LeetCode Streak badge, a Deloitte Tech Job Simulation certificate, and certifications from Duke University and freeCodeCamp!";
    }

    setTimeout(() => {
        messageElement.textContent = response;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    chatInput.value = "";
    
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
}

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
