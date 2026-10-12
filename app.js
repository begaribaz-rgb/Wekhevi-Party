(function () {
  var C = window.SITE;
  var LANGS = ['ku', 'ar', 'en'];

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var lang = new URLSearchParams(location.search).get('lang') || safeGet('lang') || 'ku';
  if (LANGS.indexOf(lang) === -1) lang = 'ku';

  function t(o) { return (o && (o[lang] || o.ku)) || ''; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  var SILHOUETTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z"/></svg>';

  function avatar(person) {
    if (person.photo) return '<div class="avatar"><img src="' + esc(person.photo) + '" alt="" style="width:100%;height:100%;object-fit:cover"></div>';
    return '<div class="avatar">' + SILHOUETTE + '</div>';
  }

  function itemCard(it) {
    return '<article class="card">' +
      '<span class="date">' + esc(it.date) + '</span>' +
      '<h3>' + esc(t(it.title)) + '</h3>' +
      '<p>' + esc(t(it.text)) + '</p>' +
      '<a class="btn-link" href="' + esc(it.link || '#') + '">' + esc(t(C.ui.read_more)) + '</a>' +
      '</article>';
  }

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.title = t(C.name);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(C.ui[el.getAttribute('data-i18n')]);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(C.ui[el.getAttribute('data-i18n-ph')]));
    });
    $('party-name').textContent = t(C.name);
    $('footer-name').textContent = t(C.name);
    $('year').textContent = new Date().getFullYear();

    $('news-list').innerHTML = C.news.map(itemCard).join('');
    $('stmt-list').innerHTML = C.statements.map(itemCard).join('');

    $('about-text').innerHTML = C.about.map(function (p) { return '<p>' + esc(t(p)) + '</p>'; }).join('');

    $('secretary').innerHTML = '<div class="card leader top">' + avatar(C.secretary) +
      '<h3>' + esc(t(C.secretary.name)) + '</h3><div class="role">' + esc(t(C.ui.secretary)) + '</div></div>';
    $('politburo').innerHTML = C.politburo.map(function (m) {
      return '<div class="card leader">' + avatar(m) +
        '<h3>' + esc(t(m.name)) + '</h3><div class="role">' + esc(t(C.ui.member)) + '</div></div>';
    }).join('');

    $('paper-title').textContent = t(C.paper.title);
    $('paper-list').innerHTML = C.paper.issues.map(function (i) {
      return '<article class="card issue"><span class="no">' + esc(t(C.ui.issue)) + ' ' + esc(i.no) + '</span>' +
        '<span class="date">' + esc(i.date) + '</span>' +
        '<a class="btn-link" href="' + esc(i.file) + '" style="width:max-content">' + esc(t(C.ui.download)) + '</a></article>';
    }).join('');

    $('c-email').textContent = C.contact.email;
    $('c-email').href = 'mailto:' + C.contact.email;
    $('c-phone').textContent = C.contact.phone;
    $('c-address').textContent = t(C.contact.address);

    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.getAttribute('data-lang');
      safeSet('lang', lang);
      render();
    });
  });

  $('burger').addEventListener('click', function () { $('nav').classList.toggle('open'); });
  $('nav').addEventListener('click', function () { $('nav').classList.remove('open'); });

  // نموذج التواصل: يفتح برنامج البريد (لا يحتاج سيرفر)
  $('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('f-name').value, m = $('f-email').value, msg = $('f-msg').value;
    var body = msg + '\n\n' + n + ' <' + m + '>';
    location.href = 'mailto:' + C.contact.email + '?subject=' + encodeURIComponent(t(C.name)) +
      '&body=' + encodeURIComponent(body);
  });

  render();
})();
