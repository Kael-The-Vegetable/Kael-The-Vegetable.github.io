function initializeGame(mEvent) {
    console.log("game started!")
}

// wait for DOM to load fully
document.addEventListener(`DOMContentLoaded`, function() {
    const startGameButton = document.getElementById(`game-start`);
    startGameButton?.addEventListener(`click`, function() {
        console.log("Button was clicked!");
    });
});

