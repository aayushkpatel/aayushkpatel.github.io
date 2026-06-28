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

const projectModal = document.getElementById('project-modal');
const modalBody = projectModal ? projectModal.querySelector('.project-modal-body') : null;
let lastFocusedCard = null;

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
  if (window.scrollY < 50) {
    setActiveLink('');
    return;
  }

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
  if (window.scrollY < 50) {
    setActiveLink('');
  }
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
    if (projectModal && projectModal.classList.contains('is-active')) {
      closeModal();
    }
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal && lightboxModal.classList.contains('is-active')) {
      closeLightbox();
    }
  }
});

const openModal = card => {
  if (!projectModal || !modalBody) return;
  
  lastFocusedCard = card;
  const imageSrc = card.querySelector('img').src;
  const imageAlt = card.querySelector('img').alt;
  const title = card.querySelector('h3').textContent;
  const badge = card.querySelector('.project-badge').textContent;
  const detailsData = card.querySelector('.project-details-data');
  
  if (!detailsData) return;
  
  const tagline = detailsData.querySelector('.modal-tagline')?.innerHTML || '';
  const description = detailsData.querySelector('.modal-description')?.innerHTML || '';
  const features = detailsData.querySelector('.modal-features')?.innerHTML || '';
  const techExtended = detailsData.querySelector('.modal-tech-extended')?.innerHTML || '';
  const metaInfo = detailsData.querySelector('.modal-meta-info')?.innerHTML || '';
  const actionLinks = detailsData.querySelector('.modal-links')?.innerHTML || '';
  
  modalBody.innerHTML = `
    <div class="modal-hero-img modal-anim">
      <img src="${imageSrc}" alt="${imageAlt}">
    </div>
    <div class="modal-main-content">
      <div class="modal-header-section modal-anim anim-delay-1">
        <div class="modal-header-left">
          <h2 id="modal-title">${title}</h2>
          <div class="modal-tagline">${tagline}</div>
        </div>
        <span class="modal-header-badge">${badge}</span>
      </div>
      
      <div class="modal-left-col modal-anim anim-delay-2">
        <div class="modal-description">
          ${description}
        </div>
        <div class="modal-features-section">
          <h4>Key Features</h4>
          <ul class="modal-features">
            ${features}
          </ul>
        </div>
      </div>
      
      <div class="modal-right-col">
        <div class="modal-right-section modal-anim anim-delay-3">
          <h4>Technologies</h4>
          <div class="modal-tech-tags">
            ${techExtended}
          </div>
        </div>
        
        <div class="modal-right-section modal-anim anim-delay-4">
          <h4>Project Details</h4>
          <div class="modal-meta-list">
            ${metaInfo}
          </div>
        </div>
        
        ${actionLinks ? `
        <div class="modal-actions-container modal-anim anim-delay-5">
          ${actionLinks}
        </div>
        ` : ''}
      </div>
    </div>
  `;
  
  body.classList.add('no-scroll');
  projectModal.classList.add('is-active');
  projectModal.setAttribute('aria-hidden', 'false');
  
  // Set hash to support hardware back button closing
  window.location.hash = 'view';
  
  const closeBtn = projectModal.querySelector('.project-modal-close');
  if (closeBtn) {
    closeBtn.focus();
  }
};
  
const closeModal = (shouldGoBack = true) => {
  if (!projectModal) return;
  body.classList.remove('no-scroll');
  projectModal.classList.remove('is-active');
  projectModal.setAttribute('aria-hidden', 'true');
  
  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
  
  if (shouldGoBack && window.location.hash === '#view') {
    history.back();
  }
};

const closeLightbox = (shouldGoBack = true) => {
  const lightboxModal = document.getElementById('lightbox-modal');
  if (!lightboxModal) return;
  body.classList.remove('no-scroll');
  lightboxModal.classList.remove('is-active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  
  if (shouldGoBack && window.location.hash === '#view') {
    history.back();
  }
};

// Handle native/browser back button clicks to close modals
window.addEventListener('hashchange', () => {
  if (window.location.hash !== '#view') {
    if (projectModal && projectModal.classList.contains('is-active')) {
      closeModal(false);
    }
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal && lightboxModal.classList.contains('is-active')) {
      closeLightbox(false);
    }
  }
});

// Open modal on project card click
projectCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for project ${card.querySelector('h3').textContent}`);
  
  card.addEventListener('click', event => {
    if (event.target.closest('a') || event.target.closest('button')) {
      return;
    }
    openModal(card);
  });
  
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.target.closest('a') || event.target.closest('button')) {
        return;
      }
      event.preventDefault();
      openModal(card);
    }
  });
});

// Close modal on triggers
if (projectModal) {
  projectModal.querySelectorAll('[data-modal-close]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      closeModal();
    });
  });
  
  // Trap focus inside modal
  projectModal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = projectModal.querySelectorAll(focusableSelectors);
    
    if (focusables.length === 0) return;
    
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  });
}

document.addEventListener('click', event => {
  const clickedInsideNav = navPanel.contains(event.target) || menuToggle.contains(event.target);
  if (!clickedInsideNav && window.innerWidth <= 860) {
    closeMenu();
  }
});

// Project Card Image Lightbox Controller
const projectImages = document.querySelectorAll('.project-card img');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = lightboxModal?.querySelector('.lightbox-img');

if (projectImages.length > 0 && lightboxModal && lightboxImg) {
  projectImages.forEach(img => {
    img.addEventListener('click', event => {
      event.stopPropagation(); // Stop opening the project detail modal!
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      
      body.classList.add('no-scroll');
      lightboxModal.classList.add('is-active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      
      // Set hash to support browser back button closing
      window.location.hash = 'view';
      
      const closeBtn = lightboxModal.querySelector('.lightbox-close');
      if (closeBtn) {
        closeBtn.focus();
      }
    });
  });
  
  // Close Lightbox
  lightboxModal.querySelectorAll('[data-lightbox-close]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      closeLightbox();
    });
  });
}

if (prefersReducedMotion) {
  typingTarget.textContent = typingPhrases[0];
}

updateProgress();
updateHeaderState();
