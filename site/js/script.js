/* ============================================================
   BREW & BEAN — Shared Client-Side Logic & State Store
   ============================================================ */

(function () {
  'use strict';

  // --- MENU DATA STORE ---
  const MENU_DATABASE = [
    {
      id: 'espresso',
      name: 'Espresso',
      category: 'coffee',
      price: 120,
      rating: 4.9,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
      description: 'Intense and rich single or double shot of pure roasted Arabica espresso with thick golden crema.',
      tags: ['Hot & Fresh', '100% Arabica Beans']
    },
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      category: 'coffee',
      price: 150,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
      description: 'Rich espresso, steamed milk and velvety foam — the perfect balance of taste and comfort.',
      tags: ['Hot & Fresh', '100% Arabica Beans']
    },
    {
      id: 'latte',
      name: 'Latte',
      category: 'coffee',
      price: 160,
      rating: 4.7,
      reviews: 110,
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
      description: 'Smooth, creamy steamed milk blended delicately over a rich double shot of espresso with subtle foam art.',
      tags: ['Smooth & Creamy', 'Artisan Brew']
    },
    {
      id: 'americano',
      name: 'Americano',
      category: 'coffee',
      price: 130,
      rating: 4.6,
      reviews: 86,
      image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80',
      description: 'Classic espresso diluted with hot filtered water, retaining the full complex aromatics of the bean.',
      tags: ['Bold & Crisp', 'Zero Sugar']
    },
    {
      id: 'iced-coffee',
      name: 'Iced Coffee',
      category: 'coffee',
      price: 170,
      rating: 4.9,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
      description: 'Slow-steeped cold brew served over crystal clear ice with a silky pour of fresh sweet cream.',
      tags: ['Chilled & Refreshing', 'Slow Steeped']
    },
    {
      id: 'mocha',
      name: 'Mocha',
      category: 'coffee',
      price: 180,
      rating: 4.8,
      reviews: 130,
      image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80',
      description: 'Rich Belgian chocolate ganache paired with bold espresso, steamed whole milk and Belgian cocoa dust.',
      tags: ['Belgian Chocolate', 'Indulgent']
    },
    {
      id: 'chocolate-muffin',
      name: 'Chocolate Muffin',
      category: 'desserts',
      price: 120,
      rating: 4.9,
      reviews: 84,
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80',
      description: 'Freshly baked double chocolate chip muffin with a soft gooey center and crunchy crust.',
      tags: ['Baked Fresh Daily', 'Warm & Gooey']
    },
    {
      id: 'butter-croissant',
      name: 'Butter Croissant',
      category: 'snacks',
      price: 110,
      rating: 4.8,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      description: 'Authentic French-style flaky butter croissant, baked golden every morning in our scratch bakery.',
      tags: ['French Butter', 'Flaky Layers']
    },
    {
      id: 'margherita-pizza',
      name: 'Margherita Pizza',
      category: 'snacks',
      price: 249,
      rating: 4.8,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description: 'Stone-baked pizza topped with tomato sauce, mozzarella, and fresh basil.',
      tags: ['Stone Baked', 'Fresh Basil']
    },
    {
      id: 'farmhouse-pizza',
      name: 'Farmhouse Pizza',
      category: 'snacks',
      price: 289,
      rating: 4.8,
      reviews: 35,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description: 'Stone-baked pizza loaded with capsicum, onion, mushrooms, tomato, and mozzarella.',
      tags: ['Loaded Veggies', 'Stone Baked']
    },
    {
      id: 'paneer-tikka-pizza',
      name: 'Paneer Tikka Pizza',
      category: 'snacks',
      price: 319,
      rating: 4.9,
      reviews: 29,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description: 'A spicy Indian-inspired pizza with marinated paneer, peppers, and creamy mozzarella.',
      tags: ['Paneer Tikka', 'Indian Inspired']
    },
    {
      id: 'classic-veg-burger',
      name: 'Classic Veg Burger',
      category: 'snacks',
      price: 149,
      rating: 4.7,
      reviews: 38,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Crispy vegetable patty with lettuce, tomato, and house sauce in a toasted bun.',
      tags: ['Crispy Veg Patty', 'Toasted Bun']
    },
    {
      id: 'double-patty-burger',
      name: 'Double Patty Veg Burger',
      category: 'snacks',
      price: 199,
      rating: 4.8,
      reviews: 33,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Two crispy vegetable patties layered with cheese, lettuce, and house sauce.',
      tags: ['Double Patty', 'Extra Filling']
    },
    {
      id: 'paneer-crunch-burger',
      name: 'Paneer Crunch Burger',
      category: 'snacks',
      price: 189,
      rating: 4.8,
      reviews: 31,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Crispy paneer patty with fresh lettuce and a mildly spiced creamy sauce.',
      tags: ['Crispy Paneer', 'Mild Spice']
    },
    {
      id: 'french-fries',
      name: 'French Fries',
      category: 'snacks',
      price: 99,
      rating: 4.8,
      reviews: 51,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      description: 'Golden, crispy fries seasoned lightly and served hot.',
      tags: ['Crispy', 'Served Hot']
    },
    {
      id: 'peri-peri-fries',
      name: 'Peri Peri Fries',
      category: 'snacks',
      price: 119,
      rating: 4.8,
      reviews: 44,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      description: 'Crispy golden fries tossed with our tangy, mildly spicy peri peri seasoning.',
      tags: ['Peri Peri Seasoning', 'Crispy']
    },
    {
      id: 'cheesy-fries',
      name: 'Cheesy Fries',
      category: 'snacks',
      price: 149,
      rating: 4.9,
      reviews: 39,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      description: 'Hot, crispy fries finished with a generous pour of creamy cheese sauce.',
      tags: ['Creamy Cheese', 'Served Hot']
    },
    {
      id: 'masala-chai',
      name: 'Artisan Masala Chai',
      category: 'tea',
      price: 90,
      rating: 4.9,
      reviews: 160,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      description: 'Assam whole leaf tea brewed with fresh crushed cardamom, ginger, cloves, cinnamon and whole milk.',
      tags: ['Handcrafted Spices', 'Warm Comfort']
    }
  ];

  window.MENU_DATABASE = MENU_DATABASE;

  // --- CART STATE MANAGEMENT ---
  const CART_KEY = 'brew_bean_cart';
  const INITIAL_CART = [
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      price: 150,
      size: 'Medium',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chocolate-muffin',
      name: 'Chocolate Muffin',
      price: 120,
      size: 'Regular',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80'
    }
  ];

  function getCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) {
        localStorage.setItem(CART_KEY, JSON.stringify(INITIAL_CART));
        return INITIAL_CART;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_CART;
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadges();
  }

  function cartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id && i.size === item.size);
    if (existingIndex > -1) {
      cart[existingIndex].qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart(cart);
    showToast(`Added ${item.name} (${item.size || 'Regular'}) to cart!`);
  }

  function removeFromCart(id, size) {
    const cart = getCart().filter(i => !(i.id === id && i.size === size));
    saveCart(cart);
  }

  function updateQty(id, size, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        removeFromCart(id, size);
        return;
      }
    }
    saveCart(cart);
  }

  function updateCartBadges() {
    const count = cartCount();
    document.querySelectorAll('[data-cart-badge]').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  window.BrewCart = { getCart, saveCart, addToCart, removeFromCart, updateQty, cartCount, updateCartBadges };

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>☕</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // --- INITIALIZE ON DOM LOAD ---
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();

    // Mobile Navigation Toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });
    }

    // --- MENU PAGE LOGIC ---
    const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
    const menuGrid = document.getElementById('menuGrid');

    if (menuGrid && filterPills.length > 0) {
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const filterCategory = pill.getAttribute('data-filter');

          const cards = menuGrid.querySelectorAll('.product-card');
          cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (filterCategory === 'all' || cardCat === filterCategory) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    // Quick Add Button Event Delegation
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-quick-add]');
      if (!addBtn) return;
      e.preventDefault();
      e.stopPropagation();

      const id = addBtn.getAttribute('data-id');
      const itemData = MENU_DATABASE.find(i => i.id === id);
      if (itemData) {
        addToCart({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
          size: 'Medium',
          qty: 1,
          image: itemData.image
        });

        addBtn.classList.add('added');
        addBtn.textContent = '✓';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.textContent = '+';
        }, 900);
      }
    });

    // --- PRODUCT DETAIL PAGE LOGIC ---
    const detailWrap = document.getElementById('productDetailWrap');
    if (detailWrap) {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id') || 'cappuccino';
      const product = MENU_DATABASE.find(i => i.id === productId) || MENU_DATABASE[1];

      // Update document title
      document.title = `${product.name} — Brew & Bean`;

      // Fill in fields
      const nameEl = document.getElementById('detailName');
      const priceEl = document.getElementById('detailPrice');
      const descEl = document.getElementById('detailDesc');
      const imgEl = document.getElementById('detailImg');
      const ratingTextEl = document.getElementById('detailRatingText');

      if (nameEl) nameEl.textContent = product.name;
      if (priceEl) priceEl.textContent = `₹ ${product.price}`;
      if (descEl) descEl.textContent = product.description;
      if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
      }
      if (ratingTextEl) ratingTextEl.textContent = `${product.rating} (${product.reviews} reviews)`;

      let currentSize = 'Medium';
      let currentQty = 1;
      let basePrice = product.price;

      // Size Pill Switching
      const sizePills = document.querySelectorAll('.size-pill[data-size]');
      sizePills.forEach(pill => {
        pill.addEventListener('click', () => {
          sizePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentSize = pill.getAttribute('data-size');

          let multiplier = 1;
          if (currentSize === 'Small') multiplier = 0.85;
          if (currentSize === 'Large') multiplier = 1.2;
          const calculatedPrice = Math.round(basePrice * multiplier);
          if (priceEl) priceEl.textContent = `₹ ${calculatedPrice}`;
        });
      });

      // Quantity Stepper
      const qtyMinus = document.getElementById('detailQtyMinus');
      const qtyPlus = document.getElementById('detailQtyPlus');
      const qtyVal = document.getElementById('detailQtyVal');

      if (qtyMinus && qtyPlus && qtyVal) {
        qtyMinus.addEventListener('click', () => {
          if (currentQty > 1) {
            currentQty--;
            qtyVal.textContent = currentQty;
          }
        });
        qtyPlus.addEventListener('click', () => {
          currentQty++;
          qtyVal.textContent = currentQty;
        });
      }

      // Add To Cart Button
      const addToCartBtn = document.getElementById('detailAddToCartBtn');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
          let multiplier = 1;
          if (currentSize === 'Small') multiplier = 0.85;
          if (currentSize === 'Large') multiplier = 1.2;
          const finalPrice = Math.round(basePrice * multiplier);

          addToCart({
            id: product.id,
            name: product.name,
            price: finalPrice,
            size: currentSize,
            qty: currentQty,
            image: product.image
          });
        });
      }
    }

    // --- CART PAGE RENDER & ACTIONS ---
    const cartItemsContainer = document.getElementById('cartItemsList');
    if (cartItemsContainer) {
      renderCartPage();
    }

    function renderCartPage() {
      const cart = getCart();
      const count = cartCount();
      const cartTitle = document.getElementById('cartPageTitle');
      const subtotalEl = document.getElementById('cartSubtotal');
      const totalEl = document.getElementById('cartTotal');
      const deliveryEl = document.getElementById('cartDelivery');
      const emptyStateEl = document.getElementById('cartEmptyState');
      const summaryCard = document.getElementById('cartSummaryCard');

      if (cartTitle) cartTitle.textContent = `Your Cart (${count} items)`;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyStateEl) emptyStateEl.style.display = 'block';
        if (summaryCard) summaryCard.style.display = 'none';
        return;
      }

      if (emptyStateEl) emptyStateEl.style.display = 'none';
      if (summaryCard) summaryCard.style.display = 'block';

      let subtotal = 0;
      let html = '';

      cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        html += `
          <div class="cart-item-card" data-id="${item.id}" data-size="${item.size}">
            <div class="cart-item-left">
              <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
              <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">₹ ${item.price}</div>
              </div>
            </div>
            <div class="cart-item-right">
              <div class="stepper">
                <button class="stepper-btn" data-cart-minus data-id="${item.id}" data-size="${item.size}">−</button>
                <span class="stepper-value">${item.qty}</span>
                <button class="stepper-btn" data-cart-plus data-id="${item.id}" data-size="${item.size}">+</button>
              </div>
              <button class="cart-item-del-btn" data-cart-del data-id="${item.id}" data-size="${item.size}" title="Remove item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      });

      cartItemsContainer.innerHTML = html;

      const deliveryFee = subtotal > 0 ? 30 : 0;
      const total = subtotal + deliveryFee;

      if (subtotalEl) subtotalEl.textContent = `₹ ${subtotal}`;
      if (deliveryEl) deliveryEl.textContent = `₹ ${deliveryFee}`;
      if (totalEl) totalEl.textContent = `₹ ${total}`;

      // Bind Cart Steppers & Delete
      cartItemsContainer.querySelectorAll('[data-cart-minus]').forEach(btn => {
        btn.addEventListener('click', () => {
          updateQty(btn.dataset.id, btn.dataset.size, -1);
          renderCartPage();
        });
      });

      cartItemsContainer.querySelectorAll('[data-cart-plus]').forEach(btn => {
        btn.addEventListener('click', () => {
          updateQty(btn.dataset.id, btn.dataset.size, 1);
          renderCartPage();
        });
      });

      cartItemsContainer.querySelectorAll('[data-cart-del]').forEach(btn => {
        btn.addEventListener('click', () => {
          removeFromCart(btn.dataset.id, btn.dataset.size);
          renderCartPage();
        });
      });
    }

    // Checkout Action
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', async () => {
        const cart = getCart();
        if (!cart || cart.length === 0) {
          showToast('Your cart is empty!');
          return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const deliveryFee = subtotal > 0 ? 30 : 0;
        const total = subtotal + deliveryFee;

        let user = { name: 'Ishant Mogha', email: 'ishant@gmail.com' };
        try {
          const stored = localStorage.getItem('brew_bean_user');
          if (stored) user = JSON.parse(stored);
        } catch (e) {}

        // Disable button and show loading state
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span>⏳</span> Placing Order...';

        let orderId = null;
        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart,
              subtotal,
              deliveryFee,
              total,
              customer: user
            })
          });
          const data = await res.json();
          if (data && (data.orderId || (data.order && data.order.orderId))) {
            orderId = data.orderId || data.order.orderId;
          }
        } catch (err) {
          // Graceful fallback for offline / static hosting
        }

        // Clear the cart
        saveCart([]);

        // Show the full "Order Successfully Placed" success screen
        showOrderSuccessScreen(orderId, total);
      });
    }

    // Show beautiful order success screen (replaces cart content)
    function showOrderSuccessScreen(orderId, total) {
      const mainEl = document.querySelector('.cart-container') || document.querySelector('main');
      if (!mainEl) {
        showToast('Order is Successfully Placed!');
        return;
      }
      const orderRef = orderId ? '#' + orderId : '#' + (Math.floor(Math.random() * 9000) + 1000);
      mainEl.innerHTML = '<style>@keyframes successPulse{0%{transform:scale(.5);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes checkFade{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}</style>' +
        '<div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3rem 1.5rem;">' +
          '<div style="width:96px;height:96px;background:linear-gradient(135deg,#c88a58,#a06b3a);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;animation:successPulse 1s ease-out both;">' +
            '<svg style="width:48px;height:48px;animation:checkFade .4s ease .3s both;opacity:0;" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
          '</div>' +
          '<span style="background:rgba(200,138,88,.15);border:1px solid rgba(200,138,88,.35);color:#c88a58;font-size:.78rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:.35rem 1rem;border-radius:20px;margin-bottom:1.25rem;display:inline-block;">Order Confirmed</span>' +
          '<h1 style="font-family:var(--font-serif,serif);font-size:clamp(1.5rem,4vw,2.1rem);color:#fff;margin:0 0 .75rem;line-height:1.2;">Order is Successfully Placed! ✅</h1>' +
          '<p style="font-size:1rem;color:#9c9288;max-width:420px;margin:0 0 .5rem;line-height:1.6;">Your order <strong style="color:#c88a58;">' + orderRef + '</strong> has been received and is being freshly prepared by our baristas.</p>' +
          (total ? '<p style="font-size:.9rem;color:#6b7280;margin:0 0 2rem;">Total: <strong style="color:#fff;">&#8377; ' + total + '</strong></p>' : '<div style="margin-bottom:2rem;"></div>') +
          '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.25rem 1.5rem;max-width:380px;width:100%;margin-bottom:2rem;text-align:left;">' +
            '<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.85rem;">' +
              '<div style="width:28px;height:28px;background:#c88a58;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.75rem;color:#fff;font-weight:700;">✓</div>' +
              '<div><div style="font-size:.88rem;font-weight:600;color:#fff;">Order Placed</div><div style="font-size:.78rem;color:#9c9288;">Your order has been received</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.85rem;opacity:.5;">' +
              '<div style="width:28px;height:28px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.8rem;color:#9c9288;">2</div>' +
              '<div><div style="font-size:.88rem;font-weight:600;color:#fff;">Kitchen Preparing</div><div style="font-size:.78rem;color:#9c9288;">Baristas are crafting your order</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:.75rem;opacity:.3;">' +
              '<div style="width:28px;height:28px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.12);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.8rem;color:#9c9288;">3</div>' +
              '<div><div style="font-size:.88rem;font-weight:600;color:#fff;">Ready for Pickup</div><div style="font-size:.78rem;color:#9c9288;">Your order will be ready soon</div></div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">' +
            '<a href="menu.html" class="btn btn-caramel">&#9749; Order More</a>' +
            '<a href="index.html" class="btn" style="background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15);">&#8592; Back to Home</a>' +
          '</div>' +
          '<p style="margin-top:1.5rem;font-size:.8rem;color:#6b7280;">&#128231; Admin has been notified of your order.</p>' +
        '</div>';
    }



    // --- AUTH / LOGIN TOGGLE & SUBMIT ---
    const pwToggle = document.getElementById('pwToggle');
    const pwInput = document.getElementById('loginPassword');
    if (pwToggle && pwInput) {
      pwToggle.addEventListener('click', () => {
        const type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwInput.setAttribute('type', type);
      });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword')?.value || '';

        try {
          if (email.includes('@')) {
            const adminRes = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const adminData = await adminRes.json();
            if (adminRes.ok && adminData.success) {
              showToast('Welcome, Cafe Admin! Launching Operations Portal...');
              setTimeout(() => {
                window.location.href = 'admin.html';
              }, 600);
              return;
            }
          }

          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (data && data.user) {
            localStorage.setItem('brew_bean_user', JSON.stringify(data.user));
          } else {
            const defaultUser = {
              name: 'Ishant Mogha',
              email: email || 'ishant@gmail.com',
              phone: '+91 98765 43210',
              address: 'Baghpat, Uttar Pradesh'
            };
            localStorage.setItem('brew_bean_user', JSON.stringify(defaultUser));
          }
        } catch (err) {
          const defaultUser = {
            name: 'Ishant Mogha',
            email: email || 'ishant@gmail.com',
            phone: '+91 98765 43210',
            address: 'Baghpat, Uttar Pradesh'
          };
          localStorage.setItem('brew_bean_user', JSON.stringify(defaultUser));
        }

        showToast('Logged in successfully!');
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 600);
      });
    }

    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        const userProfile = {
          name: 'Ishant Mogha',
          email: 'ishant@gmail.com',
          phone: '+91 98765 43210',
          address: 'Baghpat, Uttar Pradesh'
        };
        try {
          await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userProfile)
          });
        } catch (e) {}
        localStorage.setItem('brew_bean_user', JSON.stringify(userProfile));
        showToast('Signed in with Google!');
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 600);
      });
    }

    // --- PROFILE PAGE LOGIC ---
    const profileInfoTab = document.getElementById('profileInfoTab');
    const profileOrdersTab = document.getElementById('profileOrdersTab');
    const profileGenericTab = document.getElementById('profileGenericTab');
    const profilePanelTitle = document.getElementById('profilePanelTitle');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const genericTabMessage = document.getElementById('genericTabMessage');

    // Populate user profile from localStorage or defaults
    function loadUserProfile() {
      try {
        const stored = localStorage.getItem('brew_bean_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (document.getElementById('profileSideName')) document.getElementById('profileSideName').textContent = u.name || 'Ishant Mogha';
          if (document.getElementById('profileSideEmail')) document.getElementById('profileSideEmail').textContent = u.email || 'ishant@gmail.com';
          if (document.getElementById('profileNameVal')) document.getElementById('profileNameVal').textContent = u.name || 'Ishant Mogha';
          if (document.getElementById('profileEmailVal')) document.getElementById('profileEmailVal').textContent = u.email || 'ishant@gmail.com';
          if (document.getElementById('profilePhoneVal')) document.getElementById('profilePhoneVal').textContent = u.phone || '+91 98765 43210';
          if (document.getElementById('profileAddressVal')) document.getElementById('profileAddressVal').textContent = u.address || 'Baghpat, Uttar Pradesh';
        }
      } catch (e) {}
    }
    loadUserProfile();

    // Fetch and render orders from backend
    async function loadUserOrders() {
      const container = document.getElementById('profileOrdersContainer');
      if (!container) return;

      container.innerHTML = '<div style="padding: 2rem 0; text-align: center; color: var(--ink-muted);">Loading your orders from backend...</div>';

      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        const orders = data && data.data ? data.data : [];

        if (orders.length === 0) {
          container.innerHTML = `
            <div style="padding: 3rem 1rem; text-align: center; color: var(--ink-muted);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">☕</div>
              <p>You haven't placed any orders yet.</p>
              <a href="menu.html" class="btn btn-caramel btn-sm" style="margin-top: 1rem; display: inline-block;">Browse Menu</a>
            </div>
          `;
          return;
        }

        let html = '';
        orders.forEach(ord => {
          const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Recently';

          const itemsHtml = (ord.items || []).map(i => `<span class="order-item-chip">${i.qty}× ${i.name}</span>`).join(' ');

          html += `
            <div class="profile-order-card">
              <div class="order-card-header">
                <div class="order-id-meta">
                  <h5>Order #${ord.orderId}</h5>
                  <span class="order-date-text">${dateStr}</span>
                </div>
                <span class="order-status-badge">${ord.status || 'Confirmed'}</span>
              </div>
              <div class="order-items-summary">
                ${itemsHtml || '<span class="order-item-chip">1× Artisan Coffee</span>'}
              </div>
              <div class="order-total-row">
                <span>Total Paid</span>
                <span style="color: var(--caramel-gold); font-size: 1.1rem;">₹ ${ord.total || 0}</span>
              </div>
            </div>
          `;
        });

        container.innerHTML = html;
      } catch (err) {
        container.innerHTML = `
          <div style="padding: 2rem 0; text-align: center; color: var(--ink-muted);">
            Unable to load orders from backend. Make sure server is running on http://localhost:3000.
          </div>
        `;
      }
    }

    const profileTabs = document.querySelectorAll('.profile-nav-btn[data-tab]');
    if (profileTabs.length > 0) {
      profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          profileTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const tabKey = tab.getAttribute('data-tab');

          if (profileInfoTab) profileInfoTab.style.display = 'none';
          if (profileOrdersTab) profileOrdersTab.style.display = 'none';
          if (profileGenericTab) profileGenericTab.style.display = 'none';
          if (editProfileBtn) editProfileBtn.style.display = 'none';

          if (tabKey === 'profile') {
            if (profileInfoTab) profileInfoTab.style.display = 'flex';
            if (profilePanelTitle) profilePanelTitle.textContent = 'My Profile';
            if (editProfileBtn) editProfileBtn.style.display = 'inline-block';
          } else if (tabKey === 'orders') {
            if (profileOrdersTab) profileOrdersTab.style.display = 'block';
            if (profilePanelTitle) profilePanelTitle.textContent = 'Past Orders';
            loadUserOrders();
          } else {
            if (profileGenericTab) profileGenericTab.style.display = 'block';
            const tabName = tab.querySelector('span')?.textContent || tabKey;
            if (profilePanelTitle) profilePanelTitle.textContent = tabName;
            if (genericTabMessage) genericTabMessage.textContent = `No saved ${tabName.toLowerCase()} found.`;
          }
        });
      });
    }

    // Edit Profile Trigger
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        const currentName = document.getElementById('profileNameVal')?.textContent || 'Ishant Mogha';
        const newName = prompt('Enter your full name:', currentName);
        if (newName && newName.trim()) {
          const user = JSON.parse(localStorage.getItem('brew_bean_user') || '{}');
          user.name = newName.trim();
          localStorage.setItem('brew_bean_user', JSON.stringify(user));
          loadUserProfile();
          showToast('Profile updated successfully!');
        }
      });
    }

    // --- CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const subject = document.getElementById('contactSubject')?.value || '';
        const message = document.getElementById('contactMessage')?.value || '';

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });
          const data = await res.json();
          showToast(data.message || 'Thank you! Your message has been sent.');
          contactForm.reset();
        } catch (err) {
          showToast('Thank you! Your message has been received.');
          contactForm.reset();
        }
      });
    }

    // --- GALLERY LIGHTBOX MODAL ---
    const galleryTiles = document.querySelectorAll('.gallery-tile[data-full]');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (galleryTiles.length > 0 && lightbox && lightboxImg) {
      galleryTiles.forEach(tile => {
        tile.addEventListener('click', () => {
          const fullSrc = tile.getAttribute('data-full');
          lightboxImg.src = fullSrc;
          lightbox.classList.add('open');
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
          lightbox.classList.remove('open');
        });
      }

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('open');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
          lightbox.classList.remove('open');
        }
      });
    }

    // --- INITIALIZE SCROLL EFFECTS ENGINE ---
    initScrollEffects();

  });

  // ============================================================
  // SCROLL EFFECTS & REVEAL ENGINE
  // ============================================================
  function initScrollEffects() {
    // 1. DYNAMICALLY INJECT SCROLL PROGRESS BAR IF MISSING
    let progressContainer = document.querySelector('.scroll-progress-container');
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressContainer) {
      progressContainer = document.createElement('div');
      progressContainer.className = 'scroll-progress-container';
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress-bar';
      progressContainer.appendChild(progressBar);
      document.body.prepend(progressContainer);
    }

    // 2. DYNAMICALLY INJECT BACK-TO-TOP BUTTON IF MISSING
    let backToTopBtn = document.querySelector('.back-to-top-btn');
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'back-to-top-btn';
      backToTopBtn.setAttribute('aria-label', 'Back to top of page');
      backToTopBtn.innerHTML = `
        <svg class="progress-ring" viewBox="0 0 48 48">
          <circle class="progress-bg" cx="24" cy="24" r="20" />
          <circle class="progress-bar" cx="24" cy="24" r="20" />
        </svg>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(backToTopBtn);
    }

    const ringProgressBar = backToTopBtn.querySelector('.progress-bar');
    const ringRadius = 20;
    const ringCircumference = 2 * Math.PI * ringRadius; // ~125.66
    if (ringProgressBar) {
      ringProgressBar.style.strokeDasharray = `${ringCircumference}`;
      ringProgressBar.style.strokeDashoffset = `${ringCircumference}`;
    }

    // Back to top click
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // 3. NAVBAR SCROLL STATE & SCROLL PROGRESS TRACKING
    const siteNav = document.getElementById('siteNav') || document.querySelector('.nav');
    const scrollCues = document.querySelectorAll('.scroll-cue');

    let isTicking = false;

    function onScrollUpdate() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPct = scrollHeight > 0 ? Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100) : 0;

      // Update Top Progress Bar
      if (progressBar) {
        progressBar.style.width = `${scrollPct}%`;
      }

      // Update Nav Scrolled State
      if (siteNav) {
        if (scrollTop > 20) {
          siteNav.classList.add('nav-scrolled');
        } else {
          siteNav.classList.remove('nav-scrolled');
        }
      }

      // Update Back-To-Top Button
      if (backToTopBtn) {
        if (scrollTop > 260) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }

        if (ringProgressBar) {
          const offset = ringCircumference - (scrollPct / 100) * ringCircumference;
          ringProgressBar.style.strokeDashoffset = `${offset}`;
        }
      }

      // Update Scroll Cue
      if (scrollCues.length > 0) {
        scrollCues.forEach(cue => {
          if (scrollTop > 60) {
            cue.classList.add('scrolled-out');
          } else {
            cue.classList.remove('scrolled-out');
          }
        });
      }

      // Parallax effect on hero background / cards
      const heroCard = document.querySelector('.hero-card');
      if (heroCard && scrollTop < 800) {
        const translateY = scrollTop * 0.12;
        heroCard.style.transform = `translateY(${translateY}px)`;
      }

      isTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(onScrollUpdate);
        isTicking = true;
      }
    }, { passive: true });

    // Initial check
    onScrollUpdate();

    // 4. SCROLL CUE CLICK HANDLER
    scrollCues.forEach(cue => {
      cue.addEventListener('click', () => {
        const nextSection = document.querySelector('.trust-strip') || document.querySelector('.story-section') || document.querySelector('.container');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 5. SCROLL REVEAL (INTERSECTION OBSERVER)
    // Automatically tag key elements if they don't have explicit data-reveal
    const autoRevealSelectors = [
      '.hero-content',
      '.trust-item',
      '.story-left',
      '.story-img-card',
      '.product-card',
      '.gallery-tile',
      '.contact-detail-item',
      '.contact-form-card',
      '.profile-sidebar',
      '.profile-content-area',
      '.auth-card',
      '.cart-item-card',
      '.cart-summary-card',
      '.page-header',
      '.footer-grid > *'
    ];

    autoRevealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.hasAttribute('data-reveal') && !el.classList.contains('reveal')) {
          el.setAttribute('data-reveal', 'fade-up');
          // Add staggered delay to grid items
          const parentGrid = el.closest('.product-grid, .trust-grid, .gallery-mosaic-grid, .contact-items-list, .footer-grid');
          if (parentGrid) {
            const siblings = Array.from(parentGrid.children);
            const index = siblings.indexOf(el);
            if (index > -1) {
              el.style.setProperty('--reveal-delay', `${(index % 6) * 90}ms`);
            }
          }
        }
      });
    });

    // Observe elements for reveal
    const revealElements = document.querySelectorAll('[data-reveal], .reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);

            // Trigger number counter if present
            const counters = entry.target.querySelectorAll('[data-counter]');
            counters.forEach(animateCounter);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 6. ANIMATED STAT COUNTER FUNCTION
    function animateCounter(counterEl) {
      if (counterEl._animated) return;
      counterEl._animated = true;

      const target = parseFloat(counterEl.getAttribute('data-counter'));
      const prefix = counterEl.getAttribute('data-prefix') || '';
      const suffix = counterEl.getAttribute('data-suffix') || '';
      const decimals = parseInt(counterEl.getAttribute('data-decimals') || '0', 10);
      const duration = 1600;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = ease * target;

        counterEl.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counterEl.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(updateNumber);
    }

    // ============================================================
    // 7. AI SMART MENU RECOMMENDATION & TASTE SOMMELIER
    // ============================================================
    function initAiMenuSommelier() {
      const sommelierSec = document.getElementById('aiSommelierSection');
      const moodChips = document.getElementById('aiMoodChips');
      const promptForm = document.getElementById('aiPromptForm');
      const promptInput = document.getElementById('aiPromptInput');
      const recResult = document.getElementById('aiRecResult');
      if (!sommelierSec || !recResult) return;

      let currentMood = 'energy';

      async function fetchAndRenderRecommendation(params = {}) {
        recResult.classList.add('loading');
        recResult.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 2rem; animation: pulseGreen 1s infinite;">☕</div>
            <p style="color: var(--caramel-gold); font-weight: 600; margin-top: 0.75rem;">AI Barista is consulting sensory aroma notes...</p>
          </div>
        `;

        try {
          const res = await fetch('/api/ai/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
          });
          const data = await res.json();
          renderRecommendationData(data);
        } catch (err) {
          // Fallback static recommendation
          renderRecommendationData({
            primary: {
              id: 'cappuccino',
              name: 'Cappuccino',
              price: 150,
              matchScore: 96,
              title: 'Velvety Balanced Harmony',
              rationale: 'A silky blend of bold Arabica roast and microfoam milk, creating the ultimate comfort balance.',
              tasteProfile: ['Velvety Crema', 'Balanced Acidity', 'Warm Comfort'],
              image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'
            },
            pairing: {
              id: 'chocolate-muffin',
              name: 'Chocolate Muffin',
              price: 120,
              matchScore: 94,
              title: 'Gooey Pastry Duo',
              rationale: 'Warm double-chocolate ganache balances the roasty notes of your brew.',
              tasteProfile: ['Warm Ganache', 'Crunchy Crust'],
              image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80'
            },
            baristaNote: '💡 Tip: Enjoy within 5 minutes of pour for peak flavor aroma!'
          });
        } finally {
          recResult.classList.remove('loading');
        }
      }

      function renderRecommendationData(data) {
        if (!data || !data.primary) return;
        const p = data.primary;
        const pair = data.pairing;

        const comboPrice = (p.price || 0) + (pair ? pair.price || 0 : 0);

        let tagsHtml = '';
        if (Array.isArray(p.tasteProfile)) {
          tagsHtml = p.tasteProfile.map(t => `<span class="ai-taste-tag">✨ ${t}</span>`).join('');
        }

        let pairingHtml = '';
        if (pair) {
          pairingHtml = `
            <div class="ai-pairing-card">
              <div>
                <div class="ai-pairing-header">✨ Perfect Pairing Companion</div>
                <div class="ai-pairing-content">
                  <img src="${pair.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'}" alt="${pair.name}" class="ai-pairing-img">
                  <div>
                    <h4 style="color: #ffffff; margin: 0 0 0.2rem; font-size: 1.05rem;">${pair.name}</h4>
                    <div style="color: var(--caramel-gold); font-weight: 700; font-size: 0.95rem;">₹ ${pair.price}</div>
                    <p style="font-size: 0.82rem; color: var(--ink-white-muted); margin-top: 0.25rem;">${pair.title || 'Complementary Flavor'}</p>
                  </div>
                </div>
                <p style="font-size: 0.82rem; color: #f4eee5; line-height: 1.4;">${pair.rationale || ''}</p>
              </div>
              <button class="ai-btn-add" style="margin-top: 0.85rem; width: 100%; text-align: center;" data-add-pairing="${pair.id}">
                + Add ${pair.name} (₹${pair.price})
              </button>
            </div>
          `;
        }

        recResult.innerHTML = `
          <div class="ai-rec-cards-grid">
            <!-- Primary Card -->
            <div class="ai-primary-card">
              <img src="${p.image || 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'}" alt="${p.name}" class="ai-card-img">
              <div class="ai-card-body">
                <div class="ai-match-score-pill">
                  <span>★</span> <span>${p.matchScore || 98}% Flavor Match</span>
                </div>
                <h3 class="ai-card-title">${p.name}</h3>
                <div class="ai-card-price">₹ ${p.price}</div>
                <p class="ai-card-desc">${p.rationale || ''}</p>
                <div class="ai-taste-tags">${tagsHtml}</div>
                <div class="ai-actions-row">
                  <button class="ai-btn-add" data-add-primary="${p.id}">
                    + Add ${p.name} to Cart
                  </button>
                  ${pair ? `
                    <button class="ai-btn-combo" data-add-combo="${p.id},${pair.id}">
                      🎁 Add Duo Combo (₹${comboPrice})
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Pairing Card -->
            ${pairingHtml}
          </div>

          ${data.baristaNote ? `
            <div class="ai-rationale-box">
              ${data.baristaNote}
            </div>
          ` : ''}
        `;

        // Bind Add Actions
        const primaryAddBtn = recResult.querySelector(`[data-add-primary="${p.id}"]`);
        if (primaryAddBtn) {
          primaryAddBtn.addEventListener('click', () => {
            const itemObj = MENU_DATABASE.find(i => i.id === p.id) || {
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image
            };
            BrewCart.addToCart({
              id: itemObj.id,
              name: itemObj.name,
              price: itemObj.price,
              size: 'Medium',
              qty: 1,
              image: itemObj.image
            });
          });
        }

        if (pair) {
          const pairingAddBtn = recResult.querySelector(`[data-add-pairing="${pair.id}"]`);
          if (pairingAddBtn) {
            pairingAddBtn.addEventListener('click', () => {
              const pairObj = MENU_DATABASE.find(i => i.id === pair.id) || {
                id: pair.id,
                name: pair.name,
                price: pair.price,
                image: pair.image
              };
              BrewCart.addToCart({
                id: pairObj.id,
                name: pairObj.name,
                price: pairObj.price,
                size: 'Regular',
                qty: 1,
                image: pairObj.image
              });
            });
          }

          const comboAddBtn = recResult.querySelector(`[data-add-combo]`);
          if (comboAddBtn) {
            comboAddBtn.addEventListener('click', () => {
              const itemObj = MENU_DATABASE.find(i => i.id === p.id) || { id: p.id, name: p.name, price: p.price, image: p.image };
              const pairObj = MENU_DATABASE.find(i => i.id === pair.id) || { id: pair.id, name: pair.name, price: pair.price, image: pair.image };
              
              BrewCart.addToCart({ id: itemObj.id, name: itemObj.name, price: itemObj.price, size: 'Medium', qty: 1, image: itemObj.image });
              BrewCart.addToCart({ id: pairObj.id, name: pairObj.name, price: pairObj.price, size: 'Regular', qty: 1, image: pairObj.image });
              showToast(`Added ${p.name} + ${pair.name} Duo to cart!`);
            });
          }
        }
      }

      // Mood Chip Click Handlers
      if (moodChips) {
        moodChips.querySelectorAll('.ai-mood-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            moodChips.querySelectorAll('.ai-mood-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentMood = chip.getAttribute('data-ai-mood');
            if (promptInput) promptInput.value = '';
            fetchAndRenderRecommendation({ mood: currentMood });
          });
        });
      }

      // Prompt Submit Handler
      if (promptForm && promptInput) {
        promptForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = promptInput.value.trim();
          if (!query) return;
          if (moodChips) {
            moodChips.querySelectorAll('.ai-mood-chip').forEach(c => c.classList.remove('active'));
          }
          fetchAndRenderRecommendation({ query, mood: currentMood });
        });
      }

      // Initial load recommendation
      fetchAndRenderRecommendation({ mood: 'energy' });
    }

    // ============================================================
    // 8. AI PRODUCT PAGE PAIRING RECOMMENDATION
    // ============================================================
    async function initProductAiPairing() {
      const wrap = document.getElementById('productAiPairingWrap');
      const content = document.getElementById('productAiPairingContent');
      if (!wrap || !content) return;

      const urlParams = new URLSearchParams(window.location.search);
      const currentId = urlParams.get('id') || 'cappuccino';

      try {
        const res = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: currentId })
        });
        const data = await res.json();
        if (data && data.pairing) {
          const pair = data.pairing;
          content.innerHTML = `
            <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
              <img src="${pair.image}" alt="${pair.name}" style="width: 100px; height: 100px; border-radius: var(--radius-md); object-fit: cover; box-shadow: 0 6px 16px rgba(0,0,0,0.3);">
              <div style="flex: 1; min-width: 240px;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                  <span style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: #ffffff;">${pair.name}</span>
                  <span style="color: var(--caramel-gold); font-weight: 700; font-size: 1.1rem;">₹ ${pair.price}</span>
                  <span class="ai-match-score-pill" style="margin-bottom: 0;">${pair.matchScore}% Match</span>
                </div>
                <p style="font-size: 0.9rem; color: #f4eee5; line-height: 1.45; margin-bottom: 0.75rem;">${pair.rationale || 'Complementary flavor pairing carefully curated for this roast.'}</p>
                <button class="ai-btn-add" id="productAddPairingBtn" style="font-size: 0.88rem; padding: 0.5rem 1.1rem;">
                  + Add ${pair.name} to Pair with this
                </button>
              </div>
            </div>
          `;

          const addBtn = document.getElementById('productAddPairingBtn');
          if (addBtn) {
            addBtn.addEventListener('click', () => {
              const pairObj = MENU_DATABASE.find(i => i.id === pair.id) || {
                id: pair.id,
                name: pair.name,
                price: pair.price,
                image: pair.image
              };
              BrewCart.addToCart({
                id: pairObj.id,
                name: pairObj.name,
                price: pairObj.price,
                size: 'Regular',
                qty: 1,
                image: pairObj.image
              });
            });
          }
        }
      } catch (err) {
        wrap.style.display = 'none';
      }
    }

    // ============================================================
    // 9. AI CART DYNAMIC UPSELL & COMPANION
    // ============================================================
    async function initCartAiUpsell() {
      const wrap = document.getElementById('cartAiUpsellWrap');
      const content = document.getElementById('cartAiUpsellContent');
      if (!wrap || !content) return;

      const cart = BrewCart.getCart();
      if (!cart || cart.length === 0) {
        wrap.style.display = 'none';
        return;
      }

      try {
        const res = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart })
        });
        const data = await res.json();
        if (data && data.pairing) {
          const pair = data.pairing;
          // Check if already in cart
          const alreadyInCart = cart.some(i => i.id === pair.id);
          const targetItem = alreadyInCart ? (data.primary || pair) : pair;

          wrap.style.display = 'block';
          content.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${targetItem.image}" alt="${targetItem.name}" style="width: 55px; height: 55px; border-radius: var(--radius-sm); object-fit: cover;">
                <div>
                  <h4 style="color: #ffffff; margin: 0; font-size: 0.95rem;">${targetItem.name} <span style="color: var(--caramel-gold); font-weight: 700;">₹ ${targetItem.price}</span></h4>
                  <p style="color: var(--ink-white-muted); font-size: 0.8rem; margin-top: 0.15rem;">${data.baristaNote || 'Pairs seamlessly with your current selections.'}</p>
                </div>
              </div>
              <button class="ai-btn-add" id="cartAddUpsellBtn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                + Add to Cart (₹${targetItem.price})
              </button>
            </div>
          `;

          const btn = document.getElementById('cartAddUpsellBtn');
          if (btn) {
            btn.addEventListener('click', () => {
              const itemObj = MENU_DATABASE.find(i => i.id === targetItem.id) || {
                id: targetItem.id,
                name: targetItem.name,
                price: targetItem.price,
                image: targetItem.image
              };
              BrewCart.addToCart({
                id: itemObj.id,
                name: itemObj.name,
                price: itemObj.price,
                size: 'Regular',
                qty: 1,
                image: itemObj.image
              });
              const cartList = document.getElementById('cartItemsList');
              if (cartList && typeof renderCartPage === 'function') {
                renderCartPage();
              } else {
                location.reload();
              }
            });
          }
        }
      } catch (err) {
        wrap.style.display = 'none';
      }
    }

    // ============================================================
    // 10. GLOBAL FLOATING AI BARISTA ASSISTANT WIDGET (BeanBot)
    // ============================================================
    function initFloatingAiBarista() {
      // Create Floating trigger and modal if not on admin page
      if (window.location.pathname.includes('admin.html')) return;
      if (document.getElementById('aiFloatingTrigger')) return;

      const trigger = document.createElement('div');
      trigger.id = 'aiFloatingTrigger';
      trigger.className = 'ai-floating-trigger';
      trigger.setAttribute('aria-label', 'Open AI Barista Chat');
      trigger.innerHTML = `
        <div class="ai-floating-icon">☕</div>
        <span class="ai-floating-text">AI Barista</span>
        <div class="ai-floating-pulse"></div>
      `;

      const modal = document.createElement('div');
      modal.id = 'aiChatModal';
      modal.className = 'ai-chat-modal';
      modal.innerHTML = `
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-floating-icon" style="width: 28px; height: 28px; font-size: 0.85rem;">☕</div>
            <div>
              <h4 class="ai-chat-header-title">BeanBot — AI Master Barista</h4>
              <div class="ai-chat-header-sub">Powered by Claude & Sensory AI</div>
            </div>
          </div>
          <button class="ai-chat-close-btn" id="aiChatCloseBtn" aria-label="Close chat">×</button>
        </div>

        <div class="ai-chat-messages" id="aiChatMessages">
          <div class="ai-msg ai-msg-bot">
            Hello! I'm BeanBot, your personal coffee sommelier at Brew & Bean. ☕<br><br>
            Ask me about our Arabica roasts, milk options, sweet dessert pairings, or let me recommend your ideal drink!
          </div>
        </div>

        <div class="ai-quick-prompts" id="aiChatQuickPrompts">
          <button class="ai-quick-prompt-btn" data-prompt="What is your sweetest coffee?">Sweet Coffee 🍫</button>
          <button class="ai-quick-prompt-btn" data-prompt="I need maximum caffeine for study">Study Boost ⚡</button>
          <button class="ai-quick-prompt-btn" data-prompt="What pastry pairs best with Chai?">Chai Pairing 🥐</button>
          <button class="ai-quick-prompt-btn" data-prompt="What are your zero sugar drinks?">Zero Sugar 🌿</button>
        </div>

        <form class="ai-chat-input-bar" id="aiChatForm">
          <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask BeanBot anything..." autocomplete="off">
          <button type="submit" class="ai-chat-send-btn" aria-label="Send message">➔</button>
        </form>
      `;

      document.body.appendChild(trigger);
      document.body.appendChild(modal);

      const closeBtn = document.getElementById('aiChatCloseBtn');
      const chatForm = document.getElementById('aiChatForm');
      const chatInput = document.getElementById('aiChatInput');
      const chatMessages = document.getElementById('aiChatMessages');
      const quickPrompts = document.getElementById('aiChatQuickPrompts');

      const chatHistory = [];

      trigger.addEventListener('click', () => {
        modal.classList.toggle('open');
        if (modal.classList.contains('open') && chatInput) {
          setTimeout(() => chatInput.focus(), 200);
        }
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });

      async function sendChatMessage(text) {
        if (!text || !text.trim()) return;
        const msg = text.trim();

        // Append user message
        const userDiv = document.createElement('div');
        userDiv.className = 'ai-msg ai-msg-user';
        userDiv.textContent = msg;
        chatMessages.appendChild(userDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatHistory.push({ role: 'user', content: msg });

        // Add temporary typing message
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-msg ai-msg-bot';
        typingDiv.innerHTML = '<em>BeanBot is brewing a response... ☕</em>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, history: chatHistory })
          });
          const data = await res.json();
          typingDiv.remove();

          const botDiv = document.createElement('div');
          botDiv.className = 'ai-msg ai-msg-bot';
          
          let formattedReply = (data.reply || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          botDiv.innerHTML = formattedReply;

          // If suggested item exists, attach quick add button
          if (data.suggestedItemId) {
            const item = MENU_DATABASE.find(i => i.id === data.suggestedItemId);
            if (item) {
              const btnWrap = document.createElement('div');
              btnWrap.style.marginTop = '0.6rem';
              btnWrap.innerHTML = `
                <button class="ai-btn-add" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;" data-chat-add="${item.id}">
                  + Add ${item.name} (₹${item.price})
                </button>
              `;
              btnWrap.querySelector('[data-chat-add]').addEventListener('click', () => {
                BrewCart.addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  size: 'Medium',
                  qty: 1,
                  image: item.image
                });
              });
              botDiv.appendChild(btnWrap);
            }
          }

          chatMessages.appendChild(botDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          chatHistory.push({ role: 'assistant', content: data.reply });
        } catch (err) {
          typingDiv.innerHTML = "I'm always here to recommend our fresh brews! Try our signature **Cappuccino (₹150)** or fresh **Butter Croissant (₹110)**!";
        }
      }

      if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = chatInput.value;
          chatInput.value = '';
          sendChatMessage(val);
        });
      }

      if (quickPrompts) {
        quickPrompts.querySelectorAll('.ai-quick-prompt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-prompt');
            sendChatMessage(promptText);
          });
        });
      }
    }

    // Initialize AI Modules
    initAiMenuSommelier();
    initProductAiPairing();
    initCartAiUpsell();
    initFloatingAiBarista();
  }

})();


