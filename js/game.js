import { Projects } from './projects.js';
import { Animation } from './animation.js';
import { NumberRange, lerp } from './utility.js';

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
    ev.target.style.display = 'none';
}

function fitTextInContainer(container, min, max, fontUnit, depth = 5) {
    let low = min;
    let high = max;
    let checkedDepth = 0;

    while(checkedDepth < depth) {
        const mid = (low + high) * 0.5;
        container.style.fontSize = mid + fontUnit;
        if (container.scrollHeight > container.clientHeight + 1) {
            high = mid;
        } else {
            low = mid;
        }
        checkedDepth++;
    }
    container.style.fontSize = low + fontUnit;
}

const GAME_SPEED = 250; // smallest unit of time used for delays in ms.

// class to encapsulate the game running
class Game {
    static LINES_PER_GS = new NumberRange(100, 400);

    frameID;

    //#region Private Variables
    #prevTimeStamp;
    #prevLinesComplete = 0;
    #lerpLinesCoefficient = 2;
    
    // Constants
    #lineRange = new NumberRange(10000, 15000);
    static #JUICE_TIME = 40 * GAME_SPEED;
    #juiceMult = 4;
    static #PATH_TRIM_LENGTH = 11;

    // Monitor Line Ranges
    #monitorLRange = new NumberRange(30, 80);
    #monitorSRange = new NumberRange(12, 45);
    #monitorLinesL;
    #monitorLinesS;

    //#region Animations
    #lineAnim = new Animation(GAME_SPEED,
        () => { 
            this.lines += Game.LINES_PER_GS.random();
            if (this.linesElement) this.linesElement.innerText = Math.floor(this.lines); 
        },
        () => { if (this.linesElement) this.linesElement.innerText = "0"; }
    );

    #armAnim = new Animation(GAME_SPEED,
        () => { this.#setActiveArm(this.arms[(this.#getActiveArm() % 2) + 1]); },
        () => { this.#setActiveArm(); }
    );

    #juiceAnim = new Animation(Game.#JUICE_TIME,
        () => {
            if (this.juiceActive) {
                this.juiceButton?.setAttribute(`data-active`, 'false');
                this.juiceActive = false;
            } else {
                this.juiceButton?.setAttribute(`data-active`, 'true');
            }
        },
        () => {
            this.juiceButton?.setAttribute(`data-active`, 'false');
            this.juiceButton.style.display = 'none';
        },
        (currentDelay) => {
            if (this.juiceButton?.getAttribute(`data-active`) == 'true') return;
            if (currentDelay > Game.#JUICE_TIME) currentDelay = Game.#JUICE_TIME;
            const percentage = this.juiceActive ?
                (100 - 100 * currentDelay / Game.#JUICE_TIME) :
                (100 * currentDelay / Game.#JUICE_TIME);
            document.documentElement.style.setProperty(`--juice-level`, percentage + '%');
        }
    );

    #monitorAnim = new Animation(3 * GAME_SPEED,
        () => {
            this.#updateMonitorLengths(this.#monitorLinesL, this.#monitorLRange);
            this.#updateMonitorLengths(this.#monitorLinesS, this.#monitorSRange);
        },
        () => {
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
        this.arms = [
            document.getElementById(`arm-resting`),
            document.getElementById(`arm-up`),
            document.getElementById(`arm-down`)
        ];
        this.monitorLarge = document.getElementById(`monitor-large`);
        this.monitorSmall = document.getElementById(`monitor-small`);


        //#region Initialize Monitor Lines
        this.monitorLarge.style.opacity = '1';
        this.monitorSmall.style.opacity = '1';

        const setupMonitorLines = (m) => {
            return Array.from(m.children).map(child => ({
                node: child,
                length: 0,
                path: child.getAttribute(`d`).slice(0, Game.#PATH_TRIM_LENGTH), // removing horizontal length
                setLength(val) {
                    this.length = val;
                    this.node.setAttribute(`d`, this.path + this.length);
                }
            })).reverse();
        }

        this.#monitorLinesL = setupMonitorLines(this.monitorLarge);
        this.#monitorLinesS = setupMonitorLines(this.monitorSmall);
        
        [this.#monitorLinesL, this.#monitorLinesS]
            .forEach((lines) => lines.forEach((line) => line.setLength(0)));
        //#endregion

        //#region Juice Button Setup
        this.juiceButton.style.display = 'block';
        this.juiceClicked = this.juiceClicked.bind(this);
        this.juiceButton?.addEventListener(`click`, this.juiceClicked);
        //#endregion

        this.lines = 0;
        this.linesToCompletion = 0;
        this.projectName = "";
        this.juiceActive = false;
    }

    //#region Start/Stop Methods
    start() {
        const update = (timestamp) => {
            if (!this.#prevTimeStamp) this.#prevTimeStamp = timestamp;

            const delta = timestamp - this.#prevTimeStamp; // true delta between prev frame (in ms)
            const scaledDelta = delta * (this.juiceActive ? this.#juiceMult : 1); // scaled based on if juice is active

            this.#prevLinesComplete = lerp(this.#prevLinesComplete, this.lines, scaledDelta * 0.001 * this.#lerpLinesCoefficient);
            this.progressElement.style.width = (this.#prevLinesComplete / this.linesToCompletion) * 100 + '%';

            if (this.lines >= this.linesToCompletion) {
                this.lines = this.linesToCompletion;
                if ((this.lines - this.#prevLinesComplete) / this.lines < 0.01) { // if bar is 99% complete just do new project
                    this.newProject();
                    this.#prevLinesComplete = 0
                    this.lines = 0;
                }
            } else {
                this.#lineAnim.attemptUpdate(scaledDelta);
            }

            this.#armAnim.attemptUpdate(scaledDelta);
            this.#monitorAnim.attemptUpdate(scaledDelta);
            if (this.juiceButton.getAttribute(`data-active`) == 'false') {
                this.#juiceAnim.attemptUpdate(scaledDelta);
            }

            this.#prevTimeStamp = timestamp;
            this.frameID = requestAnimationFrame(update);
        }; // delegate to occur each frame
        
        this.newProject();
        this.frameID = requestAnimationFrame(update);
    }

    stop() {
        if (this.frameID) cancelAnimationFrame(this.frameID);

        this.juiceButton.removeEventListener(`click`, this.juiceClicked);
        this.#lineAnim.stop();
        this.#armAnim.stop();
        this.#juiceAnim.stop();
        this.#monitorAnim.stop();
    }
    //#endregion

    //#region Arm Methods
    // method called to set an active arm and set other arms to inactive.
    #setActiveArm(arm = this.arms[0]) {
        for (let i = 0; i < this.arms.length; i++) {
            const existingArm = this.arms[i];
            existingArm.style.opacity = (existingArm === arm ? '1' : '0');
        }
    }
    // method to retrieve currently active arm.
    #getActiveArm() {
        for (let i = 0; i < this.arms.length; i++) {
            if (this.arms[i].style.opacity == '1') return i;
        }
        return -1;
    }
    //#endregion

    //#region Juice Click Method
    juiceClicked(ev) {
        if (ev.target.getAttribute(`data-active`) == 'true') {
            this.juiceActive = true;
            ev.target.setAttribute(`data-active`, 'false');
        }
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

    // method called when the current project has been completed and a new one needs to be selected.
    newProject() {
        this.projectName = Projects.newProject();
        this.linesToCompletion = Math.round(this.#lineRange.random());
        const title = this.projectElement;
        if (title) { 

            // (!!!) DAD'S CHANGES
            const testTitle = document.getElementById('title-test');
            const maxHeight = document.getElementById('title-container-test').clientHeight;
            testTitle.innerHTML = this.projectName;
            let height = 1.9; // (*) 1.8 will be starting height below
            testTitle.style.fontSize = `${height}rem`;
            void testTitle.offsetHeight; // (!) force rendering refresh
            let heightTest = testTitle.scrollHeight;
            while (heightTest > maxHeight || height < 0.9) {
                height = Math.round((height - 0.1) * 10) / 10; // round to nearest tenth
                testTitle.style.fontSize = `${height}rem`;
                void testTitle.offsetHeight; // (!)
                heightTest = testTitle.scrollHeight;
            }
            title.style.fontSize = `${height}rem`;
            title.innerHTML = this.projectName;

            /* title.innerHTML = this.projectName;
            if (title.scrollHeight > title.clientHeight + 1 || parseFloat(title.style.fontSize) < 1.25) {
                fitTextInContainer(title, 0.8, 1.3, 'rem');
            } */
        }
    }
}