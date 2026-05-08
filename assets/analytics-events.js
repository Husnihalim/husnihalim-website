(function () {
  function eventNameFromLink(link) {
    var href = link.getAttribute('href') || '';
    var normalized = href.toLowerCase();

    if (normalized.indexOf('wa.me/') !== -1) return 'whatsapp_click';
    if (normalized.indexOf('mailto:') === 0) return 'email_click';
    if (normalized.indexOf('tel:') === 0) return 'phone_click';
    if (link.hasAttribute('download') || normalized.indexOf('.pdf') !== -1) return 'download_click';
    if (normalized.indexOf('/assessment/') !== -1) return 'assessment_cta_click';
    if (normalized.indexOf('/consulting/') !== -1) return 'consulting_cta_click';
    if (normalized.indexOf('/kaizenchampion/#register') !== -1 || normalized === '#register') return 'kaizen_register_click';

    return '';
  }

  function track(eventName, params) {
    if (!eventName) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: eventName,
      page_path: window.location.pathname
    }, params || {}));
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.nodeName !== 'FORM') return;

    var name = form.getAttribute('name') || '';
    if (form.id === 'contactForm' || name === 'contact') {
      track('contact_form_submit', { form_name: name || form.id });
      return;
    }

    if (name === 'floor-assessment') {
      track('assessment_form_submit', { form_name: name });
    }
  }, true);

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (link) {
      track(eventNameFromLink(link), {
        link_url: link.href,
        link_text: (link.textContent || '').trim().slice(0, 120)
      });
      return;
    }

    var button = event.target.closest && event.target.closest('button');
    if (button && button.classList.contains('btn-start')) {
      track('oee_calculator_start', {
        button_text: (button.textContent || '').trim().slice(0, 120)
      });
    }
  }, true);

  window.addEventListener('oee:completed', function (event) {
    track('oee_calculator_completed', event.detail || {});
  });
})();
