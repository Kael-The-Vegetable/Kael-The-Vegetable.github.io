import { Projects } from './projects.js';

// wait for DOM to load fully
document.addEventListener(`DOMContentLoaded`, function() {
    const startButton = document.getElementById(`start`);
    if (startButton) {
        startButton.addEventListener(`click`, initializeGame);
    } else {
        console.error("couldn't find the game start button!");
    }
});

let gameObj;

// called when start-game button is pressed.
function initializeGame(ev) {
    gameObj?.stop();
    gameObj = new Game();
    console.log(ev.originalTarget);
    gameObj.start();
}

// class to encapsulate the game running
class Game {
    frameID;
    #prevTimeStamp; // useful to get delta

    #linesUpdateCurrent = 0; // current ms until update
    #linesUpdateMS = 500; // amount of ms until lines update again
    #linesPerMs = 80 / 1000; // lines / second / 1000
    #lineRange = [900, 1500]; // min and max lines per project

    constructor() {
        this.juiceButton = document.getElementById(`juicer`);
        this.linesElement = document.getElementById(`lines`);
        this.projectElement = document.getElementById(`title`);

        this.lines = 0;
        this.linesToCompletion = 0;
        this.projectName = "";
    }

    start() {
        const update = (timestamp) => {
            if (!this.#prevTimeStamp) { // if there is no existing previous timestamp
                this.#prevTimeStamp = timestamp; // set it here
            }

            // increase lines by value
            const delta = timestamp - this.#prevTimeStamp;
            this.lines += delta * this.#linesPerMs;

            if (this.lines >= this.linesToCompletion) {
                this.lines = this.linesToCompletion;
                this.newProject();
                this.lines = 0;
            }

            this.#linesUpdateCurrent += delta;
            if (this.#linesUpdateCurrent >= this.#linesUpdateMS) {
                this.updateUI();
            }

            this.#prevTimeStamp = timestamp;
            this.frameID = requestAnimationFrame(update);
        }; // delegate to occur each frame
        
        this.newProject(); // Start a new Project.

        this.frameID = requestAnimationFrame(update);
    }

    stop() {
        if (this.frameID) { cancelAnimationFrame(this.frameID); }
    }

    updateUI() {
        this.#linesUpdateCurrent = 0;
        if (this.linesElement) {
            this.linesElement.innerText = Math.floor(this.lines);
        }
    }

    // method called when the current project has been completed and a new one needs to be selected.
    newProject() {
        if (this.lines != 0) {
            console.log("Completed [" + this.projectName + "] in " + this.lines + " lines!");
        }

        this.projectName = Projects.newProject(false);
        this.linesToCompletion = Math.round(Math.random() * (this.#lineRange[1] - this.#lineRange[0]) + this.#lineRange[0]);
        if (this.projectElement) {
            this.projectElement.innerText = this.projectName;
        }
        this.updateUI();
    }
}