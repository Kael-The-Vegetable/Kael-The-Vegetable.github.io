import { MultiWordDeck, WordDeck } from "./word_deck.js";

// class to encapsulate the different possible game project titles and lines of code needed to complete
// TODO: go through adjectives, themes, genres, and sequels for any potential wrong wordings and rewrite.
export class Projects {
    static #adjective = [
      "Ancient", "Angry", "Atomic", "Awkward", "Bizarre", "Blazing", "Bloody", "Broken", "Brutal","Chaotic", "Clever", "Cold", "Cosmic", "Creepy", "Cursed", "Dark", "Deadly", "Deranged", "Doomed", "Draconic", "Dusty", "Electric", "Enraged", "Eternal", "Filthy", "Freaky", "Frosty", "Galactic", "Greedy", "Grumpy", "Haunted", "Heroic", "Hollow", "Hot", "Ironic", "Juicy", "Lonely", "Lucky", "Lunar", "Mighty", "Nuclear ", "Radiant", "Rusty", "Salty", "Savage", "Sassy", "Scary", "Slimy", "Spooky", "Vicious"
    ]; // 50 adjectives
    static #theme = [ 
      "Academic", "Alien", "Apocalypse", "Arctic", "Baking", "Cat", "Caveman", "City", "Cyberpunk", "Deep Sea", "Desert", "Digital", "Dungeon", "Dystopia", "Forest", "Galactic", "Garage", "Graveyard", "Hacker", "Hell", "High School", "Hospital", "Iceberg", "Island", "Jungle", "Kingdom", "Laboratory", "Library", "Mars", "Medieval", "Metro", "Miner", "Moon", "Museum", "Office", "Outer Space", "Prison", "Robotic", "Ruins", "Space Station", "Suburb", "Swamp", "Temple", "Time Traveler", "Toy Store", "Train", "Underworld", "Village", "Wasteland", "Wild West"
    ]; // 50 themes
    static #genre = [
      "Action", "Adventure", "Arena", "Auto Clash", "Battle Royale", "Brawl", "Builder", "Card Clash", "Clicker", "Combat", "Cooking", "Dates", "Deckbuilder", "Dungeons", "Escape Room", "Farming", "Fighting", "Fishing", "Flight", "FPS", "God", "Hack-and-Slash", "Horror", "Idle", "Infiltration", "Interactive", "JRPG", "Jumps", "Life", "Management", "Mania", "Match-3", "Mazes", "MMO", "MOBA", "Music", "Mysteries", "Partying", "Point & Click", "Race", "Rhythm", "Roguelike",  "Sandbox", "Shooter", "Simulator", "Strategy", "Synthcraft", "Tinkerlabs", "Tower", "World"
    ]; // 50 genres
    static #sequelTag = [
      "Aftermath", "Armageddon", "Back in Action", "Code Orange", "Director's Cut", "Dominion", "Extended Edition", "Final Chapter", "Intercepted", "Last Stand", "Origins", "Prologue", "Rebirth", "Reloaded", "Remastered?", "Resurrection", "Returns", "Redux", "Revolution", "The Awakening", "The Fall", "The Better One", "The Lost Chapters", "The Reckoning", "X"
    ]; // 25 sequel tags

    static #deck = new MultiWordDeck(new WordDeck(Projects.#adjective), new WordDeck(Projects.#theme), new WordDeck(Projects.#genre), new WordDeck(Projects.#sequelTag));
    static newProject() {
        return Projects.#deck.draw();
    }
}