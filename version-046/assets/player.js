(function () {
    const dataElement = document.getElementById('playback-json');
    const shell = document.querySelector('[data-player]');

    if (!dataElement || !shell) {
        return;
    }

    const video = shell.querySelector('video');
    const cover = shell.querySelector('.player-cover');
    const button = shell.querySelector('.player-start');
    let started = false;
    let hls = null;

    function getUrl() {
        try {
            const payload = JSON.parse(dataElement.textContent || '{}');
            return payload.url || '';
        } catch (error) {
            return '';
        }
    }

    function attach(url) {
        if (started || !video || !url) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else {
            video.src = url;
        }

        started = true;
    }

    function play() {
        const url = getUrl();
        attach(url);

        if (cover) {
            cover.setAttribute('hidden', '');
        }

        if (video) {
            video.controls = true;
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }
    }

    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            play();
        });
    }

    if (cover) {
        cover.addEventListener('click', play);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!started) {
                play();
            }
        });
    }

    window.addEventListener('pagehide', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
}());
