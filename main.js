// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.padding = '10px 0';
    navbar.style.background = 'rgba(15, 15, 17, 0.85)';
  } else {
    navbar.style.padding = '16px 0';
    navbar.style.background = 'rgba(15, 15, 17, 0.7)';
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  // Animate hamburger icon
  const spans = menuToggle.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Intersection Observer for Scroll Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-up');
  animatedElements.forEach(el => observer.observe(el));
});
