// Import required libraries
const socket = io();

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        gsap.to(window, {
            duration: 1,
            scrollTo: this.getAttribute('href'),
            ease: 'power2.inOut'
        });
    });
});

// Add active class to nav links on scroll with GSAP ScrollTrigger
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateActiveLink(section.id),
        onEnterBack: () => updateActiveLink(section.id)
    });
});

function updateActiveLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle with animation
const nav = document.querySelector('nav');
const navLinksContainer = document.querySelector('.nav-links');
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
nav.appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    const timeline = gsap.timeline();
    if (navLinksContainer.classList.contains('active')) {
        timeline.to(navLinksContainer, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => navLinksContainer.classList.remove('active')
        });
    } else {
        navLinksContainer.classList.add('active');
        timeline.to(navLinksContainer, {
            height: 'auto',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut'
        });
    }
});

// Dynamic project loading
fetch('/api/projects')
    .then(response => response.json())
    .then(projects => {
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-image" style="background-image: url(${project.image})"></div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" class="project-link">View Live</a>
                    <a href="${project.sourceCode}" class="project-link">Source Code</a>
                </div>
            `;
            projectsGrid.appendChild(projectCard);

            // Animate project cards on scroll
            gsap.from(projectCard, {
                scrollTrigger: {
                    trigger: projectCard,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });

// Contact form handling with real-time feedback
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                gsap.to('.success-message', {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                contactForm.reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Animate sections on scroll
gsap.utils.toArray('.skill-card, .about-content, .contact-content').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
});

// Hero section parallax effect
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 100,
    opacity: 0.5
});