/* ============================================================
   script.js — Chapters: Complete JavaScript
============================================================ */

/* ============================================================
   1. TYPEWRITER
============================================================ */
const words = ['learner.', 'problem solver.', 'curious.', 'free.', 'human.'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typewriterEl = document.getElementById('typewriterText');

function typeWriter() {
  if (!typewriterEl) return;
  const currentWord = words[wordIndex];
  if (!isDeleting) {
    typewriterEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1400);
      return;
    }
  } else {
    typewriterEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeWriter, isDeleting ? 55 : 95);
}
typeWriter();

/* ============================================================
   2. SCROLL — progress bar + navbar shadow + active nav link
============================================================ */
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (progressBar) {
    const scrolled   = window.scrollY;
    const scrollable = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / scrollable) * 100) + '%';
  }
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  highlightActiveNavLink();
});

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  sections.forEach(function (section) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ============================================================
   3. MOBILE HAMBURGER
============================================================ */
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
  // close menu when any mobile link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });
}

/* ============================================================
   4. TIMELINE YEAR SELECTOR
============================================================ */
const yearData = [
  {
    title: 'Year 1 — The Lost Beginning',
    tags: [
      { label: 'scared', style: 'amber' }, { label: 'clueless', style: 'coral' },
      { label: 'excited', style: 'amber' }, { label: 'confused', style: 'coral' },
      { label: 'curious', style: 'amber' }
    ],
    text: 'I walked into college filled with doubts about fitting in and keeping up. Little did I know, I was about to begin the most memorable four years of my life.',
    readLabel: 'Read Year 1 in depth'
  },
  {
    title: 'Year 2 — Confusion Core',
    tags: [
      { label: 'growth', style: 'amber' }, { label: 'chaos', style: 'coral' },
      { label: 'finding comfort', style: 'amber' }, { label: 'first ever failure', style: 'coral' }
    ],
    text: 'The year began with a new internship that changed how I viewed college. I built meaningful connections, found a sense of belonging, and learned that every high comes with its own lessons.',
    readLabel: 'Read Year 2 in depth'
  },
  {
    title: 'Year 3 — Finding Myself',
    tags: [
      { label: 'stability', style: 'amber' }, { label: 'introspection', style: 'coral' },
      { label: 'self realisation', style: 'amber' }, { label: 'stress', style: 'coral' },
      { label: 'more stress', style: 'amber' }
    ],
    text: 'I found my footing, grew into myself, and made progress on every front. Though setbacks returned, so did my determination to bounce back stronger.',
    readLabel: 'Read Year 3 in depth'
  },
  {
    title: 'Year 4 — The Full Picture',
    tags: [
      { label: 'uncertainty', style: 'amber' }, { label: 'even more stress', style: 'coral' },
      { label: 'goodbyes', style: 'amber' }, { label: 'endings', style: 'coral' }
    ],
    text: 'Four years of late nights, broken code, and breakthroughs. This website is my attempt to show all of it honestly — the mess and the growth.',
    readLabel: 'Read Year 4 in depth'
  }
];

const semYearMap = ['y1', 'y2', 'y3', 'y4'];

function selectYear(index) {
  document.querySelectorAll('.year-node').forEach(function (node, i) {
    node.classList.toggle('active', i === index);
  });
  const data = yearData[index];
  const yearTitle   = document.getElementById('yearTitle');
  const yearTags    = document.getElementById('yearTags');
  const yearText    = document.getElementById('yearText');
  const yearDetail  = document.getElementById('yearDetail');
  const yearReadMore = document.getElementById('yearReadMore');

  if (yearTitle)  yearTitle.textContent = data.title;
  if (yearText)   yearText.textContent  = data.text;
  if (yearReadMore) yearReadMore.textContent = data.readLabel + ' ↓';

  if (yearTags) {
    yearTags.innerHTML = '';
    data.tags.forEach(function (tag) {
      const span = document.createElement('span');
      span.className   = 'tag ' + tag.style;
      span.textContent = tag.label;
      yearTags.appendChild(span);
    });
  }

  // auto-switch the semester section to match
  const matchTab = document.querySelector('.sem-tab[data-for="' + semYearMap[index] + '"]');
  if (matchTab) switchSemYear(matchTab, semYearMap[index]);

  // re-trigger fade animation
  if (yearDetail) {
    yearDetail.style.animation = 'none';
    setTimeout(function () { yearDetail.style.animation = ''; }, 10);
  }
}

if (document.getElementById('yearTitle')) selectYear(0);

/* ============================================================
   5. GALLERY FILTER + LIGHTBOX
============================================================ */
const galleryData = [
  { title: 'Hostel Family',   year: 'Year 1', src: 'photos/y11.jpg'  },
  { title: 'DASA',            year: 'Year 1', src: 'photos/y12.jpg'  },
  { title: 'My Birthday',     year: 'Year 2', src: 'photos/y21.jpg' },
  { title: 'My Best Friend',  year: 'Year 2', src: 'photos/y22.jpg'  },
  { title: 'Team Meetings',   year: 'Year 3', src: 'photos/y31.jpg' },
  { title: 'Reunited',        year: 'Year 3', src: 'photos/y32.jpg'  },
  { title: 'Final Year',      year: 'Year 4', src: 'photos/y41.jpg'  },
  { title: 'Demo Day',        year: 'Year 4', src: 'photos/y42.jpg'  },
];

let currentLightboxIndex = 0;

function filterGallery(btn, year) {
  document.querySelectorAll('.g-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.g-item').forEach(function (item, i) {
    const matches = year === 'all' || item.dataset.year === year;
    item.classList.remove('g-visible', 'g-hidden');
    if (matches) {
      item.classList.remove('g-hidden');
      // staggered re-entrance
      setTimeout(function () { item.classList.add('g-visible'); }, i * 60);
    } else {
      item.classList.add('g-hidden');
    }
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  renderLightbox(index);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox(index) {
  const data    = galleryData[index];
  const content = document.getElementById('lightboxContent');
  content.innerHTML = `
    <img src="${data.src}" alt="${data.title}" />
    <p class="lightbox-caption">${data.title} · ${data.year}</p>`;
}

function lightboxNav(e, direction) {
  e.stopPropagation(); // don't close lightbox when clicking prev/next
  currentLightboxIndex = (currentLightboxIndex + direction + galleryData.length) % galleryData.length;
  renderLightbox(currentLightboxIndex);
}

// close lightbox with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(e, 1);
  if (e.key === 'ArrowLeft')  lightboxNav(e, -1);
});

// initialise gallery
document.querySelectorAll('.g-item').forEach(function (item, i) {
  setTimeout(function () { item.classList.add('g-visible'); }, i * 80);
});

/* ============================================================
   8. SCROLL REVEAL (IntersectionObserver)
============================================================ */
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-section').forEach(el => revealObserver.observe(el));

/* ============================================================
   9. SKILL BAR ANIMATION
   Triggered when the connect section scrolls into view
============================================================ */
const skillObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const connectSection = document.getElementById('connect');
if (connectSection) skillObserver.observe(connectSection);

/* ============================================================
   CURSOR TRAIL
   Creates a falling leaf on every mouse move
============================================================ */
const leafColors = ['#97C459', '#639922', '#3B6D11', '#C0DD97', '#EF9F27'];

document.addEventListener('mousemove', function (e) {
  const leaf = document.createElement('div');
  leaf.className = 'cursor-leaf';

  // random colour from our green/amber palette
  leaf.style.background = leafColors[Math.floor(Math.random() * leafColors.length)];

  // place it at cursor position
  leaf.style.left = e.clientX + 'px';
  leaf.style.top  = e.clientY + 'px';

  document.body.appendChild(leaf);

  // trigger the fall animation on next frame
  requestAnimationFrame(function () {
    leaf.style.transform = 'translate('
      + (Math.random() * 40 - 20) + 'px, '
      + (30 + Math.random() * 20) + 'px) rotate(180deg)';
    leaf.style.opacity = '0';
  });

  // remove from DOM after animation completes
  setTimeout(function () { leaf.remove(); }, 620);
});