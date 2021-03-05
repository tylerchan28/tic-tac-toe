// functionality of the board itself
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const setBoard = (boardIndex, marker) => { // puts marker on the board
        board[boardIndex] = marker;
    }
    const getBoard = (boardIndex) => { // returns the marker on the board's index
        return board[boardIndex];
    }
    const resetBoard = () => { //resets board to 9 empty strings
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        };
    };
    return {setBoard, getBoard, resetBoard};
})(); //making into module

// making players
const playerFactory = (marker) => {
    this.marker = marker;

    const getPlayerMarker = () => { //used to grab the current  player's marker
        return marker;
    } 
    return {getPlayerMarker}
};

// controlling all displays and buttons
const displayController = (() => {
    const resetBtn = document.querySelector(`.reset-button`);
    const gridElements = document.querySelectorAll(`.grid-cell`);
    const msg = document.querySelector(`.game-text`);

    const setMessage = (message) => { // adds a message to the game-text div
        msg.textContent = message;
    }

    resetBtn.addEventListener(`click`, (e) => { //fully resets the game
        gameBoard.resetBoard();
        game.reset();
        msg.textContent = "";
        updateBoard();
    })

    const updateBoard = () => { //loops through the grid and updates the text to the getBoard marker at that index
        for (let i = 0; i < 9; i++) {
            gridElements[i].textContent = gameBoard.getBoard(i);
        }
    }

    gridElements.forEach((gridCell) => 
        gridCell.addEventListener(`click`, (e) => {
            if (e.target.textContent !== "" || game.isGameOver()) { // handles cells with markers or if game is over
                return;
            } else {
                game.playRound(parseInt(e.target.dataset.cell)); // grabs the data-cell number to use as an index in playRound
                updateBoard(); // adds the marker to the board, matches board array
            }
        }))
    gridElements.forEach((gridCell) => // styling for markers
    gridCell.addEventListener(`click`, (e) => {
        if (e.target.textContent === "X") {
            e.target.style.color = "#c94989";
        } else {
            e.target.style.color= "#49c949";
        }
    }))
    return {setMessage};
})();

// controlling the game 
const game = (() => {
    // initializing players and turn 
    const playerX = playerFactory("X");
    const playerO = playerFactory("O");
    var turn = 1;
    var gameOver = false;
    
    const playRound = (index) => {
        gameBoard.setBoard(index, currentPlayerMarker()); //adding markers to the board
        if (winCheck()) { // checks if a player won
            displayController.setMessage(`Player ${currentPlayerMarker()} wins`);
            gameOver = true;
            return;
        }
        if (turn === 9) { // checks if game is a tie
            displayController.setMessage("It's a tie");
            gameOver = true;
            return;
        }
        turn++;
    }

    const currentPlayerMarker = () => { // function to rotate turns between players
        if (turn % 2 === 1) {
            return playerX.getPlayerMarker();
        } else {
            return playerO.getPlayerMarker();
        }
    }


    const winCheck = () => { 
        const winners = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];
        return winners
            // .filter((combo) => combo.includes(index))
            .some((boardIndices) => // .some tests whether any of the conditions in winners is true
                boardIndices.every( // .every tests if every element (index) of the boardIndices is equal to the player's marker
                    (index) => gameBoard.getBoard(index) === currentPlayerMarker()
                ) //in one of the conditions, is every index of arrays the current player's marker? winCheck = true: winCheck = false
            )
        };
    const isGameOver = () => { //returns gameOver to the onclick event of the grid cells
        return gameOver;
    };
    const reset = () => {
        turn = 1;
        gameOver = false;
    };
    return {playRound, isGameOver, reset, currentPlayerMarker};
})();