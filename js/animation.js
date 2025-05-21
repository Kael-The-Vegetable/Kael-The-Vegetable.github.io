export class Animation {
    #currentDelay = 0;

    /**
     * @param {number} msTillCall 
     * @param {function} animFunc 
     * @param {function} stopFunc 
     */
    constructor(msTillCall, animFunc, stopFunc) {
        this.delay = msTillCall;
        this.anim = animFunc;
        this.stop = stopFunc;
    }

    /**
     * @param {number} delta time since last update
     */
    attemptUpdate(delta) {
        if (this.delay <= 0) { // guard clause
            this.anim();
            return;
        } 
        
        this.#currentDelay += delta;
        if (this.#currentDelay >= this.delay) {
            this.#currentDelay %= this.delay;
            this.anim();
        }
    }
}