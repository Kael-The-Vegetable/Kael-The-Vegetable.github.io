//#region Classes
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

export class Vector2 {
    static ZERO = new Vector2(0, 0);
    static ONE = new Vector2(1, 1);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    max() {
        return this.x > this.y ? this.x : this.y;
    }
    min() {
        return this.x < this.y ? this.x : this.y;
    }
    flip() {
        return new Vector2(this.y, this.x);
    }
    //#region Math
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    /**
     * 
     * @param {number} other 
     * @returns {Vector2}
     */
    mult(other) {
        return new Vector2(this.x * other, this.y * other);
    }
    //#endregion

    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
}

export class Rectangle {
    constructor(x, y, w, h) {
        this.pos = new Vector2(x, y);
        this.size = new Vector2(w, h);
        this.max = this.pos.add(this.size);
    }

    randomPoint() {
        return new Vector2(
            this.pos.x + Math.random() * this.size.x,
            this.pos.y + Math.random() * this.size.y);
    }
    clipLineToBox(v1, v2) {
        const deltaV = v2.sub(v1);
        const points = [];
        
        if (deltaV.x !== 0) {
            this.#addIfValid(points, this.pos.x, v1, deltaV, true);
            this.#addIfValid(points, this.max.x, v1, deltaV, true);
        }
        if (deltaV.y !== 0) {
            let vFlip = v1.flip();
            let dVFlip = deltaV.flip();
            this.#addIfValid(points, this.pos.y, vFlip, dVFlip, false);
            this.#addIfValid(points, this.max.y, vFlip, dVFlip, false);
        }
        return points;
    }
    #addIfValid(points, edge, primary, delta, isPrimeX) {
        const t = (edge - primary.x) / delta.x;
        const side = primary.y + t * delta.y;
        
        let v = isPrimeX ? new Vector2(edge, side) : new Vector2(side, edge);
        
        if (v.x >= this.pos.x && v.x <= this.max.x 
            && v.y >= this.pos.y && v.y <= this.max.y
        && !points.some(p => p.x === v.x && p.y === v.y)) {
            points.push(v);
        }
    }

    toString() {
        return `Rectangle(${this.pos.x}, ${this.pos.y}, ${this.size.x}, ${this.size.y})`;
    }
}

export class ObjectPool {
    objects = [];

    #generationMethod;
    
    constructor(numOfObjects, methodOfGeneration) {
        this.#generationMethod = methodOfGeneration;
        for (let i = 0; i < numOfObjects; i++) {
            this.objects[i] = this.#generationMethod();
        }
    }

    giveNextAvailable() {
        let found = null;
        for (let i = 0; i < this.objects.length && found == null; i++) {
            if (this.objects[i].available()) {
                found = this.objects[i];
            }
        }
        if (found == null) {
            found = this.#generationMethod();
            this.objects[this.objects.length] = found;
        }
        return found;
    }
}
//#endregion

export class Utilities {

    static Lerp(firstNum, secondNum, delta) {
        if (delta > 1) delta = 1;
        else if (delta < 0) delta = 0;
        return firstNum * (1 - delta) + secondNum * delta
    }

    static FitTextInContainer(container, min, max, maxHeight, fontUnit, depth = 10) {
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

    static ShuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static WindowSmaller() {
        return window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    }
}