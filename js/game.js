import { Projects } from './projects.js';
import { Animation } from './animation.js';

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
    gameObj.start();
    ev.originalTarget.style.display = 'none';
}

// class to encapsulate the game running
class Game {
    
    frameID;
    #prevTimeStamp; // useful to get delta

    #lineAnim = new Animation(250, // line update speed
        () => { if (this.linesElement) this.linesElement.innerText = Math.floor(this.lines); },
        () => { if (this.linesElement) this.linesElement.innerText = "42"; }
    );
    #linesPerMs = 500 / 1000; // (lines / second) / 1000
    #lineRange = [10000, 15000]; // min and max lines per project

    #armAnim = new Animation(125, // arm speed
        () => { this.setActiveArm(this.arms[(this.getActiveArm() % 2) + 1]); }, // flip flop
        () => { this.setActiveArm(); } // reset
    );

    #juiceMult = 2;
    #juiceAnim = new Animation(0, // happens constantly
        () => {  }, // check if active?
        () => {  }
    );
    
    constructor() {
        this.juiceButton = document.getElementById(`juicer`);
        this.linesElement = document.getElementById(`lines`);
        this.projectElement = document.getElementById(`title`);
        this.arms = [ // no coding, anim 1, anim 2
            document.getElementById(`arm-resting`), 
            document.getElementById(`arm-up`), 
            document.getElementById(`arm-down`)
        ];

        this.juiceButton.style.display = 'block';
        this.juiceButton.addEventListener(`click`, this.juiceClicked);

        this.lines = 0;
        this.linesToCompletion = 0;
        this.projectName = "";
        this.juiceActive = false;
    }

    //#region Start/Stop methods
    start() {
        const update = (timestamp) => {
            if (!this.#prevTimeStamp) { // if there is no existing previous timestamp
                this.#prevTimeStamp = timestamp; // set it here
            }

            // increase lines by value
            const delta = (timestamp - this.#prevTimeStamp) * (this.juiceActive ? this.#juiceMult : 1);
            this.lines += delta * this.#linesPerMs;

            if (this.lines >= this.linesToCompletion) {
                this.lines = this.linesToCompletion;
                this.newProject();
                this.lines = 0;
            }

            this.#armAnim.attemptUpdate(delta);
            this.#lineAnim.attemptUpdate(delta);
            this.#juiceAnim.attemptUpdate(delta);

            this.#prevTimeStamp = timestamp;
            this.frameID = requestAnimationFrame(update);
        }; // delegate to occur each frame
        
        this.newProject(); // Start a new Project.

        this.frameID = requestAnimationFrame(update);
    }

    stop() {
        if (this.frameID) { cancelAnimationFrame(this.frameID); }

        this.juiceButton.removeEventListener(`click`, this.juiceClicked);
        
        this.#lineAnim.stop();
        this.#armAnim.stop();
    }
    //#endregion

    //#region Arm Methods
    // method called to set an active arm and set other arms to inactive.
    setActiveArm(arm = this.arms[0]) {
        for (let i = 0; i < this.arms.length; i++) {
            const existingArm = this.arms[i];
            existingArm.style.opacity = (existingArm === arm ? '1' : '0');
        }
    }
    // method to retrieve currently active arm.
    getActiveArm() {
        for (let i = 0; i < this.arms.length; i++) {
            if (this.arms[i].style.opacity == '1') {
                return i;
            }
        }
        return -1;
    }
    //#endregion

    juiceClicked() {
        
    }

    // method called when the current project has been completed and a new one needs to be selected.
    newProject() {
        if (this.lines != 0) {
            console.log("Completed [" + this.projectName + "] in " + this.lines + " lines! Only [" + ((1 - (Projects.usedNames / Projects.TOTAL_COMBOS)) * 100).toString() + "] Left to use.");
        }

        this.projectName = Projects.newProject();
        this.linesToCompletion = Math.round(Math.random() * (this.#lineRange[1] - this.#lineRange[0]) + this.#lineRange[0]);
        if (this.projectElement) {
            this.projectElement.innerText = this.projectName;
        }
        
    }
}