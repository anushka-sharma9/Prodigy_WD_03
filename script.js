const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const gameOverScreen = document.getElementById("gameOverScreen");
const winnerMessage = document.getElementById("winnerMessage");
const playAgainButton = document.getElementById("playAgain");

let boardState = Array(9).fill(""); 
let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (!gameActive || cell.textContent !== "") return;

        let index = cell.dataset.index;
        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add("player-move");

        if (checkWinner(currentPlayer)) {
            highlightWinner(currentPlayer);
            return;
        }

        if (!boardState.includes("")) {
            showGameOverScreen("It's a Draw!");
            return;
        }


        currentPlayer = "O";
        setTimeout(aiMove, 500);
    });
});

function aiMove() {
    let emptyCells = boardState.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    if (emptyCells.length === 0) return;

    let bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[bestMove] = "O";
    cells[bestMove].textContent = "O";
    cells[bestMove].classList.add("ai-move"); 

    if (checkWinner("O")) {
        highlightWinner("O");
        return;
    }

    currentPlayer = "X";
}


function checkWinner(player) {
    return winningCombinations.some(combination => 
        combination.every(index => boardState[index] === player)
    );
}

function highlightWinner(player) {
    showGameOverScreen(`${player} Wins!`);
    gameActive = false;
}

function showGameOverScreen(message) {
    winnerMessage.textContent = message;
    gameOverScreen.style.display = "block";
}

playAgainButton.addEventListener("click", resetGame);
resetButton.addEventListener("click", resetGame);

function resetGame() {
    gameOverScreen.style.display = "none";
    boardState.fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("player-move", "ai-move");
    });
    currentPlayer = "X";
    gameActive = true;
}

function updateBoardSize() {
    let size = window.innerWidth < 600 ? "80px" : "120px";
    document.documentElement.style.setProperty("--cell-size", size);
}

window.addEventListener("resize", updateBoardSize);
updateBoardSize(); 
