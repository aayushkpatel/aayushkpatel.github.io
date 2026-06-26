const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.body;
const header = document.querySelector('.site-header');
const navPanel = document.querySelector('.nav-panel');
const menuToggle = document.querySelector('.menu-toggle');
const progressFill = document.querySelector('.page-progress span');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-panel a[href^="#"]');
const sections = [...document.querySelectorAll('main section[id]')];
const typingTarget = document.querySelector('[data-typing]');
const cursorGlow = document.querySelector('.cursor-glow');
const yearElement = document.querySelector('#year');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('[data-emailjs-form]');
const formStatus = document.querySelector('[data-form-status]');

const typingPhrases = [
  'Full-Stack Developer',
  'Python & Flask Developer',
  'Data Analytics Enthusiast',
  'Database Developer'
];

const scrollMargin = 110;
let typingIndex = 0;
let activeTypingTimer = null;

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

yearElement.textContent = new Date().getFullYear();

const setBodyReady = () => {
  body.classList.add('is-ready');
};

const openMenu = () => {
  navPanel.classList.add('is-open');
  body.classList.add('no-scroll');
  menuToggle.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  navPanel.classList.remove('is-open');
  body.classList.remove('no-scroll');
  menuToggle.setAttribute('aria-expanded', 'false');
};

const toggleMenu = () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    closeMenu();
  } else {
    openMenu();
  }
};

const setActiveLink = id => {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressFill.style.width = `${Math.min(100, Math.max(0, value))}%`;
};

const updateHeaderState = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

const updateCursorGlow = event => {
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
};

const hideCursorGlow = () => {
  cursorGlow.style.opacity = '0';
};

const typePhrase = async phrase => {
  if (!typingTarget) {
    return;
  }

  typingTarget.textContent = '';
  if (prefersReducedMotion) {
    typingTarget.textContent = phrase;
    return;
  }

  for (let index = 0; index <= phrase.length; index += 1) {
    typingTarget.textContent = phrase.slice(0, index);
    await new Promise(resolve => {
      activeTypingTimer = window.setTimeout(resolve, 65);
    });
  }

  await new Promise(resolve => {
    activeTypingTimer = window.setTimeout(resolve, 1200);
  });

  for (let index = phrase.length; index >= 0; index -= 1) {
    typingTarget.textContent = phrase.slice(0, index);
    await new Promise(resolve => {
      activeTypingTimer = window.setTimeout(resolve, 36);
    });
  }
};

const startTypingLoop = async () => {
  if (!typingTarget) {
    return;
  }

  if (prefersReducedMotion) {
    typingTarget.textContent = typingPhrases[0];
    return;
  }

  while (true) {
    await typePhrase(typingPhrases[typingIndex]);
    typingIndex = (typingIndex + 1) % typingPhrases.length;
  }
};

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18,
});

revealItems.forEach(item => revealObserver.observe(item));

revealItems.forEach((item, index) => {
  item.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 90}ms`);
});

projectCards.forEach((card, index) => {
  card.style.setProperty('--reveal-delay', `${index * 90}ms`);
});

document.querySelectorAll('.stat-card, .mini-card, .skill-card').forEach((card, index) => {
  card.style.setProperty('--reveal-delay', `${(index % 6) * 70}ms`);
});

const sectionObserver = new IntersectionObserver(entries => {
  const visibleEntries = entries.filter(entry => entry.isIntersecting);
  if (!visibleEntries.length) {
    return;
  }

  visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  setActiveLink(visibleEntries[0].target.id);
}, {
  rootMargin: `-${scrollMargin}px 0px -55% 0px`,
  threshold: [0.2, 0.35, 0.5, 0.7],
});

sections.forEach(section => sectionObserver.observe(section));

const onDocumentScroll = () => {
  updateProgress();
  updateHeaderState();
};

const smoothScrollTo = id => {
  const target = document.querySelector(id);
  if (!target) {
    return;
  }

  closeMenu();
  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - scrollMargin);
  window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      return;
    }

    event.preventDefault();
    smoothScrollTo(href);
  });
});

menuToggle.addEventListener('click', toggleMenu);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(control => {
      const active = control === button;
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach(card => {
      const categories = card.dataset.category || '';
      const isVisible = filter === 'all' || categories.includes(filter);
      card.classList.toggle('is-hidden', !isVisible);
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const subject = contactForm.elements.subject;
    const message = contactForm.elements.message;
    const fields = [name, email, subject, message];

    let firstInvalid = null;
    fields.forEach(field => {
      if (!field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) {
          firstInvalid = field;
        }
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    if (firstInvalid) {
      firstInvalid.reportValidity();
      formStatus.textContent = 'Please complete the required fields before sending.';
      return;
    }

    const emailjsReady = Boolean(window.emailjs && contactForm.dataset.emailjsService && contactForm.dataset.emailjsTemplate);

    if (emailjsReady) {
      formStatus.textContent = 'Sending message...';
      window.emailjs.sendForm(
        contactForm.dataset.emailjsService,
        contactForm.dataset.emailjsTemplate,
        contactForm,
      ).then(() => {
        contactForm.reset();
        formStatus.textContent = 'Message sent successfully.';
      }).catch(() => {
        formStatus.textContent = 'EmailJS is connected, but the request failed. Please try again.';
      });
      return;
    }

    const mailto = `mailto:ayushkpatel1801@gmail.com?subject=${encodeURIComponent(subject.value.trim())}&body=${encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`)}`;
    formStatus.textContent = 'Opening your email client with a drafted message.';
    window.location.href = mailto;
    contactForm.reset();
  });
}

window.addEventListener('scroll', onDocumentScroll, { passive: true });
window.addEventListener('resize', () => {
  updateProgress();
  if (window.innerWidth > 860) {
    closeMenu();
  }
});
window.addEventListener('mousemove', updateCursorGlow, { passive: true });
window.addEventListener('mouseleave', hideCursorGlow);
window.addEventListener('blur', hideCursorGlow);
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  setBodyReady();
  updateProgress();
  updateHeaderState();
  startTypingLoop();
});
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

document.addEventListener('click', event => {
  const clickedInsideNav = navPanel.contains(event.target) || menuToggle.contains(event.target);
  if (!clickedInsideNav && window.innerWidth <= 860) {
    closeMenu();
  }
});

if (prefersReducedMotion) {
  typingTarget.textContent = typingPhrases[0];
}

updateProgress();
updateHeaderState();
