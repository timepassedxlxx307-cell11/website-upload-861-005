(function () {
    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        var existing = document.querySelector("script[data-hls-loader]");
        if (existing) {
            existing.addEventListener("load", callback, { once: true });
            return;
        }
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
        script.setAttribute("data-hls-loader", "true");
        script.addEventListener("load", callback, { once: true });
        document.head.appendChild(script);
    }

    window.initMoviePlayer = function (videoId, buttonId, coverId, source) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var button = document.getElementById(buttonId);
        var hlsInstance = null;
        var attached = false;

        if (!video || !cover || !button || !source) {
            return;
        }

        function playVideo() {
            cover.classList.add("is-hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        function attachAndPlay() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (video.getAttribute("src") !== source) {
                    video.setAttribute("src", source);
                }
                playVideo();
                return;
            }

            loadHls(function () {
                if (window.Hls && window.Hls.isSupported()) {
                    if (!attached) {
                        hlsInstance = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true,
                            backBufferLength: 90
                        });
                        hlsInstance.loadSource(source);
                        hlsInstance.attachMedia(video);
                        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            playVideo();
                        });
                        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                            if (data && data.fatal && hlsInstance) {
                                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                    hlsInstance.startLoad();
                                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                    hlsInstance.recoverMediaError();
                                } else {
                                    hlsInstance.destroy();
                                    hlsInstance = null;
                                    attached = false;
                                }
                            }
                        });
                        attached = true;
                    } else {
                        playVideo();
                    }
                } else {
                    video.setAttribute("src", source);
                    playVideo();
                }
            });
        }

        cover.addEventListener("click", attachAndPlay);
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            attachAndPlay();
        });
        video.addEventListener("click", function () {
            if (video.paused) {
                attachAndPlay();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", function () {
            cover.classList.add("is-hidden");
        });
    };
})();
