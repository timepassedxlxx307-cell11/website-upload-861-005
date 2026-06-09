(function () {
  function startPlayer(frame) {
    var video = frame.querySelector('video');
    var stream = frame.getAttribute('data-stream');
    if (!video || !stream) {
      return;
    }

    if (!video.getAttribute('data-ready')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        frame._hls = hls;
      } else {
        video.src = stream;
      }
      video.setAttribute('data-ready', '1');
    }

    frame.classList.add('is-playing');
    video.controls = true;
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (frame) {
    var button = frame.querySelector('[data-play]');
    frame.addEventListener('click', function (event) {
      if (event.target && event.target.closest('video') && frame.classList.contains('is-playing')) {
        return;
      }
      startPlayer(frame);
    });
    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        startPlayer(frame);
      });
    }
  });
})();
