// class to encapsulate the different possible game project titles and lines of code needed to complete
// TODO: go through adjectives, themes, genres, and sequels for any potential wrong wordings and rewrite.
export class Projects {
    static #adjective = [
      "Ancient ", "Angry ", "Atomic ", "Awkward ", "Bizarre ", "Blazing ", "Bloody ", "Broken ", "Brutal ","Chaotic ", "Clever ", "Cold ", "Cosmic ", "Creepy ", "Cursed ", "Dark ", "Deadly ", "Deranged ", "Doomed ", "Draconic ", "Dusty ", "Electric ", "Enraged ", "Eternal ", "Filthy ", "Freaky ", "Frosty ", "Galactic ", "Greedy ", "Grumpy ", "Haunted ", "Heroic ", "Hollow ", "Hot ", "Ironic ", "Juicy ", "Lonely ", "Lucky ", "Lunar ", "Mighty ", "Nuclear ", "Radiant ", "Rusty ", "Salty ", "Savage ", "Sassy ", "Slimy ", "Spooky ", "Vicious "
    ]; // 50 adjectives
    static #theme = [ 
      "Academic ", "Alien ", "Apocalypse ", "Arctic ", "Baking ", "Castle ", "Caveman ", "City ", "Cyberpunk ", "Deep Sea ", "Desert ", "Dungeoning ", "Dystopia ", "Farming ", "Forest ", "Galactic ", "Garage ", "Graveyard ", "Hacking ", "Hell ", "High School ", "Hospital ", "Iceberg ", "Island ", "Jungle ", "Kingdom ", "Laboratory ", "Library ", "Mars ", "Medieval ", "Metro ", "Mining ", "Moon ", "Museum ", "Office ", "Outer Space ", "Prison ", "Robotic ", "Ruins ", "Space Station ", "Suburb ", "Swamp ", "Temple ", "Time Traveling ", "Toy Store ", "Train ", "Underworld ", "Village ", "Wasteland ", "Wild West "
    ]; // 50 themes
    static #genre = [
      "Adventure", "Arena", "Auto Clash", "Battle Royale", "Brawl", "Builder", "Card Clash", "Clicker", "Combat", "Cooking", "Dates", "Deckbuilder", "Dungeons", "Escape Room", "Farming", "Fighting", "Fishing", "Flight", "FPS", "God", "Hack-and-Slash", "Horror", "Idle", "Infiltration", "Interactive", "JRPG", "Jumps", "Life", "Management", "Mania", "Match-3", "Mazes", "MMO", "MOBA", "Music", "Mysteries", "Partying", "Point & Click", "Race", "Rhythm", "Roguelike",  "Sandbox", "Shooter", "Simulator", "Strategy", "Synthcraft", "Tinkerlabs", "Tower", "World"
    ]; // 50 genres
    static #sequelTag = [
      "", ": Aftermath", ": Armageddon", ": Back in Action", ": Code Orange", ": Director's Cut", ": Dominion", ": Extended Edition", ": Final Chapter", ": Intercepted", ": Last Stand", ": Origins", ": Prologue", ": Rebirth", ": Reloaded", ": Remastered?", ": Resurrection", ": Returns", ": Redux", ": Revolution", ": The Awakening", ": The Fall", ": The Good One", ": The Lost Chapters", ": The Reckoning", ": X"
    ]; // 26 sequel tags including 1 empty

    // Constants for internal calculations
    static #ADJECTIVE_LEN = Projects.#adjective.length;
    static #THEME_LEN = Projects.#theme.length;
    static #GENRE_LEN = Projects.#genre.length;
    static #SEQUEL_LEN = Projects.#sequelTag.length;

    static TOTAL_COMBOS = Projects.#ADJECTIVE_LEN * Projects.#THEME_LEN * Projects.#GENRE_LEN * (Projects.#SEQUEL_LEN);
    static #inverseTotal = 1 / this.TOTAL_COMBOS;

    static TOTAL_NO_SEQUELS = Projects.#ADJECTIVE_LEN * Projects.#THEME_LEN * Projects.#GENRE_LEN;
    static #MAX_ATTEMPTS = 100;
    static #CLEAR_ABOVE_PERCENT = 0.75; // clear memory above this percentage

    static #projectNames = new Uint8Array(Math.ceil(Projects.TOTAL_COMBOS * 0.125));
    static usedNames = 0;

    static newProject(checkForUnique = true) {
        let index;
        let totalUsed;
        let attempts = 0;

        do {
            totalUsed = (Math.random() >= 0.5) ? Projects.TOTAL_COMBOS : Projects.TOTAL_NO_SEQUELS;
            index = Math.floor(Math.random() * totalUsed);
            attempts++;
        } while (
            checkForUnique &&
            attempts <= Projects.#MAX_ATTEMPTS &&
            Projects.#isUsed(index)
        );
        
        if (checkForUnique && !Projects.#isUsed(index)) {
            Projects.usedNames++;
            Projects.#markUsed(index);
        }

        return Projects.#decodeIndex(index);
    }

    static #isUsed(index) {
        const byte = index >> 3;
        const bit = index & 7;
        return (Projects.#projectNames[byte] & (1 << bit)) !== 0;
    }
    static #markUsed(index) {
        const byte = index >> 3;
        const bit = index & 7;
        Projects.#projectNames[byte] |= (1 << bit);
        if (Projects.usedNames * Projects.#inverseTotal > Projects.#CLEAR_ABOVE_PERCENT) {
            Projects.clearUsed();
        }
    }
    static #decodeIndex(index) {
        let sequelIndex = -1;

        if (index >= Projects.TOTAL_NO_SEQUELS) {
            sequelIndex = index % Projects.#SEQUEL_LEN;
            index = Math.floor(index / Projects.#SEQUEL_LEN);
        }

        const genreIndex = index % Projects.#GENRE_LEN;
        index = Math.floor(index / Projects.#GENRE_LEN);

        const themeIndex = index % Projects.#THEME_LEN;
        index = Math.floor(index / Projects.#THEME_LEN);

        const adjectiveIndex = index;

        return (
            Projects.#adjective[adjectiveIndex] +
            Projects.#theme[themeIndex] +
            Projects.#genre[genreIndex] +
            (sequelIndex !== -1 ? Projects.#sequelTag[sequelIndex] : "")
        );
    }
    static clearUsed() {
        Projects.#projectNames.fill(0);
        Projects.usedNames = 0;
    }
}