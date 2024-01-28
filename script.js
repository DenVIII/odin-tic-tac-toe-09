const gameBoard = (function () {
    const _board = [
        ['-','-','-'],
        ['-','-','-'],
        ['-','-','-']
    ]
    function getBoard() {
        console.log(_board);
    }

    return {getBoard}
})()

gameBoard.getBoard();