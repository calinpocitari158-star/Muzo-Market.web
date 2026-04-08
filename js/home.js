/* =============================================
   MUZO MARKET — home.js
   Homepage-specific logic: countdown, products
   ============================================= */

'use strict';

/* ================================================
   PRODUCT DATA
   ================================================ */

const PRODUCTS = [
  {
    id: 'p001',
    name: 'Chitară Electrică Fender Stratocaster',
    price: '2,499',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1649504487428-7a68b1eceabf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: 'Popular',
    category: 'chitare'
  },
  {
    id: 'p002',
    name: 'Pian Digital Yamaha P-125',
    price: '5,999',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1574775332594-6ec23d0d150a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: null,
    category: 'piane'
  },
  {
    id: 'p003',
    name: 'Set Tobe Ludwig Classic Maple',
    price: '4,499',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1760783319956-73b61df24ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: null,
    category: 'tobe'
  },
  {
    id: 'p004',
    name: 'Microfon Studio Neumann U87',
    price: '1,199',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1678356507948-84443bb173e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: 'Nou',
    category: 'microfoane'
  },
  {
    id: 'p005',
    name: 'Vioară Profesională Stradivari 4/4',
    price: '1,799',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1692552950398-63feb911b8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: null,
    category: 'viori'
  },
  {
    id: 'p006',
    name: 'Căști Audio-Technica ATH-M50x',
    price: '899',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1629555258982-b920af8da52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: '-15%',
    category: 'accesorii'
  },
  {
    id: 'p007',
    name: 'Chitară Gibson Les Paul Standard',
    price: '2,199',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1565829577122-f1c838600f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: null,
    category: 'chitare'
  },
  {
    id: 'p008',
    name: 'Chitară Acustică Martin D-28',
    price: '1,699',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1684117736387-69935a4ed00d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    badge: null,
    category: 'chitare'
  }
];

// Export for use in other scripts
window.PRODUCTS = PRODUCTS;


/* ================================================
   RENDER STARS
   ================================================ */

function renderStars(rating, max = 5) {
  let html = '<div class="stars">';
  for (let i = 1; i <= max; i++) {
    html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${i <= rating ? 'star-on' : 'star-off'}">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`;
  }
  html += `<span class="stars-count">(${rating}.0)</span></div>`;
  return html;
}


/* ================================================
   RENDER PRODUCT CARD
   ================================================ */

function renderProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-wishlist" aria-label="Adaugă la favorite" onclick="toggleWishlist('${product.id}', this)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <img class="product-img"
             src="${product.imageUrl}"
             alt="${product.name}"
             loading="lazy"
             onerror="this.src='../images/logo.png'">
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        ${renderStars(product.rating)}
        <div class="product-footer">
          <div class="product-price">${product.price} MDL</div>
          <button class="add-to-cart-btn"
            aria-label="Adaugă în coș"
            onclick='Cart.add(${JSON.stringify(product)})'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}


/* ================================================
   WISHLIST TOGGLE
   ================================================ */

function toggleWishlist(id, btn) {
  const icon = btn.querySelector('svg');
  const isSaved = btn.classList.toggle('saved');
  if (isSaved) {
    icon.style.fill = '#ef4444';
    icon.style.stroke = '#ef4444';
    Toast.show('Adăugat la favorite! ❤️');
  } else {
    icon.style.fill = 'none';
    icon.style.stroke = 'currentColor';
  }
}

window.toggleWishlist = toggleWishlist;


/* ================================================
   COUNTDOWN TIMER (Offers section)
   ================================================ */

function initCountdown() {
  const numEls = document.querySelectorAll('.countdown-num');
  if (!numEls.length) return;

  // Target: 3 days from now (fake promo end)
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59, 0);

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      numEls.forEach(el => el.textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const vals = [d, h, m, s];
    numEls.forEach((el, i) => {
      el.textContent = String(vals[i]).padStart(2, '0');
    });
  }

  tick();
  setInterval(tick, 1000);
}


/* ================================================
   HOMEPAGE PRODUCTS RENDER
   ================================================ */

function initProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(renderProductCard).join('');
}


/* ================================================
   CATEGORY SCROLL TO SECTION
   ================================================ */

function initCategoryLinks() {
  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      window.location.href = `pages/produse.html?cat=${cat}`;
    });
  });
}


/* ================================================
   HERO button scroll
   ================================================ */

function initHeroCTA() {
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


/* ================================================
   INIT
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initCountdown();
  initCategoryLinks();
  initHeroCTA();
});
