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

export function fitTextInContainer(container, min, max, maxHeight, fontUnit, depth = 10) {
    let low = min;
    let high = max;
    let checkedDepth = 0;

    while(checkedDepth < depth) {
        const mid = (low + high) * 0.5;
        container.style.fontSize = mid + fontUnit;
        void container.offsetHeight; // refresh for browser
        if (container.scrollHeight > maxHeight) {
            high = mid;
        } else {
            low = mid;
        }
        checkedDepth++;
    }
    return low + fontUnit;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}