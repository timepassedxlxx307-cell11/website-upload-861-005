(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    setInterval(function () {
      setSlide(active + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var filterSelects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function collectValues(name) {
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute('data-' + name);
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    return values.sort(function (a, b) {
      return String(b).localeCompare(String(a), 'zh-Hans-CN');
    });
  }

  filterSelects.forEach(function (select) {
    var field = select.getAttribute('data-filter-select');
    collectValues(field).forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });

  function queryFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    } catch (error) {
      return '';
    }
  }

  if (searchInput && queryFromUrl()) {
    searchInput.value = queryFromUrl();
  }

  function applyFilters() {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var filters = {};

    filterSelects.forEach(function (select) {
      filters[select.getAttribute('data-filter-select')] = select.value;
    });

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();

      var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchedFilters = Object.keys(filters).every(function (key) {
        return !filters[key] || card.getAttribute('data-' + key) === filters[key];
      });

      card.classList.toggle('is-hidden', !(matchedKeyword && matchedFilters));
    });
  }

  if (searchInput || filterSelects.length) {
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    filterSelects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
    applyFilters();
  }
})();