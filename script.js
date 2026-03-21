/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Ring follows with lerp for smoothness
function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .chip, .cert-row, .about-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '1';
});


/* ══════════════════════════════════════════
   HEADER — scroll state + active nav
══════════════════════════════════════════ */
const header = document.getElementById('header');

function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const y = window.scrollY + 140;

    sections.forEach(sec => {
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (!link) return;
        const inView = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
        link.classList.toggle('active', inView);
    });
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();


/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
const burger = document.getElementById('burger');
const mobOverlay = document.getElementById('mobOverlay');

burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobOverlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
});


/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
const twEl = document.getElementById('typewriter');
const roles = ['Frontend Developer', 'UI Designer', 'Web Developer', 'Problem Solving'];
let rIdx = 0, cIdx = 0, deleting = false;

function typewrite() {
    const role = roles[rIdx];

    if (!deleting) {
        twEl.textContent = role.slice(0, ++cIdx);
        if (cIdx === role.length) {
            deleting = true;
            return setTimeout(typewrite, 1800);
        }
    } else {
        twEl.textContent = role.slice(0, --cIdx);
        if (cIdx === 0) {
            deleting = false;
            rIdx = (rIdx + 1) % roles.length;
        }
    }

    setTimeout(typewrite, deleting ? 55 : 95);
}
typewrite();


/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // cert-row stagger
        const row = el.closest('.cert-row');
        if (row && row.dataset.delay) {
            el.style.transitionDelay = `${Number(row.dataset.delay) * 0.1}s`;
        }

        el.classList.add('visible');
        revealObs.unobserve(el);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ══════════════════════════════════════════
   SMOOTH SCROLL (offset for fixed header)
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});


/* ══════════════════════════════════════════
   CERT ROW — mouse glow
══════════════════════════════════════════ */
document.querySelectorAll('.cert-row').forEach(row => {
    row.addEventListener('mousemove', e => {
        const r = row.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        row.style.background =
            `radial-gradient(circle at ${x}px ${y}px, rgba(79,142,247,0.06) 0%, var(--bg-3) 55%)`;
    });
    row.addEventListener('mouseleave', () => {
        row.style.background = '';
    });
});


/* ══════════════════════════════════════════
   PAGE LOAD — trigger hero reveals
══════════════════════════════════════════ */
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
        // let IntersectionObserver handle it (hero is in viewport)
    });
});