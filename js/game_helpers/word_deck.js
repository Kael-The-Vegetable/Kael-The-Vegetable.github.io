import { Utilities } from "./utility.js";

export class WordDeck {
    #words = [];
    #currentID = 0;
    size = 0;

    constructor(wordArray = []) {
        this.#words = [...wordArray];
        this.size = this.#words.length;
    }

    shuffle() {
        for (let i = this.#words.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.#words[i], this.#words[j]] = [this.#words[j], this.#words[i]];
        }
    }
    peek() { 
        return this.#words[this.#currentID] 
    }
    draw() {
        const word = this.peek();
        if (this.#currentID < this.#words.length - 1) { 
            this.#currentID++;
        }
        return word;
    }
    reset() {
        this.#currentID = 0;
    }
}

export class MultiWordDeck {
    // first column has decks, second column has array of draw sequence
    #decksDrawSequence = [[]]
    #drawIndex = 0;
    #deckSize = 0;
    constructor() {
        const args = [...arguments];
        
        this.#deckSize = Math.max(...args.map(deck => deck.size));
        this.#decksDrawSequence = args.map(arg => [arg]);
        
        for(let i = 0; i < this.#decksDrawSequence.length; i++) {
            this.#decksDrawSequence[i][1] = Array(this.#deckSize).fill(false);
            MultiWordDeck.#fillArray(this.#decksDrawSequence[i][1], this.#decksDrawSequence[i][0].size, true);
        } // making it so each deck has an element to the right for their draw sequence

        this.shuffle();
    }

    shuffle() {
        for (let i = 0; i < this.#decksDrawSequence.length; i++) {
            this.#decksDrawSequence[i][0].shuffle();
            Utilities.ShuffleArray(this.#decksDrawSequence[i][1]);
        }
    }
    peek() {
        let str = [];
        for (let i = 0; i < this.#decksDrawSequence.length; i++) {
            if (this.#decksDrawSequence[i][1][this.#drawIndex]) {
                str.push(this.#decksDrawSequence[i][0].draw());
            }
        }
        
        let sentence = "";
        for (let i = 0; i < str.length; i++) {
            switch (i) {
                case 2:
                    sentence += str[i];
                    break;
                case 3:
                    sentence += ": <em>";
                    sentence += str[i];
                    sentence += "</em>";
                    break;
                default:
                    sentence += str[i];
                    sentence += " ";
                    break;
            }
        }
        
        return sentence;
    }
    draw() {
        if (this.#drawIndex >= this.#deckSize) {
            this.reset();
            this.shuffle();
        }
        const sentence = this.peek();
        this.#drawIndex++;
        return sentence;
    }
    reset() {
        this.#drawIndex = 0;
        for (let i = 0; i < this.#decksDrawSequence.length; i++) {
            this.#decksDrawSequence[i][0].reset();
        }
    }

    static #fillArray(array, numToFill, fill) {
        if (numToFill > array.length) numToFill = array.length;
        else if (numToFill < 1) return;

        for (let i = 0; i < numToFill; i++) {
            array[i] = fill;
        } // fill start of array with "fill" "numToFill" times
    }
}