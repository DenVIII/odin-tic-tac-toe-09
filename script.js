function Gameboard() {
    const rows = 2
    const cols = 2
    const _board = []

    for (let i = 0; i < rows; i++) {
        _board.push([])
        for (let j = 0; j < cols; j++) {
            _board[i].push(Cell())
        }
    }

    function placeMark(cell, player) {
        const availableCells = getAvailableBoardCells()

        if (JSON.stringify(availableCells).includes(cell.toString())) {
            _board[cell[0]][cell[1]].addMark(player)
        }
    }

    function getBoard() {
        return _board
    }

    function getAvailableBoardCells() {
        const availableCells = []

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if(_board[i][j].getValue() === '-') {
                    availableCells.push([i, j])
                }
            }
        }

        return availableCells
    }

    function printBoard() {
        const boardWithCellValues = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {getBoard, getAvailableBoardCells, placeMark, printBoard}
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

    let activePlayer = players[0]
    let turnCounter = 1

    function switchPlayersTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    function getActivePlayer() {
        return activePlayer
    }

    function printNewRound() {
        board.printBoard()
        console.log(`Round ${turnCounter}!`)
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    function getCell() {
        const cell = []

        cell.push(prompt('row') - 1)
        cell.push(prompt('column') - 1)

        return cell
    }

    function checkForDraw() {
        if (board.getAvailableBoardCells().length === 0){
            console.log('Draw!')
            return true
        }
        return false
    }

    function countTurns() {
        turnCounter++
    }

    function playRound(cell) {
        printNewRound()
        console.log(`${getActivePlayer().name} placing ${getActivePlayer().mark} to ${cell[0] + 1} row, ${cell[1] + 1} column`)
        board.placeMark(cell, getActivePlayer().mark)

        switchPlayersTurn()
        countTurns()
    }
    
    while (!checkForDraw()) {
        playRound(getCell())
    }
}

const game = GameController();