(function () {
  function startPlayer(area) {
    var video = area.querySelector('video[data-video]');
    var button = area.querySelector('[data-play-button]');
    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-video');
    if (!stream) {
      return;
    }

    if (button) {
      button.classList.add('hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== stream) {
        video.src = stream;
      }
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsInstance) {
        video.hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        video.hlsInstance.loadSource(stream);
        video.hlsInstance.attachMedia(video);
        video.hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.play().catch(function () {});
      }
      return;
    }

    if (video.src !== stream) {
      video.src = stream;
    }
    video.play().catch(function () {});
  }

  document.querySelectorAll('[data-video-area]').forEach(function (area) {
    var button = area.querySelector('[data-play-button]');
    var video = area.querySelector('video[data-video]');

    if (button) {
      button.addEventListener('click', function () {
        startPlayer(area);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        startPlayer(area);
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('hidden');
        }
      });
    }
  });
})();