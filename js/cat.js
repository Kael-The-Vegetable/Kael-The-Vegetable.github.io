export class Cats {

    #walkAcross = false;

    //#region Annoyment
    annoymentLevel = 0;
    annoymentLimit = 5;
    #annoymentID;
    //#endregion

    catDict = {};

    /**
     * 
     * @param {[]} cats 
     */
    constructor(cats) {
        for (let i = 0; i < cats.length; i++) {
            this.catDict[cats[i].getAttribute('id')] = [ this.#checkForElement(cats[i], 'content'), this.#checkForElement(cats[i], 'annoyed') ];
            cats[i].addEventListener(`click`, this.annoyCat.bind(this, cats[i].getAttribute('id')));
        }
    }
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

    beginWalk() {
        if (this.#walkAcross) return;
        this.#walkAcross = true;
        setTimeout(() => this.#walkAcross = false, 10000);
        console.log("annoyed");
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