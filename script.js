(function () {
    const darknessThreshold = 384;

    class tardigrade {
        constructor(x, y, h, w) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
        }
        move(x, y) {
            this.x = x;
            this.y = y;
        }
        isOnLight(ctx) {
            var subImg = ctx.getImageData(this.x, this.y, this.w, this.h);
            var data = subImg.data;
            var total = 0, ix = 0, iy = 0;

            for (ix = 0; ix < this.w; ix++) {
                for (iy = 0; iy < this.h; iy++) {
                    var i = ((iy * this.w) + ix) * 4;
                    total += data[i] + data[i + 1] + data[i + 2];
                }
            }
            return (total / this.h / this.w) > darknessThreshold;
        }
        draw(ctx) {
            ctx.drawImage(tgImage, this.x, this.y, this.w, this.h);
        }
    }

    // Put variables in global scope to make them available to the browser console.
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const tgImage = document.getElementById('tardigrade')


    //enenmies
    var tardigrades = [
        new tardigrade(0, 0, 50, 50),
    ];


    function getRand(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    //the main draw loop
    setInterval(function () {
        // draw video frame on canvas

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // draw player box on canvas
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 100, canvas.height);
        ctx.lineTo(canvas.width / 2 - 100, canvas.height - 200);
        ctx.lineTo(canvas.width / 2 + 100, canvas.height - 200);
        ctx.lineTo(canvas.width / 2 + 100, canvas.height);
        ctx.stroke();

        targetX = canvas.width / 2 - 100
        targetY = canvas.height - 100

        // draw tardigrades
        for (i = 0; i < tardigrades.length; i++) {
            var t = tardigrades[i];
            if (!t.isOnLight(ctx)) {
                var perimeter = Math.floor(Math.random() * ((2.0 * canvas.height) + canvas.width))
                if (perimeter <= canvas.height) {
                    t.move(0, perimeter)
                } else if (perimeter <= 2 * canvas.height) {
                    t.move(canvas.width - t.w, perimeter - canvas.height)
                } else {
                    t.move(perimeter - canvas.height - canvas.height - t.w, 0)
                }
            }
            t.draw(ctx);

            dist = Math.pow(Math.pow(t.x - targetX, 2) + Math.pow(t.y - targetY, 2), .5)
            t.move(t.x - ((t.x - targetX) / dist), t.y - ((t.y - targetY) / dist));
        }
    }, 33);



    //handle video
    function handleSuccess(stream) {
        window.stream = stream; // make stream available to browser console
        video.srcObject = stream;

    }
    function handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(handleSuccess).catch(handleError);

    video.addEventListener("loadedmetadata", function (e) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }, false);

    // support fullscreen
    window.onkeypress = function () {
        flipContainer = document.getElementById("flip_container")
        if (!document.fullscreenElement) {
            flipContainer.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
})();