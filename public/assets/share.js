(function () {
  function encode(value) {
    return encodeURIComponent(value || '');
  }

  function getShareData(el) {
    var container = el.closest('[data-share-url]');
    var canonical = document.querySelector('link[rel="canonical"]');
    var titleMeta = document.querySelector('meta[property="og:title"]') || document.querySelector('title');
    var url = el.getAttribute('data-share-url') ||
      (container && container.getAttribute('data-share-url')) ||
      (canonical && canonical.href) ||
      window.location.href;
    var title = el.getAttribute('data-share-title') ||
      (container && container.getAttribute('data-share-title')) ||
      (titleMeta && (titleMeta.content || titleMeta.textContent)) ||
      document.title;
    return { url: url, title: title };
  }

  function buildUrl(network, data) {
    var url = encode(data.url);
    var title = encode(data.title);
    if (network === 'whatsapp') return 'https://wa.me/?text=' + title + '%20' + url;
    if (network === 'linkedin') return 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
    if (network === 'facebook') return 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    if (network === 'x') return 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url;
    return data.url;
  }

  function setCopied(button) {
    var label = button.querySelector('span');
    var previous = label ? label.textContent : button.textContent;
    if (label) label.textContent = 'Copied';
    else button.textContent = 'Copied';
    button.classList.add('is-copied');
    window.setTimeout(function () {
      if (label) label.textContent = previous;
      else button.textContent = previous;
      button.classList.remove('is-copied');
    }, 1600);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-share-action]');
    if (!button) return;

    var action = button.getAttribute('data-share-action');
    var data = getShareData(button);

    if (action === 'copy') {
      event.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(data.url).then(function () {
          setCopied(button);
        });
      } else {
        window.prompt('Copy this link', data.url);
      }
      return;
    }

    if (action === 'native') {
      event.preventDefault();
      if (navigator.share) {
        navigator.share({ title: data.title, url: data.url }).catch(function () {});
      } else {
        window.open(buildUrl('whatsapp', data), '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (button.tagName === 'A' && !button.href) {
      button.href = buildUrl(action, data);
    }
  });

  document.querySelectorAll('[data-share-action]').forEach(function (button) {
    var action = button.getAttribute('data-share-action');
    if (button.tagName !== 'A' || action === 'copy' || action === 'native') return;
    button.href = buildUrl(action, getShareData(button));
  });

  document.querySelectorAll('form[name="blog-enquiry"]').forEach(function (form) {
    var draftKey = 'husni_blog_enquiry_' + window.location.pathname + '_' + Array.prototype.indexOf.call(document.querySelectorAll('form[name="blog-enquiry"]'), form);
    var draftFields = Array.prototype.slice.call(form.querySelectorAll('input[name], select[name], textarea[name]')).filter(function (field) {
      return field.type !== 'hidden' && field.name !== 'bot-field';
    });
    try {
      var savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');
      draftFields.forEach(function (field) {
        if (savedDraft[field.name] && !field.value) field.value = savedDraft[field.name];
      });
    } catch (error) {}
    function saveDraft() {
      var draft = {};
      draftFields.forEach(function (field) {
        draft[field.name] = field.value;
      });
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
    draftFields.forEach(function (field) {
      field.addEventListener('input', saveDraft);
    });

    var startedAt = form.querySelector('input[name="form-started-at"]');
    if (!startedAt) {
      startedAt = document.createElement('input');
      startedAt.type = 'hidden';
      startedAt.name = 'form-started-at';
      form.appendChild(startedAt);
    }
    startedAt.value = String(Date.now());

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      saveDraft();
      var submit = form.querySelector('button[type="submit"]');
      var originalText = submit ? submit.textContent : '';
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });
      data.page = window.location.href;

      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }

      fetch('/.netlify/functions/submission-created', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_name: data['form-name'] || 'blog-enquiry',
          data: data
        })
      }).then(function (response) {
        if (!response.ok) throw new Error('Submission failed');
        localStorage.removeItem(draftKey);
        window.location.href = '/thank-you/';
      }).catch(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Try again';
          window.setTimeout(function () {
            submit.textContent = originalText;
          }, 3000);
        }
        alert('Sorry, the request did not go through. Please WhatsApp or email Husni directly.');
      });
    });
  });
})();
