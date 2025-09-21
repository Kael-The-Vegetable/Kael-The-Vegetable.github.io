import { ObjectPool, Rectangle, Vector2 } from "./utility";

export class Cats {

    //#region Walking
    #walkAcross = false;
    #pawPath;
    //#endregion

    //#region Annoyment
    annoymentLevel = 0;
    annoymentLimit = 5;
    #annoymentID;
    //#endregion

    catDict = {};

    /**
     * 
     * @param {[]} cats array of cats elements
     * @param {} pawContainer paw container element
     * @param {number} scaleFactor scalar
     */
    constructor(cats, pawContainer, scaleFactor) {
        this.#pawPath = new PawWalk(pawContainer, scaleFactor);
        
        for (let i = 0; i < cats.length; i++) {
            this.catDict[cats[i].getAttribute('id')] = [ this.#checkForElement(cats[i], 'content'), this.#checkForElement(cats[i], 'annoyed') ];
            cats[i].addEventListener(`click`, this.annoyCat.bind(this, cats[i].getAttribute('id')));
        } // filling cat dictionary for future ease.
    }
    //#region Helper Methods
    #checkForElement(cat, element) {
        let children = cat.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].getAttribute('name') == element) {
                return children[i];
            }
        }
    }
    #increaseAnnoyment() {
        if (this.annoymentLevel == 0) {
            this.#annoymentID = setInterval(() => {
                this.annoymentLevel--;
                if (this.annoymentLevel < 1) {
                    clearInterval(this.#annoymentID);
                }
            }, 500);
        } // if starting at 0 then initiate gradial decrease

        this.annoymentLevel++;
        if (this.annoymentLevel > this.annoymentLimit) {
            this.beginWalk();
        }
    }
    //#endregion

    beginWalk() {
        if (this.#walkAcross) return;
        this.#walkAcross = true;
        // begin walk here
        this.#pawPath.drawPath();
    }

    annoyCat(id) {
        this.catDict[id][0].style.display = "none";
        this.catDict[id][1].style.display = "block";
        this.#increaseAnnoyment();

        setTimeout(() => { // flip the tail back after a moment
            this.catDict[id][0].style.display = 'block';
            this.catDict[id][1].style.display = 'none';
        }, 100);
    }
}
class PawWalk {
    static PAW_BASE_SIZE = 100;
    static PAW_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path style="fill:#E3F5F188;" d="M 66,4 C 53,4 47,32 61,36 81,42 81,6 67,4 Z M 34,6 H 33 C 17,10 21,46 41,38 54,33 46,6 34,6 Z m 55,23 c -5,0 -12,6 -14,11 -4,8 2,23 10,20 12,-4 14,-26 8,-30 -1,-1 -2,-1 -4,-1 z M 10,33 C 9,33 8,33 7,34 -1,40 7,64 17,64 25,64 30,51 26,45 22,39 16,33 10,33 Z M 51,43 C 43,43 34,50 33,56 31,67 25,68 21,70 5,78 15,104 35,94 43,90 53,90 61,94 87,108 95,74 77,66 70,63 67,60 65,54 62,46 57,43 51,43 Z" /></svg>`
    static PAW_BASE_STEP = PawWalk.PAW_BASE_SIZE * 2;
    
    #margin = 0;
    #windowMargined;
    #pawContainer;
    #pathID;

    // area where center of paw path can be;
    static CENTRAL_BOX = new Rectangle(
        window.innerWidth * 0.25, 
        window.innerHeight * 0.25, 
        window.innerWidth * 0.5, 
        window.innerHeight * 0.5); 

    
    #pawPool;
    #pawNum

    constructor(pawContainer, scaleFactor) {

        this.scaleFactor = scaleFactor;
        this.#pawContainer = pawContainer;

        //#region Walking Needed Calculations
        this.#margin = this.scaleFactor * PawWalk.PAW_BASE_SIZE * Math.SQRT2;
        this.#windowMargined = new Rectangle(
            -this.#margin, 
            -this.#margin,
            window.innerWidth + this.#margin * 2,
            window.innerHeight + this.#margin * 2
        );

        this.#pawPool = new ObjectPool(10, () => { return new PawPrint(this.#pawContainer, this.scaleFactor, 500, Vector2.ZERO, 0, false); });
    }

    drawPath() {
        const point = PawWalk.CENTRAL_BOX.randomPoint();
        const angle = Math.random() * 2 * Math.PI;
        const angleSines = new Vector2(Math.cos(angle), Math.sin(angle));
        const length = this.#windowMargined.size.max() * 2;
        
        let start = new Vector2(
            point.x + angleSines.x * length,
            point.y + angleSines.y * length);
        let end = new Vector2(
            point.x - angleSines.x * length,
            point.y - angleSines.y * length);
        [start, end] = this.#windowMargined.clipLineToBox(start, end);
        
        const deltaV = end.sub(start);
        const steps = Math.ceil(deltaV.magnitude() / PawWalk.PAW_BASE_STEP * this.scaleFactor);
        
        const perpAngle = Math.atan2(deltaV.y, deltaV.x) + Math.PI * 0.5;

        this.#pathID = setInterval(this.drawPaw.bind(this), 150);
    }
    drawPaw() {

    }
}
class PawPrint {
    #element; // html element
    
    /**
     * 
     * @param {*} container 
     * @param {number} pawBaseSize 
     * @param {number} scaleFactor 
     * @param {number} stepSpaceFactor 
     * @param {string} svg 
     * @param {number} visibleDur 
     * @param {Vector2} pos 
     * @param {number} rot 
     * @param {boolean} flip 
     */
    constructor(container, scaleFactor, visibleDur, pos, rot, flip) {
        this.parent = container;
        this.pawSize = PawWalk.PAW_BASE_SIZE * scaleFactor;
        this.fadeOut = visibleDur;
        this.pos = pos;
        this.rot = rot;
        this.flipped = flip;

        this.#element = document.createElement('div');
        this.#element.className = 'paw-print';
        this.#element.innerHTML = PawWalk.PAW_SVG;

        // show on container
        this.parent.appendChild(this.#element);
    }
    available() {
        return this.#element.style.opacity === "1";
    }
    popUp() {
        this.#element.style.left = `${this.pos.x - this.pawSize * 0.5}px`;
        this.#element.style.top = `${this.pos.y - this.pawSize * 0.5}px`;
        this.#element.style.transform = `scale(${scaleFactor}) rotate(${this.rot}rad) ${this.flipped ? 'scaleX(-1)' : ''}`;

        this.#element.style.opacity = 1;

        setTimeout(() => {
            this.#element.style.opacity = 0;
        }, this.fadeOut);
    }
    destroy() {
        this.#element.remove();
    }
}