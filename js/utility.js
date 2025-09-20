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

export function lerp(firstNum, secondNum, delta) {
    if (delta > 1) delta = 1;
    else if (delta < 0) delta = 0;
    return firstNum * (1 - delta) + secondNum * delta
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}