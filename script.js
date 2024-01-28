const gameBoard = (function () {
    const rows = 3;
    const cols = 3;
    const _board = [];

    for (let i = 0; i < rows; i++) {
        _board.push([]);
        for (let j = 0; j < cols; j++) {
            _board[i].push('-');
        }
    }

    function getBoard() {
        console.log(_board);
    }

    return {getBoard}
})()

gameBoard.getBoard();