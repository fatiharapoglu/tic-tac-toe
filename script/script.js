const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const setField = (index, sign) => {
        board[index] = sign;
    };
    const getField = (index) => {
        return board[index];
    };
    const reset = () => {
        for (let index = 0; index < board.length; index++) {
            board[index] = "";
        }
    };
    return { setField, getField, reset };
})();

const Player = (sign) => {
    this.sign = sign;
    const getSign = () => {
        return sign;
    };
    return {getSign};
};

const Display = (() => {
    const squareDOM = document.querySelectorAll(".square");
    const messageDOM = document.querySelector("#message");
    const restartBtnDOM = document.querySelector("#restart");
    const renderGameboard = () => {
        for (let index = 0; index < squareDOM.length; index++) {
            squareDOM[index].textContent = Gameboard.getField(index);
        }
    };
    squareDOM.forEach((square) => square.addEventListener("click", (event) => {
        if (Controller.getIsGame() || event.target.textContent !== "") return;
        Controller.playRound(parseInt(event.target.dataset.index));
        renderGameboard();
    }));
    restartBtnDOM.addEventListener("click", () => {
        Gameboard.reset();
        Controller.reset();
        renderGameboard();
        setMessageDOM("Player X's turn");
    });
    const setResult = (winner) => {
        if (winner === "Draw") {
            setMessageDOM("A draw!");
        } else {
            setMessageDOM(`Player ${winner} has won!`);
        }
    };
    const setMessageDOM = (message) => {
        messageDOM.textContent = message;
    };
    return { setResult, setMessageDOM };
})();

const Controller = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isGame = false;
    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
    const getIsGame = () => {
        return isGame;
    };
    const reset = () => {
        round = 1;
        isGame = false;
    };
    const playRound = (index) => {
        Gameboard.setField(index, getCurrentPlayerSign());
        if (checkGame(index)) {
            Display.setResult(getCurrentPlayerSign());
            isGame = true;
            return;
        }
        if (round === 9) {
            Display.setResult("Draw");
            isGame = true;
            return;
        }
        round++;
        Display.setMessageDOM(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
    };
    const checkGame = (index) => {
        const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        return winConditions.filter((combination) => combination.includes(index)).some((possibleCombination) =>
            possibleCombination.every((index) => Gameboard.getField(index) === getCurrentPlayerSign()
        ));
    };
    return { playRound, getIsGame, reset };
})();