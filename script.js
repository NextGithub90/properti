/* =============================================
   PARAMOUNT LAND SERPONG - MAIN JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    // Init AOS (with safe check for deferred loading)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
    } else {
        // AOS might not be loaded yet due to defer, wait for it
        window.addEventListener('load', function() {
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
            }
        });
    }

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    handleNavScroll(); // Set initial state

    // ========== ACTIVE NAV on SCROLL ==========
    function setActiveNav() {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            var link = document.querySelector('.nav-link[href="#' + id + '"]');
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    link.classList.add('active');
                }
            }
        });
    }

    // ========== OPTIMIZED SCROLL HANDLER (debounced via rAF) ==========
    var scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                handleNavScroll();
                setActiveNav();
                animateCounters();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Close mobile nav on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var collapse = document.getElementById('navMenu');
            var bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) bsCollapse.hide();
        });
    });

    // ========== HERO SLIDESHOW ==========
    var heroSlides = document.querySelectorAll('.hero-slide');
    var heroIndex = 0;
    if (heroSlides.length > 1) {
        setInterval(function () {
            heroSlides[heroIndex].classList.remove('active');
            heroIndex = (heroIndex + 1) % heroSlides.length;
            heroSlides[heroIndex].classList.add('active');
        }, 5000);
    }

    // ========== COUNTER ANIMATION ==========
    var counters = document.querySelectorAll('.stat-number[data-count]');
    var counterDone = false;

    function animateCounters() {
        if (counterDone) return;
        var heroRect = document.querySelector('.hero-stats');
        if (!heroRect) return;
        var rect = heroRect.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counterDone = true;
            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-count'));
                var step = Math.ceil(target / 60);
                var current = 0;
                var timer = setInterval(function () {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = current;
                }, 30);
            });
        }
    }
    animateCounters(); // Initial check on page load
});

// ========== PROPERTY IMAGE SLIDER ==========
function slideProperty(sliderId, direction) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;
    var images = slider.querySelectorAll('.property-img');
    var currentIndex = 0;
    images.forEach(function (img, i) {
        if (img.classList.contains('active')) currentIndex = i;
    });
    images[currentIndex].classList.remove('active');
    var newIndex = (currentIndex + direction + images.length) % images.length;
    images[newIndex].classList.add('active');

    // Update counter
    var sliderNum = sliderId.replace('slider', '');
    var counter = document.getElementById('counter' + sliderNum);
    if (counter) {
        counter.textContent = (newIndex + 1) + ' / ' + images.length;
    }
}

// ========== GALLERY LIGHTBOX ==========
var galleryImages = [
    'images/gallery4.jpeg',
    'images/gallery5.jpeg',
    'images/gallery6.jpeg'
];
var currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    var lightbox = document.getElementById('galleryLightbox');
    var img = document.getElementById('lightboxImg');
    img.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    var lightbox = document.getElementById('galleryLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    var img = document.getElementById('lightboxImg');
    img.src = galleryImages[currentLightboxIndex];
}

// Close lightbox on Escape key and navigate with arrow keys
document.addEventListener('keydown', function (e) {
    var lightbox = document.getElementById('galleryLightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Close lightbox on click outside image
document.addEventListener('click', function (e) {
    var lightbox = document.getElementById('galleryLightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.target === lightbox) closeLightbox();
});

// ========== MOBILE GALLERY SLIDER ==========
var gallerySlideIndex = 0;
var galleryTotalSlides = 3;

function moveGallerySlider(direction) {
    gallerySlideIndex = (gallerySlideIndex + direction + galleryTotalSlides) % galleryTotalSlides;
    updateGallerySlider();
}

function goToGallerySlide(index) {
    gallerySlideIndex = index;
    updateGallerySlider();
}

function updateGallerySlider() {
    var track = document.getElementById('gallerySliderTrack');
    if (track) {
        track.style.transform = 'translateX(-' + (gallerySlideIndex * 100) + '%)';
    }
    // Update dots
    var dots = document.querySelectorAll('.gallery-dot');
    dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === gallerySlideIndex);
    });
}

// Touch swipe support for mobile gallery
(function () {
    var track = document.getElementById('gallerySliderTrack');
    if (!track) return;

    var startX = 0;
    var startY = 0;
    var isDragging = false;
    var threshold = 50;

    track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
        if (!isDragging) return;
        isDragging = false;
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        var diffX = startX - endX;
        var diffY = startY - endY;

        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                moveGallerySlider(1); // Swipe left -> next
            } else {
                moveGallerySlider(-1); // Swipe right -> prev
            }
        }
    }, { passive: true });
})();

// Auto-play gallery slider on mobile
var galleryAutoPlay = setInterval(function () {
    var mobileGallery = document.querySelector('.gallery-mobile');
    if (mobileGallery && window.getComputedStyle(mobileGallery).display !== 'none') {
        moveGallerySlider(1);
    }
}, 4000);
