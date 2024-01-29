function Gameboard() {
    const rows = 3
    const cols = 3
    const _board = []

    for (let i = 0; i < rows; i++) {
        _board.push([])
        for (let j = 0; j < cols; j++) {
            _board[i].push(Cell())
        }
    }
    /* _board[0][0].addMark()
    console.log(_board[0][0].getValue()) */
    function placeMark(cell, player) {
        const availableCells = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if(_board[i][j].getValue() === '-') {
                    availableCells.push([i, j])
                }
            }
        }

        if (availableCells.length === 0) return

        if (JSON.stringify(availableCells).includes(cell.toString())) {
            _board[cell[0]][cell[1]].addMark(player)
        }
    }

    function getBoard() {
        return _board
    }

    function printBoard() {
        const boardWithCellValues = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {getBoard, placeMark, printBoard}
}

function Cell(){
    let value = '-'

    function addMark(player) {
        value = player
    }

    function getValue() {
        return value
    }

    return {addMark, getValue}
}

function GameController(
    playerOne = 'Player One',
    playerTwo = 'Player Two'
){
    const board = Gameboard()
    const players = [
        { 
            name: playerOne,
            mark: 'X'
        },
        {
            name: playerTwo,
            mark: 'O'

        }
    ]
    board.printBoard()

    board.placeMark([1,1], players[0].mark)
    board.printBoard()
}

const game = GameController();