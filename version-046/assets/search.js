(function () {
    const form = document.querySelector('[data-search-form]');
    const input = document.querySelector('[data-search-input]');
    const grid = document.querySelector('[data-search-results]');
    const title = document.querySelector('[data-search-title]');
    const data = window.movieSearchData || [];

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[char];
        });
    }

    function card(item) {
        const tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return '<span>#' + escapeHtml(tag) + '</span>';
        }).join('');

        return '<article class="movie-card">' +
            '<a class="movie-card-link" href="' + escapeHtml(item.url) + '">' +
                '<div class="movie-poster">' +
                    '<img src="' + escapeHtml(item.poster) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                    '<span class="poster-region">' + escapeHtml(item.region) + '</span>' +
                    '<span class="poster-type">' + escapeHtml(item.type) + '</span>' +
                    '<span class="poster-play">▶</span>' +
                '</div>' +
                '<div class="movie-card-body">' +
                    '<h3>' + escapeHtml(item.title) + '</h3>' +
                    '<p>' + escapeHtml(item.oneLine) + '</p>' +
                    '<div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.rating) + ' 分</span><span>' + escapeHtml(item.genre) + '</span></div>' +
                    '<div class="movie-tags">' + tags + '</div>' +
                '</div>' +
            '</a>' +
        '</article>';
    }

    function readQuery() {
        return new URLSearchParams(window.location.search).get('q') || '';
    }

    function render(query) {
        if (!grid) {
            return;
        }

        const value = query.trim().toLowerCase();
        const result = value ? data.filter(function (item) {
            const haystack = [item.title, item.region, item.type, item.year, item.genre, item.oneLine, (item.tags || []).join(' ')].join(' ').toLowerCase();
            return haystack.indexOf(value) >= 0;
        }) : data.slice(0, 36);

        if (input) {
            input.value = query;
        }

        if (title) {
            title.textContent = value ? '搜索结果：' + query : '热门搜索推荐';
        }

        grid.innerHTML = result.length ? result.map(card).join('') : '<div class="empty-state">未找到相关影片</div>';
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const query = input ? input.value.trim() : '';
            const url = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
            window.history.replaceState(null, '', url);
            render(query);
        });
    }

    render(readQuery());
}());
