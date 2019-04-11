(function () {
    // Put variables in global scope to make them available to the browser console.
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const tardigrade = document.getElementById('tardigrade')

    var showTardigrade = true
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


        //capture image before tardigrade draw
        var x = 100, y = 100, h = 50, w = 50;
        var subImg = ctx.getImageData(x, y, w, h);
        var data = subImg.data;
        var total = 0;
        const darknessThreshold = 120;
        for (dx = 0; dx < w; dx++) {
            for (dy = 0; dy < h; dy++) {
                var i = ((dy * w) + dx) * 4;
                total += data[i] + data[i + 1] + data[i + 2];
            }
        }
        if ((total / x / y) > darknessThreshold) {
            showTardigrade = false;
            //alert(total / x / y);
        }

        // draw tardigrade
        if (showTardigrade) {
            ctx.drawImage(tardigrade, x, y, w, h);
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