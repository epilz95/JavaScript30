const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    // this is going to return a promise
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        // in case someone doesn't allow you to access the webcam
        .catch(err => {
            console.error(`OH NO!!!`, err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    // take a frame from the video element and paint it to the canvas every 16ms
    return setInterval(() => {
        // start at (0/0) and paint the width and the height
        ctx.drawImage(video, 0, 0, width, height);

        // take the pixels out
        let pixels= ctx.getImageData(0, 0, width, height);
        // mess with them

        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;  // ghost effect: write the one that we have, but the ones that are underneath it are still going to show through for 10 more frames

        pixels = greenScreen(pixels);

        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    // handsome is what the file name will be on download
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome man">`;
    strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels[i + 0] = pixels.data[i + 0] + 100;   // red
        pixels[i + 1] = pixels.data[i + 1] - 50;    // green
        pixels[i + 2] = pixels.data[i + 2] * 0.5;   // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0];  // red
        pixels.data[i + 100] = pixels.data[i + 1];  // green
        pixels.data[i - 150] = pixels.data[i + 2];  // blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

getVideo();

// once the video is played, it's going to emit an event called 'canplay', which is going to cause the paintToCanvas function to run
video.addEventListener('canplay', paintToCanvas);