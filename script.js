(function () {
    const darknessThreshold = 584;
    const spaceKeyCode = 32;
    let started = false;
    let score = 0;

    class tardigrade {
        constructor(ch, cw, h, w) {
            this.cHeight = ch;
            this.cWidth = cw;
            this.h = h;
            this.w = w;
            this.spawn()
        }
        spawn() {
            var perimeter = Math.floor(Math.random() * ((2.0 * this.cHeight) + this.cWidth))
            if (perimeter <= this.cHeight) {
                this.move(0, perimeter)
            } else if (perimeter <= 2 * this.cHeight) {
                this.move(this.cWidth - this.w, perimeter - this.cHeight)
            } else {
                this.move(perimeter - this.cHeight - this.cHeight - this.w, 0)
            }
        }
        move(x, y) {
            this.x = x;
            this.y = y;
        }
        isOnLight(camCtx) {
            var subImg = camCtx.getImageData(this.x, this.y, this.w, this.h);
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
        draw(bugCtx) {
            bugCtx.drawImage(tgImage, this.x, this.y, this.w, this.h);
        }
    }

    // Put variables in global scope to make them available to the browser console.
    const video = document.querySelector('video');
    const cam = document.getElementById('webcam');
    const camCtx = cam.getContext('2d');
    const bugs = document.getElementById('bugs');
    const bugCtx = bugs.getContext('2d');
    const scoreEl = document.getElementById('score');
    const scoreCtx = scoreEl.getContext('2d');

    const tgImage = document.getElementById('tardigrade')
    var bgChromaKey = null


    //enenmies
    var tardigrades = [
        new tardigrade(cam.height, cam.width, 50, 50)
    ];

    //add more tardigrades over time
    setInterval(function () {
        if (tardigrades.length < 20 && started) {
            tardigrades.push(new tardigrade(cam.height, cam.width, 50, 50));
        }
    }, 7500);

    //crazy colors
    setInterval(function () {
        invertR = Math.round(Math.random()) == 1
        invertG = Math.round(Math.random()) == 1
        invertB = Math.round(Math.random()) == 1
    }, 1500);

    var invertR, invertG, invertB = false

    function invertColors(data) {
        for (var i = 0; i < data.length; i += 4) {
            data[i] = invertR ? data[i] : data[i] ^ 255; // Invert Red
            data[i + 1] = invertG ? data[i + 1] : data[i + 1] ^ 255; // Invert Green
            data[i + 2] = invertB ? data[i + 2] : data[i + 2] ^ 255; // Invert Blue
        }
    }

    //the main draw loop
    setInterval(function () {
        // draw video frame on cam
        camCtx.clearRect(0, 0, cam.width, cam.height);
        bugCtx.clearRect(0, 0, cam.width, cam.height);
        scoreCtx.clearRect(0, 0, cam.width, cam.height);
        camCtx.drawImage(video, 0, 0, cam.width, cam.height);

        var vidFrame = camCtx.getImageData(0, 0, cam.width, cam.height);


        //don't draw game until its started
        if (!started) {
            return;
        }
        // draw player box on cam
        bugCtx.beginPath();
        bugCtx.moveTo(cam.width / 2 - 100, cam.height);
        bugCtx.lineTo(cam.width / 2 - 100, cam.height - 200);
        bugCtx.lineTo(cam.width / 2 + 100, cam.height - 200);
        bugCtx.lineTo(cam.width / 2 + 100, cam.height);
        bugCtx.stroke();

        // draw score
        scoreCtx.font = "30px Arial";
        scoreCtx.fillStyle = "white";
        scoreCtx.textAlign = "center";
        scoreCtx.fillText("Score " + score, scoreEl.width / 2, scoreEl.height - 10);

        // kill tardigrades
        for (i = 0; i < tardigrades.length; i++) {
            var t = tardigrades[i];
            if (!t.isOnLight(camCtx)) {
                t.spawn();
                score++;
            }
        }


        // var bugFrame = bugCtx.getImageData(0, 0, cam.width, cam.height)
        // var bugData = bugFrame.data
        // //tracers
        // for (var i = 3; i < bugData.length; i += 4) {
        //     bugData[i] = bugData[i] / 2
        // }
        // bugCtx.putImageData(bugFrame, 0, 0);



        //crazy colors
        invertColors(vidFrame.data);
        camCtx.putImageData(vidFrame, 0, 0);
        // draw tardigrades
        for (i = 0; i < tardigrades.length; i++) {
            var t = tardigrades[i];
            t.draw(bugCtx);

            targetX = (cam.width - t.w) / 2
            targetY = (cam.height - 100 - (t.h / 2))

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
        cam.width = video.videoWidth;
        cam.height = video.videoHeight;
        bugs.width = video.videoWidth;
        bugs.height = video.videoHeight;
        scoreEl.width = video.videoWidth;
        scoreEl.height = video.videoHeight;
        bgChromaKey = camCtx.getImageData(0, 0, cam.width, cam.height)
    }, false);

    // support fullscreen
    window.onkeypress = function (e) {
        if (e.which === spaceKeyCode) {
            started = true;
            score = 0;
        }
        flipContainer = document.getElementById("screen");
        if (!document.fullscreenElement) {
            flipContainer.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

})();