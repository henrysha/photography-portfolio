import { photos } from './gallery-data.js';

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const header = document.querySelector('header');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const backToTopBtn = document.getElementById('back-to-top');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// State Variables
let currentFilteredPhotos = [...photos];
let currentPhotoIndex = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupHeroBackground();
  renderGallery(photos);
  setupCategoryFilters();
  setupLightbox();
  setupHeaderScroll();
  setupMobileNav();
  setupContactForm();
  setupActiveNavHighlight();
});

// Setup Hero Background Image
function setupHeroBackground() {
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    // Select "Lost in the Strobe" (DSC06563.JPG) for a high-impact, atmospheric opening
    const heroImage = photos.find(p => p.filename.includes('DSC06563.JPG')) || photos[0];
    heroBg.style.backgroundImage = `url('./${heroImage.filename}')`;
  }
}

// Setup Category Filter Tabs
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;

      // Update active tab class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter photos array
      if (filterValue === 'all') {
        currentFilteredPhotos = [...photos];
      } else {
        currentFilteredPhotos = photos.filter(p => p.category === filterValue);
      }

      const labelMap = {
        all: 'All Works',
        concert: 'Concert & Event',
        portrait: 'Portraits',
        wedding: 'Weddings',
        travel: 'Travel',
        candid: 'Candid & Street'
      };

      renderGallery(currentFilteredPhotos, labelMap[filterValue] || 'Category');
    });
  });
}

// Render Gallery Grid Items
function renderGallery(photosToRender, categoryTitle = 'Category') {
  if (!galleryGrid) return;
  
  galleryGrid.innerHTML = '';
  
  if (photosToRender.length === 0) {
    galleryGrid.innerHTML = `
      <div class="category-curation-notice">
        <div class="curation-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
        <h3>${categoryTitle} Selection Under Curation</h3>
        <p>Selected photos for ${categoryTitle} are currently being curated for the portfolio gallery. Booking is now officially open for ${categoryTitle.toLowerCase()} projects!</p>
        <a href="#contact" class="btn btn-primary" style="margin-top: 0.5rem;">Inquire for ${categoryTitle}</a>
      </div>
    `;
    return;
  }

  photosToRender.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id = photo.id;
    item.dataset.index = index;
    
    // Add dynamic animation delays for entry staggered fade
    item.style.animationDelay = `${index * 0.04}s`;

    item.innerHTML = `
      <img src="./${photo.filename}" alt="${photo.category || 'Photography'}" loading="lazy" />
      <div class="gallery-item-overlay"></div>
    `;

    // Click handler to open Lightbox
    item.addEventListener('click', () => {
      openLightbox(photo.id);
    });

    galleryGrid.appendChild(item);
  });
}



// Setup Lightbox functionality
function setupLightbox() {
  if (!lightbox) return;

  // Close button click
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Prev button click
  lightboxPrev.addEventListener('click', showPrevPhoto);
  
  // Next button click
  lightboxNext.addEventListener('click', showNextPhoto);

  // Close lightbox on clicking outside content (backdrop)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
      closeLightbox();
    }
  });

  // Keyboard navigation listeners
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

// Open Lightbox
function openLightbox(photoId) {
  const photoIndex = currentFilteredPhotos.findIndex(p => p.id === photoId);
  if (photoIndex === -1) return;
  
  currentPhotoIndex = photoIndex;
  updateLightboxContent();
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop page scroll
}

// Close Lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore page scroll
}

// Show Next Photo
function showNextPhoto() {
  if (currentFilteredPhotos.length <= 1) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % currentFilteredPhotos.length;
  
  // Smoothly update lightbox contents
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    updateLightboxContent();
    lightboxImg.style.opacity = '1';
  }, 150);
}

// Show Previous Photo
function showPrevPhoto() {
  if (currentFilteredPhotos.length <= 1) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + currentFilteredPhotos.length) % currentFilteredPhotos.length;
  
  // Smoothly update lightbox contents
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    updateLightboxContent();
    lightboxImg.style.opacity = '1';
  }, 150);
}

// Update Lightbox DOM Details
function updateLightboxContent() {
  const photo = currentFilteredPhotos[currentPhotoIndex];
  if (!photo) return;
  
  lightboxImg.src = `./${photo.filename}`;
  lightboxImg.alt = 'Concert Photography';
}

// Setup Header Scrolled Class
function setupHeaderScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 800) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'all';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Mobile Responsive Drawer Menu
function setupMobileNav() {
  if (!mobileNavToggle) return;
  
  mobileNavToggle.addEventListener('click', () => {
    document.body.classList.toggle('mobile-nav-active');
  });

  // Close drawer when link clicked
  const navLinks = navLinksContainer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('mobile-nav-active');
    });
  });
}

// Setup Form Submission Dispatch
function setupContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Submit button state update
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Dispatch email payload via FormSubmit API to henry.seongwook.ha@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/henry.seongwook.ha@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Subject: subject || 'New Booking Inquiry',
          Message: message,
          _subject: `Portfolio Booking Inquiry: ${subject || name}`
        })
      });

      if (response.ok) {
        submitBtn.textContent = 'Message Sent ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #00f0ff 0%, #00ff66 100%)';
        submitBtn.style.boxShadow = '0 8px 32px 0 rgba(0, 240, 255, 0.3)';
        showToastAlert(`Thank you ${name}! Your inquiry was sent to Henry (${email}).`);
      } else {
        // Fallback to mailto if service is unavailable
        window.location.href = `mailto:henry.seongwook.ha@gmail.com?subject=${encodeURIComponent(subject || 'Booking Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        showToastAlert('Opening your mail app to send the inquiry...');
      }
    } catch (err) {
      // Direct mailto fallback
      window.location.href = `mailto:henry.seongwook.ha@gmail.com?subject=${encodeURIComponent(subject || 'Booking Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      showToastAlert('Opening your mail app to send the inquiry...');
    } finally {
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.boxShadow = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  });
}

// Floating Toast Alert notification
function showToastAlert(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.right = '2rem';
  toast.style.background = 'rgba(18, 18, 22, 0.95)';
  toast.style.border = '1px solid var(--accent-cyan)';
  toast.style.color = 'var(--text-primary)';
  toast.style.padding = '1.2rem 2rem';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 15px 40px rgba(0,0,0,0.8), 0 0 15px rgba(0,240,255,0.15)';
  toast.style.zIndex = '9999';
  toast.style.maxWidth = '400px';
  toast.style.fontFamily = 'var(--font-sans)';
  toast.style.fontSize = '0.95rem';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'var(--transition-smooth)';
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Fade In
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Fade Out & Delete
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// Active Nav highlight based on viewport intersection
function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('section, .hero');
  const navLinks = navLinksContainer.querySelectorAll('a');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger near center-top viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id') || 'home';
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
