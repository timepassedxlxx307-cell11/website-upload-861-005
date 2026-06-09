(function () {
    var header = document.querySelector('[data-site-header]');
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    if (header) {
        var setHeader = function () {
            if (window.scrollY > 12) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        setHeader();
        window.addEventListener('scroll', setHeader, { passive: true });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 0) {
        var current = 0;
        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });
        showSlide(0);
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterPanel = document.querySelector('[data-filter-panel]');
    if (filterPanel) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var keywordInput = filterPanel.querySelector('[data-card-search]');
        var selects = Array.prototype.slice.call(filterPanel.querySelectorAll('[data-filter]'));
        var resetButton = filterPanel.querySelector('[data-filter-reset]');
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && keywordInput) {
            keywordInput.value = query;
        }
        var filterCards = function () {
            var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
            var active = {};
            selects.forEach(function (select) {
                if (select.value) {
                    active[select.getAttribute('data-filter')] = select.value;
                }
            });
            var visible = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-type') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-tags') || ''
                ].join(' ').toLowerCase();
                var ok = !keyword || text.indexOf(keyword) !== -1;
                Object.keys(active).forEach(function (key) {
                    if ((card.getAttribute('data-' + key) || '') !== active[key]) {
                        ok = false;
                    }
                });
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        };
        if (keywordInput) {
            keywordInput.addEventListener('input', filterCards);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', filterCards);
        });
        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (keywordInput) {
                    keywordInput.value = '';
                }
                selects.forEach(function (select) {
                    select.value = '';
                });
                filterCards();
            });
        }
        filterCards();
    }

    var backTop = document.createElement('button');
    backTop.className = 'back-top';
    backTop.type = 'button';
    backTop.setAttribute('aria-label', '返回顶部');
    backTop.textContent = '↑';
    document.body.appendChild(backTop);
    backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    var toggleBackTop = function () {
        backTop.classList.toggle('is-visible', window.scrollY > 520);
    };
    toggleBackTop();
    window.addEventListener('scroll', toggleBackTop, { passive: true });
})();
