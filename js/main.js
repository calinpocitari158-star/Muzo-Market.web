/* =============================================
   MUZO MARKET — main.js
   Global JS: cart, header scroll, toast
   ============================================= */

'use strict';

/* ================================================
   CART STATE
   Stored in localStorage as JSON array of items:
   { id, name, price, imageUrl, qty }
   ================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'muzo_cart';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getAll() { return load(); }

  function getCount() {
    return load().reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotal() {
    return load().reduce((sum, item) => {
      const num = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + num * item.qty;
    }, 0);
  }

  function add(product) {
    const items = load();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save(items);
    CartUI.update();
    Toast.show(`"${product.name}" adăugat în coș!`);
  }

  function remove(id) {
    const items = load().filter(i => i.id !== id);
    save(items);
    CartUI.update();
  }

  function clear() {
    save([]);
    CartUI.update();
  }

  return { getAll, getCount, getTotal, add, remove, clear };
})();


/* ================================================
   CART UI (sidebar + badge)
   ================================================ */

const CartUI = (() => {
  function update() {
    updateBadge();
    renderSidebar();
  }

  function updateBadge() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;
    const count = Cart.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderSidebar() {
    const container = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.cart-total span:last-child');
    if (!container) return;

    const items = Cart.getAll();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>Coșul tău este gol</p>
        </div>`;
    } else {
      container.innerHTML = items.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.imageUrl}" alt="${item.name}" onerror="this.src='images/logo.png'">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price} MDL × ${item.qty}</div>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove('${item.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>`).join('');
    }

    if (totalEl) {
      totalEl.textContent = Cart.getTotal().toLocaleString('ro-RO') + ' MDL';
    }
  }

  function open() {
    document.querySelector('.cart-sidebar')?.classList.add('open');
    document.querySelector('.cart-sidebar-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderSidebar();
  }

  function close() {
    document.querySelector('.cart-sidebar')?.classList.remove('open');
    document.querySelector('.cart-sidebar-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { update, open, close };
})();

// Make CartUI accessible globally for onclick handlers
window.Cart = Cart;
window.CartUI = CartUI;


/* ================================================
   TOAST NOTIFICATION
   ================================================ */

const Toast = (() => {
  let toastEl = null;
  let timer = null;

  function ensure() {
    if (toastEl) return;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="18" height="18">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span class="toast-msg"></span>`;
    document.body.appendChild(toastEl);
  }

  function show(msg, duration = 2800) {
    ensure();
    toastEl.querySelector('.toast-msg').textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  return { show };
})();

window.Toast = Toast;


/* ================================================
   HEADER: scroll effect + active nav link
   ================================================ */

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Scroll effect
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Cart button
  const cartBtn = document.querySelector('.cart-btn');
  cartBtn?.addEventListener('click', CartUI.open);

  // Cart close
  document.querySelector('.cart-close')?.addEventListener('click', CartUI.close);
  document.querySelector('.cart-sidebar-overlay')?.addEventListener('click', CartUI.close);

  // Keyboard ESC closes cart
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') CartUI.close();
  });

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Init badge on page load
  CartUI.update();
}


/* ================================================
   SEARCH: live header search
   ================================================ */

function initSearch() {
  const input = document.querySelector('.header-search input');
  if (!input) return;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) {
        window.location.href = `pages/produse.html?search=${encodeURIComponent(q)}`;
      }
    }
  });
}


/* ================================================
   NEWSLETTER forms (both in Newsletter section and footer)
   ================================================ */

function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form, .footer-newsletter').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;
      Toast.show('Abonare reușită! Mulțumim! 🎉');
      input.value = '';
    });

    // Also handle button click if no submit event
    const btn = form.querySelector('button');
    btn?.addEventListener('click', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) {
        input?.focus();
        return;
      }
      Toast.show('Abonare reușită! Mulțumim! 🎉');
      input.value = '';
    });
  });
}


/* ================================================
   SMOOTH SCROLL for anchor links
   ================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ================================================
   LAZY IMAGE LOADING
   ================================================ */

function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
}


/* ================================================
   INIT on DOM ready
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSearch();
  initNewsletterForms();
  initSmoothScroll();
  initLazyImages();
});
