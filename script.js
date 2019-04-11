(function () {

    class tardigrade {
        constructor(x, y, h, w) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
            this.move = function (dx, dy) {
                this.x += dx;
                this.y += dy;
            };
            this.isOnLight = function (ctx) {
                var subImg = ctx.getImageData(this.x, this.y, this.w, this.h);
                var data = subImg.data;
                var total = 0, ix = 0, iy = 0;
                const darknessThreshold = 120;
                for (ix = 0; ix < this.w; ix++) {
                    for (iy = 0; iy < this.h; iy++) {
                        var i = ((iy * this.w) + ix) * 4;
                        total += data[i] + data[i + 1] + data[i + 2];
                    }
                }
                return (total / this.h / this.w) > darknessThreshold;
            };
            // draw tardigrade
            this.draw = function (ctx) {
                ctx.drawImage(tgImage, this.x, this.y, this.w, this.h);
            };
        }
    }

    // Put variables in global scope to make them available to the browser console.
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const tgImage = document.getElementById('tardigrade')


    var tardigrades = [
        new tardigrade(0, 0, 50, 50),
    ];


    setInterval(function () {
        // draw video frame on canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // draw player box on canvas
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 100, canvas.height);
        ctx.lineTo(canvas.width / 2 - 100, canvas.height - 200);
        ctx.lineTo(canvas.width / 2 + 100, canvas.height - 200);
        ctx.lineTo(canvas.width / 2 + 100, canvas.height);
        ctx.stroke();

        // draw tardigrades
        for (i = 0; i < tardigrades.length; i++) {
            if (tardigrades[i].isOnLight(ctx)) {
                tardigrades[i].draw(ctx);
            }
            tardigrades[i].move(1, 1);
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

    // support fullscreen
    window.onkeypress = function () {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
})();