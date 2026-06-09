(function () {
  var results = document.querySelector('[data-search-results]');
  var title = document.querySelector('[data-search-title]');
  var box = document.querySelector('[data-search-box]');
  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var index = window.siteMovieIndex || [];

  if (box) {
    box.value = query;
  }

  function escapeText(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeText(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + escapeText(movie.url) + '">' +
      '<img src="' + escapeText(movie.poster) + '" alt="' + escapeText(movie.title) + '" loading="lazy">' +
      '<span class="poster-type">' + escapeText(movie.type) + '</span>' +
      '</a>' +
      '<div class="card-body">' +
      '<div class="card-meta"><span>' + escapeText(movie.region) + '</span><span>' + escapeText(movie.year) + '</span></div>' +
      '<h3><a href="' + escapeText(movie.url) + '">' + escapeText(movie.title) + '</a></h3>' +
      '<p>' + escapeText(movie.oneLine) + '</p>' +
      '<div class="card-tags">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  if (query && results) {
    var lower = query.toLowerCase();
    var matches = index.filter(function (movie) {
      return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.oneLine, movie.category, (movie.tags || []).join(' ')].join(' ').toLowerCase().indexOf(lower) !== -1;
    }).slice(0, 96);

    if (title) {
      title.textContent = '“' + query + '”的相关内容';
    }

    if (matches.length) {
      results.innerHTML = matches.map(card).join('');
    } else {
      results.innerHTML = '<div class="glass-panel side-panel"><h2>暂无匹配内容</h2><p>可以尝试更换剧名、年份、地区或题材关键词。</p></div>';
    }
  }
})();
