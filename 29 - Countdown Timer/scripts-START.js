// store the interval in its own variable
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

// select the buttons
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);

    // figure out when the timer started
    const now = Date.now();
    // the endpoint
    // multiply seconds by 1000 because now is gonna be in ms
    const then = now + seconds * 1000;
    // run the display function immediately once the function is invoked
    displayTimeLeft(seconds);
    displayEndTime(then);

    // every single second, we need to display the amount of time left
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        
        // check if we should stop it (because the setInterval function itself doesn't know when to stop)
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        
        // run the display function again every single time that we do the interval
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();

    endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// if html elements have a name, you can select them with document.name
// this also works for nested elements, just like this:
// document.name.nameNestedOne
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
});