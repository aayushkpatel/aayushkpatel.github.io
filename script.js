/* ============================================
   FUTURISTIC PORTFOLIO - AAYUSH PATEL
   Three.js + GSAP Animations
   ============================================ */

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-category, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });
}

// ============================================
// THREE.JS BACKGROUND
// ============================================
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera position
camera.position.z = 30;

// Mouse position for parallax
let mousePos = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ============================================
// FLOATING 3D SHAPES
// ============================================
const shapes = [];
const shapeCount = 15;

// Geometries
const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.ConeGeometry(0.8, 1.5, 4)
];

// Materials
const neonBlue = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.6
});

const neonPurple = new THREE.MeshBasicMaterial({ 
    color: 0xb829ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.6
});

const neonCyan = new THREE.MeshBasicMaterial({ 
    color: 0x00fff2, 
    wireframe: true,
    transparent: true,
    opacity: 0.5
});

const materials = [neonBlue, neonPurple, neonCyan];

// Create shapes
for (let i = 0; i < shapeCount; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position
    mesh.position.x = (Math.random() - 0.5) * 60;
    mesh.position.y = (Math.random() - 0.5) * 60;
    mesh.position.z = (Math.random() - 0.5) * 30 - 10;
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Random scale
    const scale = Math.random() * 1.5 + 0.5;
    mesh.scale.set(scale, scale, scale);
    
    // Store animation data
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalPos: mesh.position.clone()
    };
    
    scene.add(mesh);
    shapes.push(mesh);
}

// ============================================
// PARTICLE SYSTEM
// ============================================
const particleCount = 200;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = [];

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 100;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    });
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.3,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// ============================================
// NEON GRID FLOOR
// ============================================
const gridHelper = new THREE.GridHelper(100, 50, 0x00f0ff, 0xb829ff);
gridHelper.position.y = -20;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.15;
scene.add(gridHelper);

// ============================================
// ANIMATION LOOP
// ============================================
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // Animate shapes
    shapes.forEach((shape, i) => {
        // Rotation
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        
        // Floating motion
        shape.position.y = shape.userData.originalPos.y + 
            Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 2;
        
        // Parallax effect based on mouse
        shape.position.x = shape.userData.originalPos.x + mousePos.x * 2;
    });
    
    // Animate particles
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;
        
        // Wrap around
        if (positions[i * 3] > 50) positions[i * 3] = -50;
        if (positions[i * 3] < -50) positions[i * 3] = 50;
        if (positions[i * 3 + 1] > 50) positions[i * 3 + 1] = -50;
        if (positions[i * 3 + 1] < -50) positions[i * 3 + 1] = 50;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Rotate particle system slowly
    particles.rotation.y += 0.001;
    
    // Camera parallax
    camera.position.x += (mousePos.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mousePos.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Animate grid
    gridHelper.position.z = (time * 2) % 10;
    
    renderer.render(scene, camera);
}

animate();

// ============================================
// RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// TYPING EFFECT
// ============================================
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Full-Stack Developer',
    'Database Specialist',
    'AI Integration Expert',
    'Big Data Architect'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before new phrase
    }
    
    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================

// Navbar scroll effect
ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'scrolled', targets: '.navbar' }
});

// Hero animations
gsap.from('.hero-greeting', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.hero-title .char', {
    opacity: 0,
    y: 100,
    rotationX: -90,
    stagger: 0.05,
    duration: 1.2,
    delay: 0.8,
    ease: 'power4.out'
});

gsap.from('.hero-headline', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 1.5,
    ease: 'power3.out'
});

gsap.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 1.8,
    ease: 'power3.out'
});

gsap.from('.hero-buttons', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 2.1,
    ease: 'power3.out'
});

gsap.from('.hero-stats', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 2.4,
    ease: 'power3.out'
});

// Counter animation
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power2.out'
            });
        }
    });
});

// Section headers
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });
});

// About section
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 60%',
        once: true
    },
    opacity: 0,
    x: -100,
    duration: 1.2,
    ease: 'power3.out'
});

gsap.from('.about-card', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 60%',
        once: true
    },
    opacity: 0,
    x: 100,
    duration: 1.2,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.about-tags .tag', {
    scrollTrigger: {
        trigger: '.about-tags',
        start: 'top 80%',
        once: true
    },
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out'
});

// Skills section - Fixed visibility
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach((category, index) => {
    // Ensure visible by default
    category.style.opacity = '1';
    category.style.transform = 'none';
    
    gsap.from(category, {
        scrollTrigger: {
            trigger: category,
            start: 'top 85%',
            once: true
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Skill bars animation - Fixed
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    const level = item.getAttribute('data-level');
    const progressBar = item.querySelector('.skill-progress');
    
    // Set CSS variable for the skill level
    item.style.setProperty('--skill-level', level + '%');
    
    ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            item.classList.add('visible');
            gsap.to(progressBar, {
                width: level + '%',
                duration: 1.5,
                ease: 'power3.out'
            });
        }
    });
});

// Projects section - Fixed with visibility
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
        },
        opacity: 0,
        y: 80,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out',
        onComplete: () => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        }
    });
});

// Contact section
gsap.from('.info-card', {
    scrollTrigger: {
        trigger: '.contact-container',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: -80,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.contact-form-wrapper', {
    scrollTrigger: {
        trigger: '.contact-container',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: 80,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
});

gsap.from('.contact-item', {
    scrollTrigger: {
        trigger: '.contact-details',
        start: 'top 80%',
        once: true
    },
    opacity: 0,
    x: -30,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
});

// Footer
gsap.from('.footer-grid > div', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
        once: true
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
});

// ============================================
// NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});

// ============================================
// EMAILJS SETUP - Send messages directly to your email
// ============================================

// Initialize EmailJS with your Public Key
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
emailjs.init('YOUR_PUBLIC_KEY');

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.querySelector('.btn-text').textContent;
    
    // Show sending state
    btn.querySelector('.btn-text').textContent = 'Sending...';
    btn.disabled = true;
    
    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
        .then(() => {
            // Success
            btn.querySelector('.btn-text').textContent = 'Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
            contactForm.reset();
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        })
        .catch((error) => {
            // Error
            console.error('EmailJS Error:', error);
            btn.querySelector('.btn-text').textContent = 'Failed to Send';
            btn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
});

// ============================================
// YEAR UPDATE
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// PARALLAX EFFECTS
// ============================================
// Parallax for decorative elements
gsap.utils.toArray('.floating-badge').forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });
});

// ============================================
// HOLOGRAPHIC CARD EFFECT
// ============================================
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================
// GLITCH EFFECT ON HOVER FOR TITLES
// ============================================
const glitchTitles = document.querySelectorAll('.title-glitch');

glitchTitles.forEach(title => {
    title.addEventListener('mouseenter', () => {
        title.style.animation = 'none';
        setTimeout(() => {
            title.style.animation = '';
        }, 10);
    });
});

// ============================================
// NEON GRID BACKGROUND (CSS fallback enhancement)
// ============================================
const neonGrid = document.createElement('div');
neonGrid.className = 'neon-grid';
document.body.appendChild(neonGrid);

// ============================================
// PARTICLE EFFECT ON CLICK
// ============================================
document.addEventListener('click', (e) => {
    createClickParticles(e.clientX, e.clientY);
});

function createClickParticles(x, y) {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${Math.random() > 0.5 ? 'var(--neon-blue)' : 'var(--neon-purple)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 10px currentColor;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        gsap.to(particle, {
            x: vx,
            y: vy,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// ============================================
// SCROLL VELOCITY EFFECT
// ============================================
let lastScrollTop = 0;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
    const st = window.pageYOffset;
    scrollVelocity = Math.abs(st - lastScrollTop);
    lastScrollTop = st;
    
    // Apply skew effect based on scroll velocity
    if (scrollVelocity > 5) {
        const skewAmount = Math.min(scrollVelocity * 0.05, 5);
        gsap.to('main', {
            skewY: st > lastScrollTop ? skewAmount : -skewAmount,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}, { passive: true });

// Reset skew when scroll stops
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        gsap.to('main', {
            skewY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }, 150);
}, { passive: true });

// ============================================
// PRELOADER (Optional enhancement)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    gsap.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// ============================================
// VISIBILITY API - Pause animations when tab is hidden
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations
    } else {
        // Resume animations
    }
});

console.log('%c Aayush Patel Portfolio ', 'background: linear-gradient(135deg, #00f0ff, #b829ff); color: #000; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c Full-Stack Developer & Database Specialist ', 'color: #00f0ff; font-size: 14px;');
