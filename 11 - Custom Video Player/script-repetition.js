/* Get the elements */

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const btnFullScreen = player.querySelector('.toggle-fullscreen');

/* Build the functions */

function togglePlay() {
    // paused is a video property, there is no play property
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton () {
    // this is the video itself
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    // update the videos' property (this.name is volume or playbackRate)
    // and set it equal to this.value
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

/* Hook up the event listeners */

toggle.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay);
// listen for the video to play or pause and update the button
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
// listen for the video to emit the timeupdate event and handle the progress bar
video.addEventListener('timeupdate', handleProgress);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(slider => slider.addEventListener('change', handleRangeUpdate));

let mousedownProgress = false;
progress.addEventListener('click', scrub);
// run scrub on mousemove only if mousedownProgress is true
progress.addEventListener('mousemove', (e) => mousedownProgress && scrub(e));
// update the mousedownProgress variable
progress.addEventListener('mousedown', () => mousedownProgress = true);
progress.addEventListener('mouseup', () => mousedownProgress = false);
