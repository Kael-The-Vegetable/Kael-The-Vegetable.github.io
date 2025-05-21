// Helper functions (can be shared or duplicated depending on structure)
function randListVal(list = new Array()) {
    if (list.length == 0) return null;
    return list[randID(list.length)];
}
function randID(length = 0) {
    if (length == 0) return -1;
    return Math.floor(Math.random() * length);
}

// class to encapsulate the different possible game project titles and lines of code needed to complete
// TODO: go through adjectives, themes, genres, and sequels for any potential wrong wordings and rewrite.
export class Projects {
    static #adjective = [
      "Ancient ", "Angry ", "Atomic ", "Awkward ", "Bizarre ", "Blazing ", "Bloody ", "Broken ", "Brutal ", "Clever ", "Cold ", "Cosmic ", "Cursed ", "Dark ", "Deadly ", "Deranged ", "Doomed ", "Dusty ", "Electric ", "Enraged ", "Eternal ", "Freaky ", "Frosty ", "Galactic ", "Grumpy ", "Haunted ", "Heroic ", "Hollow ", "Hot ", "Ironic ", "Juicy ", "Lonely ", "Lucky ", "Mighty ", "Nuclear ", "Rusty ", "Salty ", "Savage ", "Sassy ", "Vicious "
    ]; // 50 adjectives
    static #theme = [ 
      "Academic ", "Alien ", "Apocalyptic ", "Arctic ", "Baking ", "Castle ", "Caveman ", "City ", "Cyberpunk ", "Deep Sea ", "Desert ", "Dungeoning ", "Dystopia ", "Farming ", "Forest ", "Galactic ", "Garage ", "Graveyard ", "Hacking ", "Haunted ", "Hellish ", "High School ", "Hospital ", "Iceberg ", "Island ", "Jungle ", "Kingdom ", "Laboratory ", "Library ", "Mars ", "Medieval ", "Metro ", "Mining ", "Moon ", "Museum ", "Office ", "Outer Space ", "Pirating ", "Prison ", "Robotics ", "Ruins ", "Space Station ", "Suburb ", "Swamp ", "Temple ", "Time Traveling ", "Toy Store ", "Train ", "Underworld ", "Village ", "Wasteland ", "Wild West "
    ]; // 50 themes
    static #genre = [
      "Adventure", "Arena", "Auto Clash", "Battle Royale", "Brawl", "Builder", "Card Clash", "Clicker", "Combat", "Cooking", "Dates", "Deckbuilder", "Dungeons", "Escape Room", "Farming", "Fighting", "Fishing", "Flight", "FPS", "God", "Hack-and-Slash", "Horror", "Idle", "Infiltration", "Interactive", "JRPG", "Jumps", "Life", "Management", "Match-3", "Mazes", "Metroidvania", "MMO", "MOBA", "Music", "Mysteries", "Partying", "Point & Click", "Race", "Rhythm", "Roguelike",  "Sandbox", "Shooter", "Simulator", "Strategy", "Synthcraft", "Tinkerlabs", "Tower", "World"
    ]; // 50 genres
    static #sequelTag = [
      ": Aftermath", ": Armageddon", ": Back in Action", ": Code Orange", ": Director's Cut", ": Dominion", ": Extended Edition", ": Final Chapter", ": Intercepted", ": Last Stand", ": Origins", ": Prologue", ": Rebirth", ": Reloaded", ": Remastered?", ": Resurrection", ": Returns", ": Redux", ": Revolution", ": The Awakening", ": The Fall", ": The Good One", ": The Lost Chapters", ": The Reckoning", ": X"
    ]; // 25 sequel tags
    // total of 3.125 M combinations

    static #projectNamesUsed = ;
    static #totalAttempts = 100;

    static newProject(addingToMap = true) {
        const title = []; // 0 = adjective, 1 = theme, 2 = genre, 3 = sequel tag
        title.push(randListVal(this.#adjective));
        title.push(randListVal(this.#theme));
        title.push(randListVal(this.#genre));

        if (Math.random() >= 0.5) { // invoke 50% chance of sequel no matter what
            title.push(randListVal(this.#sequelTag));
        }

        let result = title.join('');

        if (addingToMap) {
            let attempts = 0;
            while(attempts < this.#totalAttempts && this.#projectNamesMade.has(title)) {
                if (title.length > 3) { // has sequel
                    switch (randID(title.length)) {
                        case 0: // new adjective
                            title[0] = randListVal(this.#adjective);
                            break;
                        case 1: // new theme
                            title[1] = randListVal(this.#theme);
                            break;
                        case 2: // new genre
                            title[2] = randListVal(this.#genre);
                            break;
                        case 3: // new sequel tag
                            title[3] = randListVal(this.#sequelTag);
                            break;
                    }
                } else {
                    title.push(randListVal(this.#sequelTag));
                }
                attempts++;
            }

            if (attempts > 0) { result = title.join(''); }

            this.#projectNamesMade.set(title, result);
        }

        return result;
    }

    static clearExistingProjects = () => this.#projectNamesMade.clear();
}