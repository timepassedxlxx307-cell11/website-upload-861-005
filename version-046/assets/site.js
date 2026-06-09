(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const dots = Array.from(hero.querySelectorAll('.hero-dots button'));
        let current = 0;

        function setSlide(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide((current + 1) % slides.length);
            }, 5200);
        }
    });

    document.querySelectorAll('[data-filter-target]').forEach(function (input) {
        const target = input.getAttribute('data-filter-target');
        const cards = Array.from(document.querySelectorAll(target + ' .movie-card'));

        input.addEventListener('input', function () {
            const value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                const haystack = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
                card.style.display = haystack.indexOf(value) >= 0 ? '' : 'none';
            });
        });
    });

    document.querySelectorAll('[data-sort-target]').forEach(function (select) {
        const target = document.querySelector(select.getAttribute('data-sort-target'));
        if (!target) {
            return;
        }

        select.addEventListener('change', function () {
            const cards = Array.from(target.querySelectorAll('.movie-card'));
            const mode = select.value;
            cards.sort(function (a, b) {
                if (mode === 'year') {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                }
                if (mode === 'rating') {
                    return Number(b.getAttribute('data-rating')) - Number(a.getAttribute('data-rating'));
                }
                return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
            });
            cards.forEach(function (card) {
                target.appendChild(card);
            });
        });
    });
}());
