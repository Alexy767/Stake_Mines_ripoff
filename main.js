let board = [];
let rows = 5;
let columns = 5;

let minesCount = 1;
let minesLocation = [];

let tilesClicked = 0;

let gameOver = false;

let confirmCheck = false;

window.onload = function() {
    // promptAmountOfMines();
    minesCount = localStorage.getItem("stakeMinesRipoffMineAmmount") || 1;
    minesCount = parseInt(minesCount);
    minesCount = localStorage.getItem("stakeMinesRipoffMineAmmount") || 1;
    minesCount = parseInt(minesCount);
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("set-mines-count").innerText = localStorage.getItem("stakeMinesRipoffMineAmmount") || 1;
    document.getElementById("cash-out-button").addEventListener("click", cashOut);
    document.getElementById("restart-button").addEventListener("click", function() {
        if (!confirmCheck) {
            confirmCheck = true;
            if (confirm("Are you sure you want to restart?")) {
                reloadGame();
            }
            confirmCheck = false;
        }
    });
    document.getElementById("set-mines-count-button").addEventListener("click", SetMinesCount);
    window.onkeydown = function(event) {
        if (event.key == "r") {
            reloadGame();
        }
        if (event.key == "e") {
            cashOut();
        }
    }
    startGame();
}

// function promptAmountOfMines() {
//     let mines = prompt("How many mines do you want to play with? (1-10)");
//     if (mines >= 1 && mines <= 10) {
//         minesCount = parseInt(mines);
//     } else if (mines == null) {
//         alert("Default at 1 mine will be used.");
//         return;
//     } else {
//         alert("The ammount you put in is either invalid or bigger that 10. Please enter a number between 1 and 10.");
//         promptAmountOfMines();
//     }
// }

function SetMinesCount() {
    let mines = prompt("How many mines do you want to play with? (1-10)");
    if (mines >= 1 && mines <= 10) {
        localStorage.setItem("stakeMinesRipoffMineAmmount", mines);
        document.getElementById("set-mines-count").innerText = localStorage.getItem("stakeMinesRipoffMineAmmount") || 1;
    } else if (mines == null) {
        return;
    } else {
        alert("The ammount you put in is either invalid or bigger that 10. Please enter a number between 1 and 10.");
        SetMinesCount();
    }
}

function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function reloadGame() {
    clearBoard();
    gameOver = false;
    startGame();
}

function startGame() {
    setMines();

    //populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
    console.log(minesLocation);
}

function clearBoard() {
    tiles = document.getElementById("board").children;
    for (let i = tiles.length - 1; i >= 0; i--) {
        tiles[i].remove();
    }
    board = [];
    minesLocation = [];
    tilesClicked = 0;
}

function cashOut() {
    if (!gameOver) {
        if (minesCount >= 5) {
            multiplier = Math.round((tilesClicked * 0.2) * (minesCount / 4));
        } else {
            multiplier = Math.round((tilesClicked * 0.2));
        }
        alert("You have cashed out! You have cleared " + tilesClicked + " tiles for a multiplier of " + multiplier + "!");
        document.getElementById("mines-count").innerText = "Cashed Out";
        revealMinesSafe();
        gameOver = true;
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function revealMinesSafe() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "lightsalmon";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    
    board[r][c].classList.add("tile-clicked");
    board[r][c].classList.add("safe-tile");
    board[r][c].innerText = "💎";
    
    tilesClicked += 1;

    let minesFound = 0;

    if (tilesClicked == rows * columns - minesCount) {
        cashOut();
        document.getElementById("mines-count").innerText = "Full Clear";
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
