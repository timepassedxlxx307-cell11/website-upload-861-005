(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function initMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      button.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var activeFilter = '';

    if (!searchInput && buttons.length === 0) {
      return;
    }

    function apply() {
      var query = normalize(searchInput ? searchInput.value : '');
      var filter = normalize(activeFilter);

      cards.forEach(function (card) {
        var content = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        var matchesQuery = !query || content.indexOf(query) !== -1;
        var matchesFilter = !filter || content.indexOf(filter) !== -1;
        card.hidden = !(matchesQuery && matchesFilter);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);

      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query) {
        searchInput.value = query;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = button.getAttribute('data-filter-value') || '';
        apply();
      });
    });

    apply();
  }

  function attachHls(video, source) {
    if (video.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    video.dataset.loaded = 'true';

    if (window.Hls && window.Hls.isSupported()) {
      return new Promise(function (resolve) {
        var hls = new window.Hls({
          enableWorker: true,
          maxBufferLength: 30
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
        hls.on(window.Hls.Events.ERROR, function () {
          resolve();
        });
        video._hls = hls;
      });
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    video.src = source;
    return Promise.resolve();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('video[data-video-src]');
      var button = player.querySelector('[data-player-button]');

      if (!video || !button) {
        return;
      }

      function play() {
        var source = video.getAttribute('data-video-src');
        if (!source) {
          return;
        }

        button.classList.add('is-hidden');
        attachHls(video, source).then(function () {
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
              button.classList.remove('is-hidden');
            });
          }
        });
      }

      button.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
