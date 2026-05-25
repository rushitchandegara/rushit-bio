document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
   * THEME TOGGLER (DARK / LIGHT)
   * ------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme in localStorage
  const savedTheme = localStorage.getItem('biodata-theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
  }

  // Toggle theme on button click
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('biodata-theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('biodata-theme', 'light');
    }
  });

  /* -------------------------------------------------------------
   * TAB NAVIGATION
   * ------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Update active state of buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update active state of panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${targetTab}-panel`) {
          panel.classList.add('active');
        }
      });
      
      // Scroll content into view if needed (mostly for mobile usability)
      if (window.innerWidth < 768) {
        const contentTop = document.querySelector('.tabs-content').offsetTop;
        window.scrollTo({
          top: contentTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  /* -------------------------------------------------------------
   * LIGHTBOX GALLERY SYSTEM
   * ------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxIndex = document.querySelector('.lightbox-index');

  // List of images and their details
  const images = Array.from(galleryItems).map(item => {
    const imgEl = item.querySelector('img');
    return {
      src: imgEl.getAttribute('src'),
      alt: imgEl.getAttribute('alt')
    };
  });

  let currentImgIndex = 0;
  const totalImages = images.length;

  const openLightbox = (index) => {
    currentImgIndex = index;
    updateLightbox();
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const updateLightbox = () => {
    lightboxImg.src = images[currentImgIndex].src;
    lightboxImg.alt = images[currentImgIndex].alt;
    lightboxIndex.textContent = `${currentImgIndex + 1} / ${totalImages}`;
  };

  const nextImage = () => {
    currentImgIndex = (currentImgIndex + 1) % totalImages;
    updateLightbox();
  };

  const prevImage = () => {
    currentImgIndex = (currentImgIndex - 1 + totalImages) % totalImages;
    updateLightbox();
  };

  // Add click events to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  // Lightbox navigation clicks
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  // Close when clicking outside the content image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    }
  });

  // Mobile swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50; // pixels
    if (touchEndX < touchStartX - swipeThreshold) {
      nextImage(); // Swipe left -> Next image
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevImage(); // Swipe right -> Previous image
    }
  };



});
