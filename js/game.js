// wait for DOM to load fully
document.addEventListener(`DOMContentLoaded`, function() {
    const startButton = document.getElementById(`start`);
    if (startButton) {
        startButton.addEventListener(`click`, initializeGame);
    } else {
        console.error("couldn't find the game start button!");
    }
});

// class to encapsulate the different possible game project titles and lines of code needed to complete
class Projects {
    static #adjectives = [
      "Ancient ", "Angry ", "Atomic ", "Awkward ", "Bizarre ", "Blazing ", "Bloody ", "Broken ", "Brutal ", "Clever ", "Cold ", "Cosmic ", "Cursed", "Dark ", "Deadly ", "Deranged", "Doomed", "Dusty ", "Electric ", "Enraged", "Eternal ", "Freaky ", "Frosty ", "Galactic ", "Grumpy ", "Haunted ", "Heroic ", "Hollow ", "Hot ", "Ironic ", "Juicy ", "Lonely ", "Lucky ", "Mighty ", "Nuclear ", "Rusty ", "Salty ", "Savage ", "Sassy ", "Vicious "
    ]; // 50 adjectives
    static #theme = [ 
      "Alien ", "Apocalyptic ", "Arctic ", "Baking ", "Castle ", "Caveman ", "City ", "Cyberpunk ", "Deep Sea ", "Desert ", "Dungeoning ", "Dystopia ", "Farming ", "Forest ", "Galactic ", "Garage ", "Graveyard ", "Hacking ", "Haunted House ", "Hellish ", "High School ", "Hospital ", "Iceberg ", "Island ", "Jungle ", "Kingdom ", "Laboratory ", "Library ", "Mars ", "Medieval ", "Metro ", "Mining ", "Moon ", "Museum ", "Office ", "Outer Space ", "Pirating ", "Prison ", "Robotics ", "Ruins ", "Schooling ", "Space Station ", "Suburb ", "Swamp ", "Temple ", "Time Traveling ", "Toy Store ", "Train ", "Underworld ", "Village ", "Wasteland ", "Wild West "
    ]; // 50 themes
    static #genre = [
      "Adventure", "Arena", "Auto Battler", "Battle Royale", "Beat 'Em Up", "Builder", "Card", "Clicker", "Colony Sim", "Cooking", "Dating Sim", "Deckbuilder", "Detective", "Dungeon Crawler", "Endless Runner", "Escape Room", "Farming Sim", "Fighting", "Fishing", "Flight Sim", "FPS", "God", "Hack-and-Slash", "Horror", "Idle", "Interactive Fiction", "JRPG", "Life Sim", "Management", "Match-3", "Maze Runner", "Mech Combat", "Metroidvania", "MMO", "MOBA", "Music", "Open World", "Party", "Physics Puzzle", "Platformer", "Point & Click", "Puzzle", "Racing", "Rhythm", "Roguelike", "Sandbox", "Shooter", "Sports", "Stealth", "Strategy"
    ]; // 50 genres
    static #sequelTags = [
      ": Aftermath",": Armageddon",": Back in Action",": Director's Cut",": Extended Edition",": Intercepted",": Origins",": Oops",": Prologue",": Rebirth",": Reloaded",": Returns",": Redux",": Remastered?",": Resurrection",": Revolution",": Rises",": The Awakening",": The Fall",": The Good One",": The Lost Chapters",": The Reckoning",": Unhinged",": Final Chapter",": X"
    ]; // 25 sequels
    // total of 3.125 M combinations

    static #projectNamesMade = new Map();
    static #totalAttempts = 50;

    static newProject(addingToMap = true) {
        const title = []; // 0 = adjective, 1 = theme, 2 = genre, 3 = sequel tag
        title.push(randListVal(this.#adjectives));
        title.push(randListVal(this.#theme));
        title.push(randListVal(this.#genre));

        if (Math.random() >= 0.5) { // invoke 50% chance of sequel no matter what
            title.push(randListVal(this.#sequelTags));
        }

        let result = title.join('');

        if (addingToMap) {
            let attempts = 0;
            while(attempts < this.#totalAttempts && this.#projectNamesMade.has(title)) {
                if (title.length > 3) { // has sequel
                    switch (randID(title.length)) {
                        case 0: // new adjective
                            title[0] = randListVal(this.#adjectives);
                            break;
                        case 1: // new theme
                            title[1] = randListVal(this.#theme);
                            break;
                        case 2: // new genre
                            title[2] = randListVal(this.#genre);
                            break;
                        case 3: // new sequel tag
                            title[3] = randListVal(this.#sequelTags);
                            break;
                    }
                } else {
                    title.push(randListVal(this.#sequelTags));
                }
                attempts++;
            }
            result = title.join('');
            this.#projectNamesMade.set(title, result);
        }

        return result;
    }
    static clearExistingProjects = () => this.#projectNamesMade.clear();
}

// class to encapsulate the game running
class Game {
    frameID;
    #prevTimeStamp; // useful to get delta
    #linesPerMs = 80 / 1000; // lines / second / 1000
    #lineRange = [900, 1500]; // min and max lines per project

    constructor() {
        this.juiceButton = document.getElementById(`juicer`);
        this.linesElement = document.getElementById(`lines`);
        this.projectElement = document.getElementById(`title`);

        this.lines = 0;
        this.linesToCompletion = 0;
        this.projectName = "";
    }

    start() {
        const update = (timestamp) => {
            if (!this.#prevTimeStamp) { // if there is no existing previous timestamp
                this.#prevTimeStamp = timestamp; // set it here
            }

            // increase lines by value
            const delta = timestamp - this.#prevTimeStamp;
            this.lines += delta * this.#linesPerMs;
            
            if (this.lines >= this.linesToCompletion) {
                this.lines = this.linesToCompletion;
                this.newProject();
                this.lines = 0;
            }

            this.updateUI();
            this.#prevTimeStamp = timestamp;
            this.frameID = requestAnimationFrame(update);
        }; // delegate to occur each frame
        
        this.newProject(); // Start a new Project.

        this.frameID = requestAnimationFrame(update);
    }

    stop() {
        if (this.frameID) { cancelAnimationFrame(this.frameID); }
    }

    updateUI() {
        if (this.linesElement) {
            this.linesElement.innerText = Math.floor(this.lines);
        }
    }

    // method called when the current project has been completed and a new one needs to be selected.
    newProject() {
        if (this.lines != 0) {
            console.log("Completed [" + this.projectName + "] in " + this.lines + " lines!");
        }

        this.projectName = Projects.newProject(false);
        this.linesToCompletion = Math.round(Math.random() * (this.#lineRange[1] - this.#lineRange[0]) + this.#lineRange[0]);
        if (this.projectElement) {
            this.projectElement.innerText = this.projectName;
        }
    }
}

let gameObj;

// called when start-game button is pressed.
function initializeGame(ev) {
    gameObj?.stop();
    gameObj = new Game();
    console.log(ev.originalTarget);
    gameObj.start();
}

//#region Helper functions
function randListVal(list = new Array()) {
    if (list.length == 0) {
        return null;
    }
    return list[randID(list.length)];
}
function randID(length = 0) {
    if (length == 0) {
        return -1;
    }
    return Math.floor(Math.random() * length)
}
//#endregion