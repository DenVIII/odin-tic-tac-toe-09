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
            return true
        } 
        return false
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

    function checkHorizontals(cell) {
        let rowIndex = cell[0]
        let cellValue = _board[rowIndex][0].getValue()

        for (let i = 1; i < rows; i++) {
            if (cellValue !== _board[rowIndex][i].getValue()) {
                return false
            }
        }
        return true
    }

    function checkVerticals(cell) {
        
    }

    function checkDiagonals(cell) {

    }

    function printBoard() {
        const boardWithCellValues = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {getBoard, getAvailableBoardCells, placeMark, printBoard, checkHorizontals}
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
    let winner;

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

    function checkTheWinConditions(cell) {
        if (board.checkHorizontals(cell)) {
            winner = activePlayer
        }

    }

    function playRound(cell) {
        printNewRound()
        console.log(`${getActivePlayer().name} placing ${getActivePlayer().mark} to ${cell[0] + 1} row, ${cell[1] + 1} column`)
        
        if (board.placeMark(cell, getActivePlayer().mark)) {
            checkTheWinConditions(cell)
            switchPlayersTurn()
            countTurns()
        } else {
            console.log('Pick a valid cell!')
        }
        
    }
    
    while (!checkForDraw() && !winner) {
        playRound(getCell())
    }

    if (winner) {
        console.log(`And the winner is ${winner.name}`)
    }
}

const game = GameController();