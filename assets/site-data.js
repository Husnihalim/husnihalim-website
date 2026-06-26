/* ============================================================
   HUSNI HALIM — site-data.js
   Centralised data for companies, announcements, and renders.

   HOW TO ADD A NEW COMPANY:
   1. Add an entry to SITE_COMPANIES below.
   2. If a logo is available, add the "logo" property.
   3. If no logo, the portfolio page will show a text wordmark.
   4. All pages using the marquee will update automatically.

   HOW TO ADD A WEBSITE UPDATE ANNOUNCEMENT:
   1. Add an entry to SITE_ANNOUNCEMENTS at the TOP of the array.
   2. Use ISO date format (YYYY-MM-DD) in the "date" field.
   3. Items from the last 14 days get a "NEW" badge automatically.
   ============================================================ */

(function () {
  'use strict';

  /* ---- COMPANIES ----
     name        : exact display name used in the scrolling marquee
     display     : shorter name for portfolio wordmark (optional)
     logo        : logo image URL for portfolio grid (optional)
     tall        : true if logo needs taller container (optional)
     small       : true if wordmark should use smaller font (optional)
  */
  const SITE_COMPANIES = [
    /* ----- logos (major clients) ----- */
    { name: "Intel Technology Sdn Bhd", display: "Intel", logo: "https://logos-api.apistemic.com/domain:intel.com" },
    { name: "Petronas", display: "Petronas", logo: "https://logos-api.apistemic.com/domain:petronas.com", tall: true },
    { name: "Safran Landing Systems (M) Sdn Bhd", display: "Safran", logo: "https://logos-api.apistemic.com/domain:safran-group.com" },
    { name: "Panasonic Aircond Malaysia", display: "Panasonic", logo: "https://logos-api.apistemic.com/domain:panasonic.com" },
    { name: "Mitsui High-Tec Malaysia Sdn Bhd", display: "Mitsui High-Tec", logo: "https://logos-api.apistemic.com/domain:mitsui-high-tec.com" },
    { name: "Maxeon Solar Technologies", display: "Maxeon", logo: "https://logos-api.apistemic.com/domain:maxeon.com" },
    { name: "Carotino Sdn Bhd", display: "Carotino", logo: "https://logos-api.apistemic.com/domain:carotino.com" },
    { name: "Munchy Food Industries Sdn Bhd", display: "Munchy's", logo: "https://logos-api.apistemic.com/domain:munchys.com" },
    { name: "Inari Technology", display: "Inari", logo: "https://logos-api.apistemic.com/domain:inariberhad.com" },
    { name: "Datasonic Group Berhad", display: "Datasonic", logo: "https://logos-api.apistemic.com/domain:datasonic.com.my" },
    { name: "Sharp TV Manufacturing", display: "Sharp", logo: "https://logos-api.apistemic.com/domain:global.sharp" },
    { name: "Koito Manufacturing Sdn Bhd", display: "Koito", logo: "https://logos-api.apistemic.com/domain:koito.co.jp" },
    { name: "HRD Corp Malaysia", display: "HRD Corp", logo: "https://logos-api.apistemic.com/domain:hrdcorp.gov.my" },
    { name: "Malaysian Automotive Research & Innovation Institute (MARii)", display: "MARii", logo: "https://logos-api.apistemic.com/domain:marii.my" },
    { name: "TERAJU", display: "TERAJU", logo: "https://logos-api.apistemic.com/domain:teraju.gov.my" },
    { name: "Sapura Industrial Berhad", display: "Sapura Industrial", logo: "https://logos-api.apistemic.com/domain:sapuraindustrial.com.my" },
    { name: "MAB Engineering Services", display: "MAB Engineering", logo: "/assets/portfolio/logos/mab-engineering-logo.jpg" },

    /* ----- text wordmarks (portfolio grid) ----- */
    { name: "Jabatan Perkhidmatan Awam", display: "JPA", small: true },
    { name: "Jabatan Pengangkutan Jalan (KA)", display: "JPJ", small: true },
    { name: "Fakulti AI, UTM AI", display: "UTM AI", small: true },
    { name: "Aeon Bakery", display: "Aeon Bakery", small: true },
    { name: "Asian NDK Crystal Snd Bhd", display: "Asian NDK Crystal", small: true },
    { name: "Chemi Con", display: "Chemi Con", small: true },
    { name: "Extech Pro (M) Sdn Bhd", display: "Extech Pro", small: true },
    { name: "FBK Manufacturing", display: "FBK Manufacturing", small: true },
    { name: "FCL Components", display: "FCL Components", small: true },
    { name: "FSR Technologies Sdn Bhd", display: "FSR Technologies", small: true },
    { name: "HT Ceramics", display: "HT Ceramics", small: true },
    { name: "Kato Manufacturing", display: "Kato Manufacturing", small: true },
    { name: "Kulim Technology Park", display: "Kulim Technology Park", small: true },
    { name: "Lyndon Basell", display: "LyondellBasell", small: true },
    { name: "New Age Aluminium Ind Sdn Bhd", display: "New Age Aluminium", small: true },
    { name: "Plastitechnic (M) Sdn Bhd", display: "Plastitechnic", small: true },
    { name: "POS Logistic Berhad", display: "POS Logistics", small: true },
    { name: "Sato Manufacturing", display: "Sato Manufacturing", small: true },
    { name: "Smart Meter Tech (M) Sdn Bhd", display: "Smart Meter Tech", small: true },
    { name: "WRP Gloves", display: "WRP Gloves", small: true },

    /* ----- manufacturing / SME ----- */
    { name: "Aerospace Composite Malaysia Sdn Bhd", display: "Aerospace Composite Malaysia", small: true },
    { name: "Bintulu Port Holdings Berhad", display: "Bintulu Port", small: true },
    { name: "Bomatec Sdn Bhd", display: "Bomatec", small: true },
    { name: "BRB Malaysia Sdn Bhd", display: "BRB Malaysia", small: true },
    { name: "Careglove Global Sdn Bhd", display: "Careglove Global", small: true },
    { name: "Ciba Vision Sdn Bhd", display: "Ciba Vision", small: true },
    { name: "DIMAL Asia Pacific", display: "DIMAL Asia Pacific", small: true },
    { name: "Eastman Chemical Sdn Bhd", display: "Eastman Chemical", small: true },
    { name: "Feoso Oil (M) Sdn Bhd", display: "Feoso Oil", small: true },
    { name: "FLE (M) Sdn Bhd", display: "FLE", small: true },
    { name: "H&R Wax Malaysia Sdn Bhd", display: "H&R Wax Malaysia", small: true },
    { name: "Hitachi Asia (M) Sdn Bhd", display: "Hitachi Asia", small: true },
    { name: "Huber Suhner (M) Sdn Bhd", display: "Huber Suhner", small: true },
    { name: "Jaya Nets Sdn Bhd", display: "Jaya Nets", small: true },
    { name: "KRAIBURG TPE Technology (M) Sdn Bhd", display: "KRAIBURG TPE", small: true },
    { name: "Negeri Sembilan Cement Industries Sdn Bhd", display: "Negeri Sembilan Cement", small: true },
    { name: "NI Malaysia Sdn Bhd", display: "NI Malaysia", small: true },
    { name: "Novugen Oncology Sdn Bhd", display: "Novugen Oncology", small: true },
    { name: "Novugen Pharma Sdn Bhd", display: "Novugen Pharma", small: true },
    { name: "Salutica Allied Solutions Sdn Bhd", display: "Salutica", small: true },
    { name: "San Miguel Yamamura Woven Products Sdn Bhd", display: "San Miguel Yamamura", small: true },
    { name: "Shinko Electronics (M) Sdn Bhd", display: "Shinko Electronics", small: true },
    { name: "SMART Modular Technologies Sdn Bhd", display: "SMART Modular", small: true },
    { name: "Stenta Films (M) Sdn Bhd", display: "Stenta Films", small: true },
    { name: "Tenaga Cable Industries Sdn Bhd", display: "Tenaga Cable", small: true },
    { name: "Terberg Manufacturing & Assembly Sdn Bhd", display: "Terberg Manufacturing", small: true },
    { name: "Thales DIS (M) Sdn Bhd", display: "Thales DIS", small: true },
    { name: "The Italian Baker Sdn Bhd", display: "The Italian Baker", small: true },
    { name: "Toyo Tires (M) Snd Bhd", display: "Toyo Tires", small: true },
    { name: "Venator Asia Sdn Bhd", display: "Venator Asia", small: true },
    { name: "Wipro Unza (M) Sdn Bhd", display: "Wipro Unza", small: true },

    /* ----- Prysmian global plants ----- */
    { name: "Prysmian Arco Felice EHV Cables Plant", display: "Prysmian Arco Felice", small: true },
    { name: "Prysmian Cikampek", display: "Prysmian Cikampek", small: true },
    { name: "Prysmian Power Cables Malaysia", display: "Prysmian Malaysia", small: true },
    { name: "Prysmian Sorocaba Building Wires Plant", display: "Prysmian Sorocaba", small: true },
    { name: "Prysmian Tianjin Special Cables Plant", display: "Prysmian Tianjin", small: true },

    /* ----- F&B / SME ----- */
    { name: "Akif Cafe Sdn Bhd", display: "Akif Cafe", small: true },
    { name: "Al Haddad", display: "Al Haddad", small: true },
    { name: "Ameen Products", display: "Ameen Products", small: true },
    { name: "Anramin Industry", display: "Anramin Industry", small: true },
    { name: "Ayam Bismi", display: "Ayam Bismi", small: true },
    { name: "Bot Industries", display: "Bot Industries", small: true },
    { name: "Faiz Food & Beverages", display: "Faiz Food & Beverages", small: true },
    { name: "Fatiah Frozen Sdn Bhd", display: "Fatiah Frozen", small: true },
    { name: "Jabi Rice Mill", display: "Jabi Rice Mill", small: true },
    { name: "Kopiah Industry", display: "Kopiah Industry", small: true },
    { name: "MGV Industries", display: "MGV Industries", small: true },
    { name: "Miwa Manufacturing", display: "Miwa Manufacturing", small: true },
    { name: "PNA Technologies", display: "PNA Technologies", small: true },
    { name: "Tishas Food", display: "Tishas Food", small: true },

    /* ----- added after initial list ----- */
    { name: "Petronas Carigali Sdn Bhd", display: "Petronas Carigali", small: true },
    { name: "Pesaka Nuri", display: "Pesaka Nuri", small: true },
    { name: "Help University", display: "Help University", small: true },
    { name: "Datasonic Sdn Bhd", display: "Datasonic", small: true },
  ];

  /* ---- ANNOUNCEMENTS ----
     type  : badge label (e.g. "New Client", "Program", "Blog")
     title : headline text
     url   : link target
     meta  : short subtitle
     date  : ISO date string YYYY-MM-DD (used for "NEW" badge)
  */
  const SITE_ANNOUNCEMENTS = [
    {
      type: "New Client",
      title: "Petronas Carigali PSM — Kaizen Principles Training",
      url: "/portfolio/petronas-cargali-psm-kaizen-training/",
      meta: "June 2026 · PECC Kerteh · PSM department",
      date: "2026-06-27"
    },
    {
      type: "New Client",
      title: "Pesaka Nuri — Kaizen Principles Training",
      url: "/portfolio/pesaka-nuri-training-update/",
      meta: "June 2026 · Leadership team training",
      date: "2026-06-15"
    },
    {
      type: "New Client",
      title: "Pos Logistics Berhad As-Is Process Workshop",
      url: "/portfolio/pos-logistic-plb-workshop/",
      meta: "Jan – Feb 2026 · SIPOC & Deployment Chart",
      date: "2026-02-01"
    },
    {
      type: "Program",
      title: "Kaizen Champion Development Program",
      url: "/kaizenchampion/",
      meta: "Public cohort or in-house delivery",
      date: "2026-01-15"
    },
    {
      type: "Training",
      title: "HRDC Claimable In-House Training",
      url: "/hrdc-training/",
      meta: "OEE · Kaizen · 5S · TPM · Lean",
      date: "2026-01-10"
    },
    {
      type: "Blog",
      title: "OEE Training Malaysia Guide",
      url: "/blog/oee-training-malaysia/",
      meta: "For manufacturing leaders",
      date: "2026-01-05"
    },
    {
      type: "Consulting",
      title: "Free Manufacturing Assessment",
      url: "/#contact",
      meta: "Start with the floor, not slides",
      date: "2026-01-01"
    },
    {
      type: "New Offer",
      title: "AI for Industry 4.0 Training",
      url: "/hrdc-training/ai-industry-4-0/",
      meta: "Practical manufacturing use cases",
      date: "2025-12-20"
    },
    {
      type: "Engagement",
      title: "MAB Engineering Coaching Series 2026",
      url: "/portfolio/#results",
      meta: "Aviation MRO · Kaizen for LAEs",
      date: "2026-04-01"
    }
  ];

  /* ============================================================
     RENDERERS
     ============================================================ */

  const NEW_DAYS = 14;

  function isNew(dateStr) {
    if (!dateStr) return false;
    const then = new Date(dateStr);
    const now = new Date();
    const diff = (now - then) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= NEW_DAYS;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- Announcement bar ---- */
  function renderAnnouncements(container) {
    if (!container) return;
    const items = SITE_ANNOUNCEMENTS;
    if (!items.length) {
      container.style.display = 'none';
      return;
    }

    /* Build track HTML (duplicate for seamless scroll) */
    const buildCards = () => {
      return items.map(item => {
        const newBadge = isNew(item.date) ? '<span class="site-update-new" style="display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:18px;padding:0 6px;border-radius:999px;background:var(--c-accent,#8b2252);color:#fff;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-right:2px;">New</span>' : '';
        return `<a class="site-update-card" href="${escapeHtml(item.url)}"><span class="site-update-type">${escapeHtml(item.type)}</span>${newBadge}<span class="site-update-title">${escapeHtml(item.title)}</span><span class="site-update-dot"></span><span class="site-update-meta">${escapeHtml(item.meta)}</span></a>`;
      }).join('');
    };

    const cards = buildCards();

    /* If container is already a track, just replace its HTML */
    if (container.classList && container.classList.contains('site-updates-track')) {
      container.innerHTML = cards + cards;
      return;
    }

    const track = document.createElement('div');
    track.className = 'site-updates-track';
    track.innerHTML = cards + cards; /* duplicate for infinite scroll */
    container.innerHTML = '';
    container.appendChild(track);
  }

  /* ---- Company marquee (scrolling names) ---- */
  function renderCompanyMarquee(container) {
    if (!container) return;
    const track = container.querySelector('.company-marquee-track');
    if (!track) return;

    const names = SITE_COMPANIES.map(c => c.name);
    const spans = names.map(n => `<span>${escapeHtml(n)}</span>`).join('');

    track.innerHTML = `
      <div class="company-marquee-group">${spans}</div>
      <div class="company-marquee-group" aria-hidden="true">${spans}</div>
    `;
  }

  /* ---- Client logo grid (portfolio page) ---- */
  function renderClientLogoGrid(container) {
    if (!container) return;
    const cards = SITE_COMPANIES.map(c => {
      const classes = ['client-logo-card'];
      if (c.tall) classes.push('is-tall');
      if (c.small || !c.logo) classes.push('is-small');
      const cls = classes.join(' ');

      if (c.logo) {
        const alt = escapeHtml(c.display || c.name);
        const jsAlt = escapeHtml(JSON.stringify(c.display || c.name));
        return `<div class="${cls}"><img src="${escapeHtml(c.logo)}" alt="${alt} logo" loading="lazy" onerror="var p=this.parentElement;var s=document.createElement('span');s.className='client-wordmark';s.textContent=${jsAlt};p.classList.add('is-small');this.replaceWith(s);"></div>`;
      }
      return `<div class="${cls}"><span class="client-wordmark">${escapeHtml(c.display || c.name)}</span></div>`;
    }).join('');

    container.innerHTML = cards;
  }

  /* ============================================================
     AUTO-INIT
     ============================================================ */

  function init() {
    /* Announcements bar — new containers */
    document.querySelectorAll('[data-render-announcements]').forEach(el => {
      /* If the element is a wrapper, build the full structure inside it */
      const wrapper = document.createElement('div');
      wrapper.className = 'site-updates-viewport';
      el.innerHTML = '';
      el.appendChild(wrapper);
      renderAnnouncements(wrapper);
    });

    /* Announcements bar — auto-upgrade existing tracks on other pages */
    document.querySelectorAll('.site-updates-track').forEach(track => {
      /* Skip if already handled by data-render-announcements */
      if (track.closest('[data-render-announcements]')) return;
      renderAnnouncements(track);
    });

    /* Company marquee */
    document.querySelectorAll('[data-render-companies-marquee]').forEach(el => {
      renderCompanyMarquee(el);
    });

    /* Client logo grid */
    document.querySelectorAll('[data-render-client-logos]').forEach(el => {
      renderClientLogoGrid(el);
    });

    /* Make updates bar touch-scrollable on mobile */
    makeUpdatesTouchable();
  }

  function makeUpdatesTouchable() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;
    document.querySelectorAll('.site-updates-viewport').forEach(vp => {
      vp.style.overflowX = 'auto';
      vp.style.webkitOverflowScrolling = 'touch';
      vp.style.touchAction = 'pan-x';
      vp.style.scrollbarWidth = 'none';
      vp.style.msOverflowStyle = 'none';
      const track = vp.querySelector('.site-updates-track');
      if (track) {
        track.style.animation = 'none';
        track.style.flexWrap = 'nowrap';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose globally so other scripts can call manually if needed */
  window.SiteData = {
    companies: SITE_COMPANIES,
    announcements: SITE_ANNOUNCEMENTS,
    renderAnnouncements,
    renderCompanyMarquee,
    renderClientLogoGrid,
    refresh: init
  };
})();
