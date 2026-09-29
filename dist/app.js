(() => {
  'use strict';
  const config = window.PUTRI_FLORIST;
  const whatsapp = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  const openWhatsApp = message => window.open(whatsapp(message), '_blank', 'noopener,noreferrer');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const setMenu = expanded => {
    menuToggle.setAttribute('aria-expanded', String(expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mobileMenu.hidden = !expanded;
  };
  window.closeMainMenu = () => setMenu(false);
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  const desktopCategories = document.querySelector('.nav-categories');
  document.addEventListener('click', event => { if (desktopCategories.open && !desktopCategories.contains(event.target)) desktopCategories.open = false; });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!mobileMenu.hidden) { setMenu(false); menuToggle.focus(); }
    if (desktopCategories.open) { desktopCategories.open = false; desktopCategories.querySelector('summary').focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // Use the current host so product links work on localhost and the final domain.
  document.querySelectorAll('[data-product-name]').forEach(link => {
    const url = new URL(link.dataset.productUrl, config.siteUrl || window.location.origin).href;
    link.href = whatsapp(`Halo Putri Florist!\n\nSaya tertarik dengan rangkaian:\n${link.dataset.productName}\n\nHarga: ${link.dataset.productPrice}\nLink: ${url}\n\nBoleh dibantu pilihan desain, harga, dan ketersediaannya untuk area ${config.city}?`);
  });

  const catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    const form = catalog.querySelector('form');
    const search = form.querySelector('[name="q"]');
    const category = form.querySelector('[name="kategori"]');
    const moment = form.querySelector('[name="momen"]');
    const cards = [...catalog.querySelectorAll('[data-catalog-item]')];
    const fixedCategory = catalog.dataset.fixedCategory;
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id').trim();
    const filter = (updateUrl = true) => {
      const words = normalize(search.value).split(/\s+/).filter(Boolean);
      let count = 0;
      cards.forEach(card => {
        const visible = (!(fixedCategory || category.value) || card.dataset.category === (fixedCategory || category.value))
          && (!moment.value || card.dataset.moments.split(' ').includes(moment.value))
          && words.every(word => normalize(card.dataset.search).includes(word));
        card.hidden = !visible;
        if (visible) count += 1;
      });
      catalog.querySelector('[data-result-count]').textContent = `${count} inspirasi rangkaian${moment.value ? ` untuk ${moment.selectedOptions[0].text.toLowerCase()}` : ''}`;
      catalog.querySelector('[data-empty]').hidden = count > 0;
      if (updateUrl) {
        const params = new URLSearchParams();
        if (search.value.trim()) params.set('q', search.value.trim());
        if (category.value && !fixedCategory) params.set('kategori', category.value);
        if (moment.value) params.set('momen', moment.value);
        history.replaceState(null, '', `${location.pathname}${params.size ? '?' + params.toString() : ''}`);
      }
    };
    const readQuery = () => {
      const params = new URLSearchParams(location.search);
      search.value = params.get('q') || '';
      category.value = fixedCategory || params.get('kategori') || '';
      moment.value = params.get('momen') || '';
      if (category.selectedIndex < 0) category.value = fixedCategory || '';
      if (moment.selectedIndex < 0) moment.value = '';
      filter(false);
    };
    form.addEventListener('submit', event => { event.preventDefault(); filter(); });
    form.addEventListener('input', () => filter());
    form.addEventListener('change', () => filter());
    form.addEventListener('reset', event => {
      event.preventDefault();
      search.value = '';
      category.value = fixedCategory || '';
      moment.value = '';
      filter();
    });
    window.addEventListener('popstate', readQuery);
    readQuery();
  }

  const gallery = document.querySelector('.gallery-main');
  if (gallery) {
    const dialog = document.querySelector('#gallery-dialog');
    document.querySelectorAll('[data-gallery-view]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      gallery.classList.toggle('is-detail', button.dataset.galleryView === 'detail');
    }));
    gallery.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('[data-close-gallery]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => gallery.focus());
  }

  const galleryPage = document.querySelector('[data-gallery-page]');
  if (galleryPage) {
    const filterButtons = [...galleryPage.querySelectorAll('[data-gallery-filter]')];
    const searchInput = galleryPage.querySelector('[data-gallery-search]');
    const countDisplay = galleryPage.querySelector('[data-gallery-count]');
    const emptyDisplay = galleryPage.querySelector('[data-gallery-empty]');
    const resetBtn = galleryPage.querySelector('[data-gallery-reset]');
    const pagination = galleryPage.querySelector('[data-gallery-pagination]');
    const moreBtn = galleryPage.querySelector('[data-gallery-more]');
    const cards = [...galleryPage.querySelectorAll('[data-gallery-item]')];

    const lightbox = document.querySelector('#gallery-lightbox');
    const lightboxImg = lightbox?.querySelector('#lightbox-img');
    const lightboxTitle = lightbox?.querySelector('#lightbox-title');
    const lightboxCategory = lightbox?.querySelector('#lightbox-category');
    const lightboxCounter = lightbox?.querySelector('#lightbox-counter');
    const lightboxWaBtn = lightbox?.querySelector('#lightbox-wa-btn');
    const closeBtn = lightbox?.querySelector('[data-close-lightbox]');
    const prevBtn = lightbox?.querySelector('[data-lightbox-prev]');
    const nextBtn = lightbox?.querySelector('[data-lightbox-next]');

    const PAGE_CHUNK = 24;
    let visibleLimit = PAGE_CHUNK;
    let activeCategory = 'all';
    let filteredCards = [...cards];
    let activeLightboxIndex = -1;
    let lastFocusedElement = null;

    galleryPage.querySelectorAll('[data-gallery-wa-item]').forEach(link => {
      const card = link.closest('[data-gallery-item]');
      const title = card?.querySelector('.gallery-card-title')?.textContent || '';
      const cat = card?.querySelector('.gallery-card-cat')?.textContent || '';
      const url = new URL(`/galeri?id=${card?.dataset.id || ''}`, config.siteUrl || window.location.origin).href;
      link.href = whatsapp(`Halo Putri Florist!\n\nSaya tertarik dengan rangkaian pada galeri:\n${title} (${cat})\nLink foto: ${url}\n\nApakah model seperti ini bisa dipesan untuk area ${config.city}? Boleh dibantu info harga dan detailnya?`);
    });

    const updateDisplay = (updateUrl = true) => {
      const q = (searchInput?.value || '').trim().toLowerCase();
      filteredCards = cards.filter(card => {
        const matchCat = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchSearch = !q || card.dataset.search.includes(q);
        return matchCat && matchSearch;
      });

      cards.forEach(card => { card.hidden = true; });
      filteredCards.slice(0, visibleLimit).forEach(card => { card.hidden = false; });

      if (countDisplay) {
        countDisplay.textContent = `Menampilkan ${Math.min(visibleLimit, filteredCards.length)} dari ${filteredCards.length} foto rangkaian`;
      }
      if (emptyDisplay) {
        emptyDisplay.hidden = filteredCards.length > 0;
      }
      if (pagination && moreBtn) {
        if (visibleLimit < filteredCards.length) {
          pagination.hidden = false;
          moreBtn.textContent = `Tampilkan lebih banyak (${filteredCards.length - visibleLimit} tersisa)`;
        } else {
          pagination.hidden = true;
        }
      }

      if (updateUrl) {
        const params = new URLSearchParams(window.location.search);
        if (activeCategory !== 'all') params.set('kategori', activeCategory);
        else params.delete('kategori');
        if (q) params.set('q', q);
        else params.delete('q');
        const searchStr = params.toString();
        history.replaceState(null, '', `${location.pathname}${searchStr ? '?' + searchStr : ''}`);
      }
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.galleryFilter;
        visibleLimit = PAGE_CHUNK;
        filterButtons.forEach(b => {
          const isSelected = b === btn;
          b.setAttribute('aria-selected', String(isSelected));
          b.classList.toggle('is-active', isSelected);
        });
        updateDisplay();
      });
    });

    searchInput?.addEventListener('input', () => {
      visibleLimit = PAGE_CHUNK;
      updateDisplay();
    });

    resetBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activeCategory = 'all';
      visibleLimit = PAGE_CHUNK;
      filterButtons.forEach(b => {
        const isAll = b.dataset.galleryFilter === 'all';
        b.setAttribute('aria-selected', String(isAll));
        b.classList.toggle('is-active', isAll);
      });
      updateDisplay();
    });

    moreBtn?.addEventListener('click', () => {
      visibleLimit += PAGE_CHUNK;
      updateDisplay(false);
    });

    const showLightboxItem = index => {
      if (!lightbox || !filteredCards.length) return;
      activeLightboxIndex = (index + filteredCards.length) % filteredCards.length;
      const card = filteredCards[activeLightboxIndex];
      const trigger = card.querySelector('[data-gallery-trigger]');
      const preview = trigger.dataset.preview;
      const title = trigger.dataset.title;
      const cat = trigger.dataset.category;
      const id = card.dataset.id;

      if (lightboxImg) {
        lightboxImg.src = preview;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = cat;
      if (lightboxCounter) lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${filteredCards.length}`;

      if (lightboxWaBtn) {
        const url = new URL(`/galeri?id=${id}`, config.siteUrl || window.location.origin).href;
        lightboxWaBtn.href = whatsapp(`Halo Putri Florist!\n\nSaya tertarik dengan rangkaian pada galeri:\n${title} (${cat})\nLink foto: ${url}\n\nApakah model seperti ini bisa dipesan untuk area ${config.city}? Boleh dibantu info harga dan detailnya?`);
      }
    };

    galleryPage.addEventListener('click', event => {
      const trigger = event.target.closest('[data-gallery-trigger]');
      if (!trigger || !lightbox) return;
      lastFocusedElement = trigger;
      const card = trigger.closest('[data-gallery-item]');
      const index = filteredCards.indexOf(card);
      if (index >= 0) {
        showLightboxItem(index);
        lightbox.showModal();
        closeBtn?.focus();
      }
    });

    prevBtn?.addEventListener('click', () => showLightboxItem(activeLightboxIndex - 1));
    nextBtn?.addEventListener('click', () => showLightboxItem(activeLightboxIndex + 1));
    closeBtn?.addEventListener('click', () => lightbox?.close());

    lightbox?.addEventListener('click', event => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox?.addEventListener('close', () => {
      lastFocusedElement?.focus();
    });

    document.addEventListener('keydown', event => {
      if (!lightbox || !lightbox.open) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showLightboxItem(activeLightboxIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showLightboxItem(activeLightboxIndex + 1);
      }
    });

    const readUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('kategori');
      const qParam = params.get('q');
      if (catParam && filterButtons.some(b => b.dataset.galleryFilter === catParam)) {
        activeCategory = catParam;
        filterButtons.forEach(b => {
          const isSelected = b.dataset.galleryFilter === catParam;
          b.setAttribute('aria-selected', String(isSelected));
          b.classList.toggle('is-active', isSelected);
        });
      }
      if (qParam && searchInput) {
        searchInput.value = qParam;
      }
      updateDisplay(false);

      const idParam = params.get('id');
      if (idParam && lightbox) {
        const targetIndex = filteredCards.findIndex(c => c.dataset.id === idParam);
        if (targetIndex >= 0) {
          showLightboxItem(targetIndex);
          lightbox.showModal();
        }
      }
    };

    window.addEventListener('popstate', readUrlState);
    readUrlState();
  }

  document.querySelectorAll('[data-delivery-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const area = form.querySelector('input').value.trim();
    if (!area) { form.querySelector('input').focus(); return; }
    openWhatsApp(`Halo Putri Florist! Saya ingin mengecek pengiriman bunga ke ${area}. Apakah area tersebut dilayani? Mohon informasi ketersediaan jadwal dan ongkos kirimnya.`);
  }));
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(contactForm);
    const name = String(values.get('name')).trim();
    const message = String(values.get('message')).trim();
    if (!name || !message) return;
    openWhatsApp(`Halo Putri Florist!\n\nNama: ${name}\nRangkaian: ${values.get('category')}\nTanggal kebutuhan: ${values.get('date') || 'Akan dikonfirmasi'}\n\n${message}\n\nMohon bantuan untuk desain, harga, dan ketersediaannya.\nDari: ${location.origin}/kontak`);
  });

  const floating = document.querySelector('.floating-chat');
  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.site-footer');
  const primaryTargets = [...document.querySelectorAll('[data-contact-form], .product-info .button, .final-cta .button')];
  const visiblePrimary = new Set();
  let heroVisible = Boolean(hero);
  let footerVisible = false;
  const syncFloating = () => floating.classList.toggle('is-hidden', heroVisible || footerVisible || visiblePrimary.size > 0);
  syncFloating();
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === footer) footerVisible = entry.isIntersecting;
      if (primaryTargets.includes(entry.target)) {
        if (entry.isIntersecting) visiblePrimary.add(entry.target);
        else visiblePrimary.delete(entry.target);
      }
    });
    syncFloating();
  }, {threshold: 0});
  if (hero) visibility.observe(hero);
  visibility.observe(footer);
  primaryTargets.forEach(target => visibility.observe(target));
})();
