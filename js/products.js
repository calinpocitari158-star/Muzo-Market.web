/* =============================================
   MUZO MARKET — products.js
   Products & Offers pages logic:
   filtering, sorting, search, view toggle, pagination
   ============================================= */

'use strict';

/* ================================================
   ALL PRODUCTS DATA (extended catalog)
   ================================================ */

const ALL_PRODUCTS = [
  { id:'p001', name:'Chitară Electrică Fender Stratocaster', price:'2,499', rating:5, imageUrl:'https://images.unsplash.com/photo-1649504487428-7a68b1eceabf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:'Popular', category:'chitare', brand:'Fender' },
  { id:'p002', name:'Pian Digital Yamaha P-125', price:'5,999', rating:5, imageUrl:'https://images.unsplash.com/photo-1574775332594-6ec23d0d150a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'piane', brand:'Yamaha' },
  { id:'p003', name:'Set Tobe Ludwig Classic Maple', price:'4,499', rating:4, imageUrl:'https://images.unsplash.com/photo-1760783319956-73b61df24ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'tobe', brand:'Ludwig' },
  { id:'p004', name:'Microfon Studio Neumann U87', price:'1,199', rating:5, imageUrl:'https://images.unsplash.com/photo-1678356507948-84443bb173e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:'Nou', category:'microfoane', brand:'Neumann' },
  { id:'p005', name:'Vioară Profesională Stradivari 4/4', price:'1,799', rating:5, imageUrl:'https://images.unsplash.com/photo-1692552950398-63feb911b8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'viori', brand:'Stradivari' },
  { id:'p006', name:'Căști Audio-Technica ATH-M50x', price:'899', rating:5, imageUrl:'https://images.unsplash.com/photo-1629555258982-b920af8da52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:'-15%', category:'accesorii', brand:'Audio-Technica' },
  { id:'p007', name:'Chitară Gibson Les Paul Standard', price:'2,199', rating:5, imageUrl:'https://images.unsplash.com/photo-1565829577122-f1c838600f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'chitare', brand:'Gibson' },
  { id:'p008', name:'Chitară Acustică Martin D-28', price:'1,699', rating:4, imageUrl:'https://images.unsplash.com/photo-1684117736387-69935a4ed00d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'chitare', brand:'Martin' },
  { id:'p009', name:'Chitară Clasică Yamaha C40', price:'599', rating:4, imageUrl:'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'chitare', brand:'Yamaha' },
  { id:'p010', name:'Orga Roland GO:KEYS 5', price:'2,999', rating:5, imageUrl:'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:'Nou', category:'piane', brand:'Roland' },
  { id:'p011', name:'Tobe Electronice Roland TD-17KV', price:'6,499', rating:5, imageUrl:'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'tobe', brand:'Roland' },
  { id:'p012', name:'Microfon Shure SM58 + Stativ', price:'799', rating:4, imageUrl:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', badge:null, category:'microfoane', brand:'Shure' },
];

/* ================================================
   STATE
   ================================================ */

let state = {
  products: [...ALL_PRODUCTS],
  filtered: [...ALL_PRODUCTS],
  view: 'grid',         // 'grid' | 'list'
  currentPage: 1,
  perPage: 9,
  activeCategory: 'all',
  sortBy: 'default',
  searchQuery: '',
  priceMax: 10000,
};


/* ================================================
   HELPERS
   ================================================ */

function parsePrice(p) {
  return parseFloat(p.replace(/[^0-9.]/g, ''));
}

function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${i <= rating ? 'star-on' : 'star-off'}">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`;
  }
  html += `<span class="stars-count">(${rating}.0)</span></div>`;
  return html;
}

function renderCardHTML(p) {
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img class="product-img" src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='../images/logo.png'">
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        ${renderStars(p.rating)}
        <div class="product-footer">
          <div class="product-price">${p.price} MDL</div>
          <button class="add-to-cart-btn" onclick='Cart.add(${JSON.stringify(p)})'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

function renderListHTML(p) {
  return `
    <div class="product-list-item">
      <img class="product-list-img" src="${p.imageUrl}" alt="${p.name}" onerror="this.src='../images/logo.png'">
      <div class="product-list-body">
        <div>
          <div class="product-list-name">${p.name}</div>
          ${renderStars(p.rating)}
          <div class="product-list-desc">Brand: ${p.brand} &nbsp;·&nbsp; Categorie: ${p.category}</div>
        </div>
        <div class="product-list-footer">
          <div class="product-price">${p.price} MDL</div>
          <button class="btn btn-primary btn-sm" onclick='Cart.add(${JSON.stringify(p)})'>Adaugă în coș</button>
        </div>
      </div>
    </div>`;
}


/* ================================================
   FILTER & SORT
   ================================================ */

function applyFilters() {
  let result = [...state.products];

  // Category
  if (state.activeCategory !== 'all') {
    result = result.filter(p => p.category === state.activeCategory);
  }

  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Price max
  result = result.filter(p => parsePrice(p.price) <= state.priceMax);

  // Sort
  switch (state.sortBy) {
    case 'price-asc':  result.sort((a,b) => parsePrice(a.price) - parsePrice(b.price)); break;
    case 'price-desc': result.sort((a,b) => parsePrice(b.price) - parsePrice(a.price)); break;
    case 'rating':     result.sort((a,b) => b.rating - a.rating); break;
    case 'name':       result.sort((a,b) => a.name.localeCompare(b.name)); break;
  }

  state.filtered = result;
  state.currentPage = 1;
  render();
}


/* ================================================
   RENDER PRODUCTS + PAGINATION
   ================================================ */

function render() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('products-count');
  if (!grid) return;

  const start = (state.currentPage - 1) * state.perPage;
  const page = state.filtered.slice(start, start + state.perPage);

  if (state.filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <h3>Niciun produs găsit</h3>
        <p>Încearcă alte filtre sau termeni de căutare.</p>
      </div>`;
  } else {
    if (state.view === 'list') {
      grid.className = 'products-list';
      grid.innerHTML = page.map(renderListHTML).join('');
    } else {
      grid.className = 'products-grid-3';
      grid.innerHTML = page.map(renderCardHTML).join('');
    }
  }

  // Count
  if (countEl) {
    countEl.innerHTML = `<span>${state.filtered.length}</span> produse găsite`;
  }

  renderPagination();
}


/* ================================================
   PAGINATION
   ================================================ */

function renderPagination() {
  const container = document.getElementById('pagination');
  if (!container) return;

  const total = Math.ceil(state.filtered.length / state.perPage);
  if (total <= 1) { container.innerHTML = ''; return; }

  let html = '';

  // Prev
  html += `<button class="page-btn" onclick="goToPage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled style="opacity:.4;cursor:default"' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
  </button>`;

  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === state.currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  // Next
  html += `<button class="page-btn" onclick="goToPage(${state.currentPage + 1})" ${state.currentPage === total ? 'disabled style="opacity:.4;cursor:default"' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
  </button>`;

  container.innerHTML = html;
}

function goToPage(page) {
  const total = Math.ceil(state.filtered.length / state.perPage);
  if (page < 1 || page > total) return;
  state.currentPage = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToPage = goToPage;


/* ================================================
   INIT PRODUCTS PAGE
   ================================================ */

function initProductsPage() {
  // Read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) state.activeCategory = params.get('cat');
  if (params.get('search')) state.searchQuery = params.get('search');

  // Category filter buttons (top bar)
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    if (btn.dataset.cat === state.activeCategory) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.cat;
      applyFilters();
    });
  });

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  sortSelect?.addEventListener('change', () => {
    state.sortBy = sortSelect.value;
    applyFilters();
  });

  // View toggle
  document.querySelectorAll('.view-toggle button[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      render();
    });
  });

  // Sidebar checkboxes
  document.querySelectorAll('.filter-checkbox-item input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      // collect checked categories from sidebar
      const checked = [...document.querySelectorAll('.filter-checkbox-item input[type="checkbox"]:checked')]
        .map(c => c.value);
      state.activeCategory = checked.length === 0 ? 'all' : checked[0];
      applyFilters();
    });
  });

  // Sidebar price range
  const priceRange = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  priceRange?.addEventListener('input', () => {
    state.priceMax = parseInt(priceRange.value);
    if (priceDisplay) priceDisplay.textContent = parseInt(priceRange.value).toLocaleString('ro-RO') + ' MDL';
  });

  priceRange?.addEventListener('change', applyFilters);

  // Sidebar apply button
  document.querySelector('.sidebar-apply')?.addEventListener('click', applyFilters);

  // Local search within products page
  const localSearch = document.getElementById('products-search');
  if (localSearch) {
    localSearch.value = state.searchQuery;
    localSearch.addEventListener('input', () => {
      state.searchQuery = localSearch.value.trim();
      applyFilters();
    });
  }

  // Sync checkbox if URL has cat
  if (state.activeCategory !== 'all') {
    const cb = document.querySelector(`.filter-checkbox-item input[value="${state.activeCategory}"]`);
    if (cb) cb.checked = true;
  }

  applyFilters();
}


/* ================================================
   INIT
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
});
