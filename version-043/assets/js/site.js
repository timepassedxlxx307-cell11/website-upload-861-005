(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function setupHero(root) {
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function activate(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                activate(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                activate(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                activate(index + 1);
                restart();
            });
        }

        restart();
    }

    function setupFilters(form) {
        var scope = form.closest("main") || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
        var input = form.querySelector("[data-filter-input]");
        var type = form.querySelector("[data-filter-type]");
        var year = form.querySelector("[data-filter-year]");
        var region = form.querySelector("[data-filter-region]");
        var empty = scope.querySelector("[data-empty-state]");
        if (!cards.length) {
            return;
        }

        function contains(source, target) {
            return !target || source.indexOf(target) !== -1;
        }

        function matchYear(cardYear, selected) {
            if (!selected) {
                return true;
            }
            if (selected === "older") {
                var value = Number(cardYear);
                return value > 0 && value < 2020;
            }
            return cardYear === selected;
        }

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            var selectedType = type ? type.value : "";
            var selectedYear = year ? year.value : "";
            var selectedRegion = region ? region.value : "";
            var visible = 0;
            cards.forEach(function (card) {
                var searchText = (card.getAttribute("data-search") || "").toLowerCase();
                var cardType = card.getAttribute("data-type") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var cardRegion = card.getAttribute("data-region") || "";
                var matched = contains(searchText, keyword) &&
                    contains(cardType, selectedType) &&
                    matchYear(cardYear, selectedYear) &&
                    contains(cardRegion, selectedRegion);
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, type, year, region].forEach(function (field) {
            if (field) {
                field.addEventListener("input", apply);
                field.addEventListener("change", apply);
            }
        });
    }

    ready(function () {
        setupMenu();
        document.querySelectorAll("[data-hero]").forEach(setupHero);
        document.querySelectorAll("[data-filter-form]").forEach(setupFilters);
    });
})();
