import { Projects } from './projects.js';
import { Animation } from './animation.js';
import { NumberRange } from './utility.js';

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

const GAME_SPEED = 250; // smallest unit of time used for delays. 125ms

// class to encapsulate the game running
class Game {
    
    frameID;

    //#region Private Variables

    #prevTimeStamp; // useful to get delta

    // Lines
    #lineAnim = new Animation(GAME_SPEED, // line update speed
        () => { if (this.linesElement) this.linesElement.innerText = Math.floor(this.lines); },
        () => { if (this.linesElement) this.linesElement.innerText = "42"; }
    );
    #linesPerMs = 500 / 1000; // (lines / second) / 1000
    #lineRange = new NumberRange(10000, 15000); // min and max lines per project

    // Arm
    #armAnim = new Animation(GAME_SPEED, // arm speed
        () => { this.setActiveArm(this.arms[(this.getActiveArm() % 2) + 1]); }, // flip flop
        () => { this.setActiveArm(); } // reset
    );

    // Juice
    #juiceTime = 40 * GAME_SPEED;
    #juiceAnim = new Animation(this.#juiceTime,
        () => {
            if (this.juiceActive) {
                this.juiceButton.setAttribute(`data-active`, 'false');
                this.juiceActive = false;
            } else {
                this.juiceButton.setAttribute(`data-active`, 'true');
            }
        },
        () => {
            this.juiceButton.setAttribute(`data-active`, 'false');
            this.juiceButton.style.display = 'none';
        },
        (currentDelay) => {
            if (this.juiceButton.getAttribute(`data-active`) == 'true') {
                return;
            }

            if (currentDelay > this.#juiceTime) {
                currentDelay = this.#juiceTime;
            }
            const percentage = this.juiceActive ? (100 - 100 * currentDelay / this.#juiceTime) : (100 * currentDelay / this.#juiceTime);
            document.documentElement.style.setProperty(`--juice-level`, percentage + '%');
        }
    );
    #juiceMult = 4;

    //#region Computer Lines
    #monitorLRange = new NumberRange(30, 80);
    #monitorLinesL;
    #monitorSRange = new NumberRange(12, 45);
    #monitorLinesS;

    #monitorAnim = new Animation(3 * GAME_SPEED,
        () => { // animate
            this.#updateMonitorLengths(this.#monitorLinesL, this.#monitorLRange);
            this.#updateMonitorLengths(this.#monitorLinesS, this.#monitorSRange);
        },
        () => { // what to do when needing to stop.
            this.monitorLarge.style.opacity = '0';
            this.monitorSmall.style.opacity = '0';
        }
    );
    //#endregion
    //#endregion

    constructor() {
        this.juiceButton = document.getElementById(`juicer`);
        this.linesElement = document.getElementById(`lines`);
        this.projectElement = document.getElementById(`title`);
        this.progressElement = document.getElementById(`progress`);
        this.arms = [ // no coding, anim 1, anim 2
            document.getElementById(`arm-resting`), 
            document.getElementById(`arm-up`), 
            document.getElementById(`arm-down`)
        ];

        this.monitorLarge = document.getElementById(`monitor-large`);
        this.monitorSmall = document.getElementById(`monitor-small`);

        //#region Monitors
        this.monitorLarge.style.opacity = '1';
        this.monitorSmall.style.opacity = '1';
        this.#monitorLinesL = Array.from(this.monitorLarge.children).map(child => ({
            node: child,
            length: 0,
            path: child.getAttribute(`d`).slice(0, 10) // gather first 11 elements (not the last 2 for width)
        })).reverse(); // bottom up
        this.#monitorLinesS = Array.from(this.monitorSmall.children).map(child => ({
            node: child,
            length: 0,
            path: child.getAttribute(`d`).slice(0, 10) // gather first 11 elements (not the last 2 for width)
        })).reverse(); // bottom up

        for (let i = 0; i < this.#monitorLinesL.length; i++) {
            this.#monitorLinesL[i].node.setAttribute(`d`, this.#monitorLinesL[i].path + this.#monitorLinesL[i].length);
        }
        for (let i = 0; i < this.#monitorLinesS.length; i++) {
            this.#monitorLinesS[i].node.setAttribute(`d`, this.#monitorLinesS[i].path + this.#monitorLinesS[i].length);
        }
        //#endregion

        //#region Juice Button
        this.juiceButton.style.display = 'block';
        this.juiceClicked = this.juiceClicked.bind(this)
        this.juiceButton.addEventListener(`click`, this.juiceClicked);
        //#endregion

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
            const delta = (timestamp - this.#prevTimeStamp) 
            const scaledDelta = delta * (this.juiceActive ? this.#juiceMult : 1);
            this.lines += scaledDelta * this.#linesPerMs;

            this.progressElement.style.width = (this.lines / this.linesToCompletion) * 100 + '%';

            if (this.lines >= this.linesToCompletion) {
                this.lines = this.linesToCompletion;
                this.newProject();
                this.lines = 0;
            }

            this.#armAnim.attemptUpdate(scaledDelta);
            this.#lineAnim.attemptUpdate(scaledDelta);
            this.#monitorAnim.attemptUpdate(scaledDelta);
            if (this.juiceButton.getAttribute(`data-active`) == 'false') {
                this.#juiceAnim.attemptUpdate(scaledDelta); // juice button also runs faster.
            }

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
        this.#juiceAnim.stop();
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

    //#region Monitor Helper Method
    #updateMonitorLengths(monitorLines, range) {
        for (let i = monitorLines.length - 1; i > 0; i--) {
                const current = monitorLines[i];
                current.length = monitorLines[i - 1].length;
                current.node.setAttribute(`d`, current.path + current.length);
            }
        const newLineL = monitorLines[0];
        newLineL.length = range.random();
        newLineL.node.setAttribute(`d`, newLineL.path + newLineL.length);
    }
    //#endregion

    juiceClicked(ev) {
        if (ev.originalTarget.getAttribute(`data-active`) == 'true') {
            this.juiceActive = true;
            ev.originalTarget.setAttribute(`data-active`, 'false');
        }
    }

    // method called when the current project has been completed and a new one needs to be selected.
    newProject() {
        this.projectName = Projects.newProject();
        this.linesToCompletion = Math.round(this.#lineRange.random());
        if (this.projectElement) {
            this.projectElement.innerText = this.projectName;
        }
        
    }
}