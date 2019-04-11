(function() {
    // Put variables in global scope to make them available to the browser console.
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const color = document.getElementById('color');
    const tardigrade = document.getElementById('tardigrade')

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
        for (dx = 0; dx < x; dx++) {
            for (dy = 0; dy < y; dy++) {
                var i = ((dx * w) + dy) * 4;
                total += data[i] + data[i + 1] + data[i + 2];
            }
        }


        // draw tardigrade
        ctx.drawImage(tardigrade, 100, 100, 50, 50);
    }, 33);

    function pick(event) {
        var x = event.layerX;
        var y = event.layerY;
        var pixel = ctx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        var rgba = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    }
    canvas.addEventListener('click', pick);

    function handleSuccess(stream) {
        window.stream = stream; // make stream available to browser console
        video.srcObject = stream;
    }
    function handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(handleSuccess).catch(handleError);


    window.onresize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        canvas.style.height = w + "px";
        canvas.style.height = h + "px";
    };
    window.onload = function () {
        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
        canvas.mozRequestFullScreen(); //Firefox

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
        //now i want to cancel fullscreen
        // document.webkitCancelFullScreen(); //Chrome
        // document.mozCancelFullScreen(); //Firefox 
    }
})();