/* ========================================
 Husni Halim - Personal Site Script
 Enhanced CMS v2 with styling, images, themes
 ======================================== */

(function () {
 'use strict';

 // ---- API Base URL ----
 const API_BASE = '/api/cms';
 const isLocal = location.protocol === 'file:';
 const SITE_ID = 'husni';

 // ---- Premium motion layer ----
 const motionGroups = [
 '.section > .section-label',
 '.section > h2',
 '.section > .section-desc',
 '.company-marquee',
 '.kc-hero-content > *',
 '.kc-stats-card',
 '.kc-section > .kc-container > h2',
 '.kc-section > .kc-container > .section-sub',
 '.obj-card',
 '.outcome-col',
 '.kc-day',
 '.feat-card',
 '.price-card',
 '.hrdc-banner',
 '.faq-item',
 '.kc-form-wrap',
 '.service-card',
 '.testimonial-card',
 '.about-text > *',
 '.cred-card',
 '.exp-item',
 '.case-card',
 '.kaizen-hero-content > *',
 '.training-card',
 '.training-note',
 '.blog-card',
 '.contact-copy > *',
 '.contact-method',
 '.contact-form-wrap',
 '.footer-col'
 ];

 motionGroups.forEach((selector) => {
 const elements = document.querySelectorAll(selector);
 elements.forEach((el, index) => {
 if (!el.classList.contains('reveal')) el.classList.add('reveal');
 const delay = Math.min(index % 8, 7) * 70;
 el.style.setProperty('--reveal-delay', delay + 'ms');
 });
 });

 document.querySelectorAll('.service-card, .testimonial-card, .cred-card, .exp-item, .case-card, .training-card, .blog-card, .obj-card, .feat-card, .price-card, .faq-item, .kc-day').forEach((el) => {
 el.classList.add('premium-card');
 });

 // ---- Scroll Reveal ----
 const revealElements = document.querySelectorAll('.reveal');
 const revealObserver = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 entry.target.classList.add('revealed');
 revealObserver.unobserve(entry.target);
 }
 });
 },
 { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
 );
 revealElements.forEach((el) => revealObserver.observe(el));

 // ---- Navbar scroll effect ----
 const navbar = document.getElementById('navbar');
 let lastScrollY = 0;

 function handleNavScroll() {
 const y = window.scrollY;
 if (y > 60) {
 navbar.classList.add('nav-scrolled');
 } else {
 navbar.classList.remove('nav-scrolled');
 }
 lastScrollY = y;
 }
 window.addEventListener('scroll', handleNavScroll, { passive: true });
 handleNavScroll();

 // ---- Mobile hamburger menu ----
 const hamburger = document.getElementById('hamburger');
 const navLinks = document.getElementById('navLinks');

 if (hamburger && navLinks) {
 hamburger.addEventListener('click', () => {
 const isOpen = hamburger.classList.toggle('active');
 navLinks.classList.toggle('open');
 hamburger.setAttribute('aria-expanded', isOpen);
 document.body.style.overflow = isOpen ? 'hidden' : '';
 });

 navLinks.querySelectorAll('a').forEach((link) => {
 link.addEventListener('click', () => {
 hamburger.classList.remove('active');
 navLinks.classList.remove('open');
 hamburger.setAttribute('aria-expanded', 'false');
 document.body.style.overflow = '';
 });
 });
 }

 // ---- Active nav link highlight ----
 const sections = document.querySelectorAll('section[id]');
 const navItems = document.querySelectorAll('.nav-links a');

 const sectionObserver = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 const id = entry.target.getAttribute('id');
 navItems.forEach((a) => {
 a.classList.toggle('active', a.getAttribute('href') === '#' + id);
 });
 }
 });
 },
 { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
 );
 sections.forEach((s) => sectionObserver.observe(s));

 // ---- Smooth scroll for anchor links ----
 document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
 anchor.addEventListener('click', function (e) {
 const targetId = this.getAttribute('href');
 if (targetId === '#') return;
 const target = document.querySelector(targetId);
 if (target) {
 e.preventDefault();
 const navHeight = navbar ? navbar.offsetHeight : 0;
 const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
 window.scrollTo({ top, behavior: 'smooth' });
 }
 });
 });

 // ---- Contact form handling ----
 const contactForm = document.getElementById('contactForm');
 if (contactForm) {
 contactForm.addEventListener('submit', async function (e) {
 e.preventDefault();
 const formData = new FormData(this);
 const data = Object.fromEntries(formData.entries());
 data.site = SITE_ID;
 const btn = this.querySelector('.btn-submit');
 const originalText = btn.textContent;

 btn.textContent = 'Sending...';
 btn.disabled = true;

 try {
 if (!isLocal) {
 const resp = await fetch(API_BASE + '/contact', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(data),
 });
 const result = await resp.json();
 if (!result.success) {
 const error = new Error(result.error || 'Submission failed');
 error.emailDeliveryFailed = Boolean(result.emailDeliveryFailed);
 error.saved = Boolean(result.saved);
 throw error;
 }
 } else {
 const submissions = JSON.parse(localStorage.getItem('husni_submissions') || '[]');
 submissions.push({ ...data, timestamp: new Date().toISOString() });
 localStorage.setItem('husni_submissions', JSON.stringify(submissions));
 }

 btn.textContent = 'Enquiry Sent!';
 btn.style.background = '#22c55e';
 this.reset();
 } catch (err) {
 if (err.emailDeliveryFailed && err.saved) {
 btn.textContent = 'Received - Email Issue';
 btn.style.background = '#f59e0b';
 } else {
 btn.textContent = 'Failed - Try Again';
 btn.style.background = '#ef4444';
 }
 console.error('Contact form error:', err);
 }

 setTimeout(() => {
 btn.textContent = originalText;
 btn.style.background = '';
 btn.disabled = false;
 }, 3000);
 });
 }

 // ---- CMS v2: Apply saved edits, styles, images, theme ----
 async function applyEdits() {
 let data = {};

 try {
 if (!isLocal) {
 const resp = await fetch(API_BASE + '/content?site=' + SITE_ID);
 data = await resp.json();
 } else {
 data = JSON.parse(localStorage.getItem('husni_edits') || '{}');
 }
 } catch {
 data = JSON.parse(localStorage.getItem('husni_edits') || '{}');
 }

 // Handle legacy v1 flat format (backward compatibility)
 if (!data._version) {
 Object.keys(data).forEach((key) => {
 const el = document.querySelector('[data-editable="' + key + '"]');
 if (el) el.innerHTML = data[key];
 });
 return;
 }

 // ---- V2 Format: Apply content + styles ----
 if (data.content) {
 Object.keys(data.content).forEach((key) => {
 const el = document.querySelector('[data-editable="' + key + '"]');
 if (!el) return;

 const entry = data.content[key];
 if (entry.text !== undefined && entry.text !== null) {
 el.innerHTML = entry.text;
 }

 if (entry.styles) {
 const s = entry.styles;
 if (s.fontSize) el.style.fontSize = s.fontSize;
 if (s.color) el.style.color = s.color;
 if (s.fontFamily) el.style.fontFamily = s.fontFamily;
 if (s.fontWeight) el.style.fontWeight = s.fontWeight;
 if (s.fontStyle) el.style.fontStyle = s.fontStyle;
 if (s.textDecoration) el.style.textDecoration = s.textDecoration;
 if (s.textAlign) el.style.textAlign = s.textAlign;
 }
 });
 }

 // ---- Apply section settings (backgrounds, visibility) ----
 if (data.sections) {
 Object.keys(data.sections).forEach((sectionId) => {
 const section = document.getElementById(sectionId);
 if (!section) return;

 const settings = data.sections[sectionId];

 // Visibility
 if (settings.visible === false) {
 section.classList.add('cms-hidden');
 return;
 }

 // Background color
 if (settings.backgroundColor) {
 section.style.backgroundColor = settings.backgroundColor;
 }

 // Background image
 if (settings.backgroundImage) {
 const imgUrl = settings.backgroundImage.startsWith('img_')
 ? '/api/cms/media/' + settings.backgroundImage + '?site=' + SITE_ID
 : settings.backgroundImage;
 section.style.backgroundImage = 'url(' + imgUrl + ')';
 section.style.backgroundSize = settings.backgroundSize || 'cover';
 section.style.backgroundPosition = settings.backgroundPosition || 'center';
 section.style.backgroundRepeat = 'no-repeat';

 // Overlay
 if (settings.backgroundOverlayColor) {
 section.style.setProperty('--bg-overlay-color', settings.backgroundOverlayColor);
 section.style.setProperty('--bg-overlay-opacity', settings.backgroundOverlayOpacity || 0.4);
 section.classList.add('has-bg-overlay');
 }
 }
 });
 }

 // ---- Apply theme settings ----
 if (data.theme) {
 applyTheme(data.theme);
 }

 // ---- Apply image replacements ----
 if (data.images) {
 Object.keys(data.images).forEach((imageId) => {
 const el = document.querySelector('[data-image="' + imageId + '"]');
 if (!el) return;

 const img = data.images[imageId];
 if (img.src) {
 el.src = img.src.startsWith('img_')
 ? '/api/cms/media/' + img.src + '?site=' + SITE_ID
 : img.src;
 }
 if (img.alt) el.alt = img.alt;
 if (img.objectFit) el.style.objectFit = img.objectFit;
 if (img.borderRadius) el.style.borderRadius = img.borderRadius;
 });
 }
 }

 function applyTheme(theme) {
 const root = document.documentElement;

 // Colors (Husni uses different CSS variable names)
 if (theme.primaryColor) {
 root.style.setProperty('--color-accent', theme.primaryColor);
 root.style.setProperty('--color-accent-light', hexToRgba(theme.primaryColor, 0.12));
 }
 if (theme.secondaryColor) {
 root.style.setProperty('--color-secondary', theme.secondaryColor);
 }

 // Fonts
 if (theme.fontHeading) {
 loadGoogleFont(theme.fontHeading);
 root.style.setProperty('--font-heading', "'" + theme.fontHeading + "', Georgia, serif");
 }
 if (theme.fontBody) {
 loadGoogleFont(theme.fontBody);
 root.style.setProperty('--font-body', "'" + theme.fontBody + "', -apple-system, sans-serif");
 }

 // Logo (Husni uses text-based logo, but CMS can override with image)
 if (theme.logo) {
 const logoUrl = '/api/cms/media/' + theme.logo + '?site=' + SITE_ID;
 // Replace text logo with image logo
 const textLogo = document.querySelector('.nav-logo-text');
 if (textLogo) {
 const img = document.createElement('img');
 img.src = logoUrl;
 img.alt = 'Husni Halim';
 img.className = 'nav-logo-img';
 img.width = 120;
 img.height = 48;
 img.setAttribute('data-image', 'hh-nav-logo');
 textLogo.replaceWith(img);
 }
 // Footer logo if exists
 document.querySelectorAll('[data-image="hh-footer-logo"]').forEach((el) => {
 el.src = logoUrl;
 });
 }

 // Favicon
 if (theme.favicon) {
 const faviconUrl = '/api/cms/media/' + theme.favicon + '?site=' + SITE_ID;
 let link = document.querySelector("link[rel*='icon']");
 if (!link) {
 link = document.createElement('link');
 link.rel = 'icon';
 document.head.appendChild(link);
 }
 link.href = faviconUrl;
 }
 }

 function loadGoogleFont(fontName) {
 if (document.querySelector('link[data-font="' + fontName + '"]')) return;
 const link = document.createElement('link');
 link.rel = 'stylesheet';
 link.dataset.font = fontName;
 link.href = 'https://fonts.googleapis.com/css2?family=' +
 encodeURIComponent(fontName) + ':wght@300;400;500;600;700&display=swap';
 document.head.appendChild(link);
 }

 function hexToRgba(hex, alpha) {
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
 }

 applyEdits();

 // ---- Counter animation for stats ----
 const statNumbers = document.querySelectorAll(
 '.hero-stat-number, .about-stat-num, .track-summary-num, .flagship-card-stat-num'
 );

 const counterObserver = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 animateCounter(entry.target);
 counterObserver.unobserve(entry.target);
 }
 });
 },
 { threshold: 0.5 }
 );

 statNumbers.forEach((el) => counterObserver.observe(el));

 function animateCounter(el) {
 const text = el.textContent.trim();
 const match = text.match(/^(\d+)/);
 if (!match) return;
 const target = parseInt(match[1], 10);
 const suffix = text.replace(/^\d+/, '');
 const duration = 1500;
 const start = performance.now();

 function step(now) {
 const progress = Math.min((now - start) / duration, 1);
 const eased = 1 - Math.pow(1 - progress, 3);
 const current = Math.round(target * eased);
 el.textContent = current + suffix;
 if (progress < 1) requestAnimationFrame(step);
 }
 requestAnimationFrame(step);
 }
})();
