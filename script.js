/* ========== SECRET CARE BD - Main Script ========== */

// ---- Mobile Menu ----
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
}

// ---- Countdown Timer (ends in 2 days from now) ----
function startCountdown() {
  // Set end time: 2 days from page load (or fixed date)
  let endTime = localStorage.getItem('scbd_offer_end');
  if (!endTime) {
    endTime = Date.now() + (2 * 24 * 60 * 60 * 1000); // 2 days
    localStorage.setItem('scbd_offer_end', endTime);
  } else {
    endTime = parseInt(endTime);
  }

  function update() {
    const now = Date.now();
    let diff = endTime - now;

    if (diff <= 0) {
      // Reset for another 2 days
      endTime = Date.now() + (2 * 24 * 60 * 60 * 1000);
      localStorage.setItem('scbd_offer_end', endTime);
      diff = endTime - now;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('secs').textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}
startCountdown();

// ---- Stats Counter Animation ----
function animateStats() {
  const stats = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}
animateStats();

// ---- Review Slider ----
(function initSlider() {
  const track = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  let currentIndex = 0;
  let cardsPerView = 1;
  let autoPlayTimer;

  function getCardsPerView() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const total = Math.ceil(cards.length / cardsPerView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const cardWidth = cards[0].offsetWidth + 20; // gap
    track.style.transform = `translateX(-${currentIndex * cardWidth * cardsPerView}px)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function goTo(index) {
    const maxIndex = Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateSlider();
    resetAutoPlay();
  }

  function next() {
    const maxIndex = Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  }

  function prev() {
    const maxIndex = Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSlider();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(next, 4000);
  }

  prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    createDots();
    updateSlider();
  });

  // Init
  cardsPerView = getCardsPerView();
  createDots();
  updateSlider();
  resetAutoPlay();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  track.addEventListener('mouseleave', resetAutoPlay);
})();

// ---- Quantity & Price ----
const UNIT_PRICE = 1699;
const qtyInput = document.getElementById('quantity');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');

function updatePrice() {
  const qty = parseInt(qtyInput.value) || 1;
  const sub = qty * UNIT_PRICE;
  document.getElementById('qtyDisplay').textContent = '× ' + qty;
  document.getElementById('subtotal').textContent = '৳' + sub.toLocaleString('bn-BD');
  document.getElementById('grandTotal').textContent = '৳' + sub.toLocaleString('bn-BD');
}

if (qtyMinus) {
  qtyMinus.addEventListener('click', () => {
    let v = parseInt(qtyInput.value) || 1;
    if (v > 1) {
      qtyInput.value = v - 1;
      updatePrice();
    }
  });
}
if (qtyPlus) {
  qtyPlus.addEventListener('click', () => {
    let v = parseInt(qtyInput.value) || 1;
    if (v < 5) {
      qtyInput.value = v + 1;
      updatePrice();
    }
  });
}

// ---- Order Form ----
const orderForm = document.getElementById('orderForm');
const successModal = document.getElementById('successModal');

function generateOrderId() {
  const prefix = 'SCBD';
  const num = Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  return prefix + num;
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('scbd_orders') || '[]');
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order); // newest first
  localStorage.setItem('scbd_orders', JSON.stringify(orders));
}

function validateForm() {
  let valid = true;
  const name = document.getElementById('customerName');
  const phone = document.getElementById('customerPhone');
  const address = document.getElementById('customerAddress');

  // Reset
  [name, phone, address].forEach(el => el.classList.remove('error'));
  document.getElementById('nameError').textContent = '';
  document.getElementById('phoneError').textContent = '';
  document.getElementById('addressError').textContent = '';

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add('error');
    document.getElementById('nameError').textContent = 'সঠিক নাম লিখুন';
    valid = false;
  }

  const phoneVal = phone.value.trim().replace(/\s/g, '');
  if (!/^01[3-9]\d{8}$/.test(phoneVal)) {
    phone.classList.add('error');
    document.getElementById('phoneError').textContent = 'সঠিক মোবাইল নম্বর লিখুন (01XXXXXXXXX)';
    valid = false;
  }

  if (!address.value.trim() || address.value.trim().length < 10) {
    address.classList.add('error');
    document.getElementById('addressError').textContent = 'সম্পূর্ণ ঠিকানা লিখুন';
    valid = false;
  }

  return valid;
}

if (orderForm) {
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেস হচ্ছে...';

    const qty = parseInt(qtyInput.value) || 1;
    const order = {
      id: generateOrderId(),
      name: document.getElementById('customerName').value.trim(),
      phone: document.getElementById('customerPhone').value.trim(),
      address: document.getElementById('customerAddress').value.trim(),
      note: document.getElementById('customerNote').value.trim() || '',
      product: 'Natural Power Booster (30 Days)',
      quantity: qty,
      unitPrice: UNIT_PRICE,
      total: qty * UNIT_PRICE,
      status: 'Pending',
      date: new Date().toLocaleString('bn-BD', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      timestamp: Date.now()
    };

    // Simulate network delay
    setTimeout(() => {
      saveOrder(order);
      document.getElementById('orderIdDisplay').textContent = order.id;
      successModal.classList.add('open');
      orderForm.reset();
      qtyInput.value = 1;
      updatePrice();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> অর্ডার কনফার্ম করুন';
    }, 800);
  });
}

function closeModal() {
  successModal.classList.remove('open');
}

// Close modal on outside click
if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal();
  });
}
