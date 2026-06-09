(function () {
    function bindPlayer(root) {
        var video = root.querySelector('video');
        var button = root.querySelector('[data-play-button]');
        var overlay = root.querySelector('[data-player-cover]');
        if (!video || !button) {
            return;
        }
        var address = video.getAttribute('data-video');
        var started = false;
        var hls = null;
        var start = function () {
            if (!address) {
                return;
            }
            if (!started) {
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = address;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(address);
                    hls.attachMedia(video);
                } else {
                    video.src = address;
                }
            }
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var action = video.play();
            if (action && action.catch) {
                action.catch(function () {});
            }
        };
        button.addEventListener('click', start);
        if (overlay) {
            overlay.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (!started) {
                start();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(bindPlayer);
})();
