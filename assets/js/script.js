// ===================================================================
// Athena Buket: script.js
// Navbar on scroll, parallax engine, reveal-on-scroll, filter katalog,
// dan generator link WhatsApp untuk tiap produk.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAVBAR: background + logo/text contrast on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');
  const navLogoLight = document.getElementById('navLogoLight'); // versi putih, untuk dipakai di atas background gelap
  const navLogoDark = document.getElementById('navLogoDark');   // versi hitam, untuk dipakai di atas navbar terang
  const navLinks = document.querySelectorAll('.nav-link');
  const navCta = document.getElementById('navCta');

  let navIsOnDark = null; // cache state biar tidak utak-atik DOM kalau status belum berubah

  function setNavState(onDark){
    if(navIsOnDark === onDark) return; // skip kalau tidak ada perubahan state
    navIsOnDark = onDark;

    if(onDark){
      // di atas area gelap (hero / belum scroll jauh): tampilkan logo & teks putih
      navLogoLight.style.opacity = '1';
      navLogoDark.style.opacity = '0';
      navLinks.forEach(a => { a.classList.add('text-ivory'); a.classList.remove('text-ink'); });
      if(navCta){
        navCta.classList.add('text-ivory', 'border-ivory');
        navCta.classList.remove('text-ink', 'border-ink');
      }
    } else {
      // navbar sudah di atas background terang: tampilkan logo & teks gelap agar tetap kontras
      navLogoLight.style.opacity = '0';
      navLogoDark.style.opacity = '1';
      navLinks.forEach(a => { a.classList.remove('text-ivory'); a.classList.add('text-ink'); });
      if(navCta){
        navCta.classList.remove('text-ivory', 'border-ivory');
        navCta.classList.add('text-ink', 'border-ink');
      }
    }
  }

  function updateNav(){
    const scrollY = window.scrollY;

    if(scrollY > 40){
      navbar.classList.add('bg-ivory/90', 'backdrop-blur-md', 'border-b', 'border-ink/10', 'py-3');
      navbar.classList.remove('py-5');
    } else {
      navbar.classList.remove('bg-ivory/90', 'backdrop-blur-md', 'border-b', 'border-ink/10', 'py-3');
      navbar.classList.add('py-5');
    }

    // Begitu navbar berubah jadi solid (scrollY > 40), background-nya selalu ivory terang,
    // jadi logo/teks gelap dipakai dari titik itu, bukan menunggu sampai keluar dari hero.
    const shouldUseDark = scrollY > 40;
    setNavState(!shouldUseDark);
  }

  /* ---------- PARALLAX ENGINE ---------- */
  const parallaxLayers = [
    { el: document.getElementById('heroBg'), speed: 0.35 },
    { el: document.getElementById('stemBg'), speed: 0.25 },
    { el: document.getElementById('storyImgBg'), speed: 0.18 },
    { el: document.getElementById('closingBg'), speed: 0.25 }
  ];

  const heroContent = document.getElementById('heroContent');

  function updateParallax(){
    const scrollY = window.scrollY;

    parallaxLayers.forEach(layer => {
      if(!layer.el) return;
      const parent = layer.el.parentElement;
      const rect = parent.getBoundingClientRect();
      if(rect.bottom > -200 && rect.top < window.innerHeight + 200){
        const offset = (scrollY - parent.offsetTop) * layer.speed;
        layer.el.style.transform = `translateY(${offset}px)`;
      }
    });

    if(heroContent){
      const heroRect = heroSection.getBoundingClientRect();
      const progress = Math.min(Math.max(-heroRect.top / heroSection.offsetHeight, 0), 1);
      heroContent.style.transform = `translateY(${progress * 80}px)`;
      heroContent.style.opacity = String(1 - progress * 1.1);
    }
  }

  let ticking = false;
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(() => {
        updateNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));

  /* ---------- WHATSAPP ORDER LINKS ---------- */
  // Nomor WhatsApp Athena Buket: +62 813-6086-9341
  // Format internasional untuk wa.me: tanpa "+" dan tanpa "0" di depan
  const WHATSAPP_NUMBER = '6281360869341';

  document.querySelectorAll('.product-order').forEach(link => {
    const productName = link.dataset.product;
    const productPrice = link.dataset.price;
    const message = `Halo Athena Buket, saya ingin memesan ${productName} (${productPrice}). Apakah masih tersedia?`;
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const generalWaBtn = document.getElementById('generalWaBtn');
  if(generalWaBtn){
    const generalMessage = 'Halo Athena Buket, saya ingin bertanya seputar rangkaian bunga dan pemesanan.';
    generalWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(generalMessage)}`;
    generalWaBtn.target = '_blank';
    generalWaBtn.rel = 'noopener noreferrer';
  }

  /* ---------- CATALOG FILTER ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-ink', 'border-ink', 'text-ivory');
        b.classList.add('text-taupe', 'border-ink/15');
      });
      btn.classList.add('bg-ink', 'border-ink', 'text-ivory');
      btn.classList.remove('text-taupe', 'border-ink/15');

      const filter = btn.dataset.filter;

      products.forEach(product => {
        const category = product.dataset.category;
        const show = filter === 'semua' || category === filter;
        product.style.display = show ? 'flex' : 'none';
      });
    });
  });

});