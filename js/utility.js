export class NumberRange {
    #difference;
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.#difference = max - min;
    }

    random() {
        return (Math.random() * this.#difference) + this.min;
    }
}