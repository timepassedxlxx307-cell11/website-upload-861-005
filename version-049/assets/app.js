(function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      const isOpen = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const slider = document.querySelector('.hero-slider');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dot'));
    const prev = slider.querySelector('.hero-prev');
    const next = slider.querySelector('.hero-next');
    let index = 0;
    let timer = null;

    const showSlide = function (nextIndex) {
      if (slides.length === 0) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    };

    const start = function () {
      stop();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    };

    const stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const target = Number(dot.getAttribute('data-target-slide'));
        showSlide(target);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    start();
  }

  const filterInput = document.querySelector('.page-filter-input');
  const filterType = document.querySelector('.page-filter-type');
  const filterTarget = document.querySelector('.filter-target');

  if (filterTarget && (filterInput || filterType)) {
    const cards = Array.from(filterTarget.querySelectorAll('.movie-card'));

    const applyFilter = function () {
      const query = filterInput ? filterInput.value.trim().toLowerCase() : '';
      const type = filterType ? filterType.value : '';

      cards.forEach(function (card) {
        const text = (card.getAttribute('data-filter-text') || '').toLowerCase();
        const cardType = card.getAttribute('data-type') || '';
        const textMatched = query === '' || text.indexOf(query) !== -1;
        const typeMatched = type === '' || cardType.indexOf(type) !== -1;
        card.classList.toggle('is-filter-hidden', !(textMatched && typeMatched));
      });
    };

    if (filterInput) {
      filterInput.addEventListener('input', applyFilter);
    }

    if (filterType) {
      filterType.addEventListener('change', applyFilter);
    }
  }

  const searchResults = document.getElementById('search-results');

  if (searchResults && Array.isArray(window.SITE_MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const searchInput = document.getElementById('search-page-input');

    if (searchInput) {
      searchInput.value = query;
    }

    const normalized = query.toLowerCase();
    const source = window.SITE_MOVIES;
    const results = normalized === ''
      ? source.slice(0, 60)
      : source.filter(function (movie) {
          return movie.searchText.toLowerCase().indexOf(normalized) !== -1;
        }).slice(0, 120);

    const renderCard = function (movie) {
      return [
        '<a class="movie-card" href="./' + movie.file + '">',
        '  <span class="card-cover">',
        '    <img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy">',
        '    <span class="card-badge">' + movie.type + '</span>',
        '    <span class="card-year">' + movie.year + '</span>',
        '    <span class="card-mask">',
        '      <span class="play-circle">▶</span>',
        '      <span>' + movie.oneLine + '</span>',
        '    </span>',
        '  </span>',
        '  <span class="card-title">' + movie.title + '</span>',
        '  <span class="card-meta">' + movie.region + ' · ' + movie.year + ' · ' + movie.type + '</span>',
        '  <span class="card-tags">' + movie.genre + '</span>',
        '</a>'
      ].join('');
    };

    searchResults.innerHTML = results.map(renderCard).join('');
  }

  const playerShell = document.querySelector('.player-shell[data-video-url]');

  if (playerShell) {
    const video = playerShell.querySelector('video');
    const startButton = playerShell.querySelector('.player-start');
    let hlsInstance = null;
    let attached = false;

    const attachVideo = function () {
      if (!video || attached) {
        return;
      }

      const url = playerShell.getAttribute('data-video-url');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }

      attached = true;
    };

    const playVideo = function () {
      attachVideo();
      if (startButton) {
        startButton.classList.add('is-hidden');
      }
      if (video) {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }
    };

    if (startButton) {
      startButton.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!attached || video.paused) {
          playVideo();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }
})();
