// 언어 선택: ?lang= → 저장된 값 → 브라우저 언어 → en.
// ⚠️ 여섯 언어 블록은 전부 HTML에 있고 CSS로 하나만 보인다. JS가 없으면 영어판이 보인다.
(function () {
  var LANGS = ['ko', 'en', 'ja', 'zh', 'es', 'pt'];
  var HTML_LANG = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-Hans', es: 'es', pt: 'pt-BR' };
  var KEY = 'beecon.lang';
  var root = document.documentElement;
  var titles = {};
  try { titles = JSON.parse(root.getAttribute('data-titles') || '{}'); } catch (e) {}

  function pick() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var wanted = [new URLSearchParams(location.search).get('lang'), saved]
      .concat(navigator.languages || [navigator.language]);
    for (var i = 0; i < wanted.length; i++) {
      var base = (wanted[i] || '').toLowerCase().split('-')[0];
      if (LANGS.indexOf(base) >= 0) return base;
    }
    return 'en';
  }

  function apply(lang, remember) {
    root.lang = HTML_LANG[lang];
    root.setAttribute('data-lang', lang);
    if (titles[lang]) document.title = titles[lang];
    // 사이트 안 링크(홈·지원·개인정보)가 고른 언어를 이어받게 한다.
    document.querySelectorAll('a[data-page]').forEach(function (a) {
      a.href = a.getAttribute('data-page') + '?lang=' + lang;
    });
    if (remember) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  }

  apply(pick(), false);

  document.querySelectorAll('.lang .menu a[data-set]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var lang = a.getAttribute('data-set');
      apply(lang, true);
      history.replaceState(null, '', '?lang=' + lang + location.hash);
      var d = a.closest('details');
      if (d) d.open = false;
    });
  });

  // 메뉴 바깥을 누르면 닫는다.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.lang[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.open = false;
    });
  });
})();
