(function () {
    var baseElement = document.querySelector('meta[name="site-base"]');
    var siteBase = baseElement ? baseElement.getAttribute('content') : './';

    function joinBase(path) {
        if (path.indexOf('http') === 0) {
            return path;
        }
        return siteBase + path;
    }

    document.querySelectorAll('[data-mobile-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var panel = document.querySelector('[data-mobile-panel]');
            if (panel) {
                panel.classList.toggle('is-open');
            }
        });
    });

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var keyword = input ? input.value.trim() : '';
            if (keyword) {
                window.location.href = joinBase('search.html?q=' + encodeURIComponent(keyword));
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length) {
        var activeIndex = 0;
        var showSlide = function (index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });
        showSlide(0);
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var input = panel.querySelector('[data-filter-keyword]');
        var year = panel.querySelector('[data-filter-year]');
        var genre = panel.querySelector('[data-filter-genre]');
        var targetSelector = panel.getAttribute('data-filter-panel');
        var cards = Array.prototype.slice.call(document.querySelectorAll(targetSelector));
        var apply = function () {
            var keywordValue = input ? input.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var genreValue = genre ? genre.value : '';
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags')).toLowerCase();
                var cardYear = card.getAttribute('data-year');
                var cardGenre = card.getAttribute('data-genre');
                var visible = true;
                if (keywordValue && text.indexOf(keywordValue) === -1) {
                    visible = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    visible = false;
                }
                if (genreValue && cardGenre.indexOf(genreValue) === -1) {
                    visible = false;
                }
                card.style.display = visible ? '' : 'none';
            });
        };
        [input, year, genre].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    });

    var resultsRoot = document.querySelector('[data-search-results]');
    if (resultsRoot && window.MovieIndex) {
        var params = new URLSearchParams(window.location.search);
        var q = (params.get('q') || '').trim();
        var input = document.querySelector('[data-page-search]');
        if (input) {
            input.value = q;
        }
        var render = function (keyword) {
            var value = keyword.trim().toLowerCase();
            var list = window.MovieIndex.filter(function (movie) {
                if (!value) {
                    return true;
                }
                return movie.searchText.indexOf(value) !== -1;
            }).slice(0, 120);
            resultsRoot.innerHTML = list.map(function (movie) {
                return '<article class="movie-card">' +
                    '<a class="card-poster" href="detail/' + movie.id + '.html"><img src="./' + movie.cover + '.jpg" alt="' + movie.title + '"></a>' +
                    '<div class="card-body">' +
                    '<h2 class="card-title"><a href="detail/' + movie.id + '.html">' + movie.title + '</a></h2>' +
                    '<p class="card-text">' + movie.oneLine + '</p>' +
                    '<div class="card-meta"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>' + movie.genre + '</span></div>' +
                    '</div>' +
                    '</article>';
            }).join('');
            var empty = document.querySelector('[data-search-empty]');
            if (empty) {
                empty.classList.toggle('is-visible', list.length === 0);
            }
        };
        render(q);
        if (input) {
            input.addEventListener('input', function () {
                render(input.value);
            });
        }
    }
})();
