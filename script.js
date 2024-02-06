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
        console.log('Horizontal') //For testing
        return true
    }

    function checkVerticals(cell) {
        let colIndex = cell[1]
        let cellValue = _board[0][colIndex].getValue()

        for (let i = 0; i < cols; i++) {
            if (cellValue !== _board[i][colIndex].getValue()) {
                return false
            }
        }
        console.log('Vertical') //For testing
        return true
    }

    function checkDiagonals(cell) {
        let rowIndex = cell[0]
        let colIndex = cell[1]
        let cellValue = _board[rowIndex][colIndex].getValue()
        let isAllMatch = true

        for (let i = 0; i < rows; i++) {
            if (cellValue !== _board[i][i].getValue()) {
                isAllMatch = false
                break
            }
        }   

        if (isAllMatch) {
            console.log('First diagonal') //For testing
            return isAllMatch
        } else {
            isAllMatch = true
        }

        for (let i = 0; i < rows; i++) {
            if (cellValue !== _board[i][rows - 1 - i].getValue()) {
                isAllMatch = false
                break
            }
        }
        
        console.log('Second diagonal') //For testing
        return isAllMatch
    }

    function printBoard() {
        const boardWithCellValues = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {getBoard, getAvailableBoardCells, placeMark, printBoard, checkHorizontals, checkVerticals, checkDiagonals}
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
    let board, activePlayer, turnCounter, winner
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

    setParameters()

    function setParameters() {
        board = Gameboard()
        activePlayer = players[0]
        turnCounter = 1
        winner = undefined;
    }

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

        cell.push(Math.floor(Math.random() * 3))    // This is for quick random tests
        cell.push(Math.floor(Math.random() * 3))

        /* cell.push(prompt('row') - 1)
        cell.push(prompt('column') - 1) */

        return cell
    }

    function checkForDraw() {
        if (board.getAvailableBoardCells().length === 0 && !winner){
            board.printBoard()
            return true
        }
        return false
    }

    function countTurns() {
        turnCounter++
    }

    function getCurrentTurnNumber() {
        return turnCounter
    }

    function checkTheWinConditions(cell) {
        if (board.checkHorizontals(cell) || board.checkVerticals(cell) || board.checkDiagonals(cell)) {
            board.printBoard()
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

    function announceGameResults() {
        if (winner) {
            console.log(`And the winner is ${winner.name}`)
        } else {
            console.log(`It's a draw!`)
        }
    }

    function askForRematch() {
        return prompt('Want to play another game?(Yes/No)', 'Yes').toLowerCase() === 'yes'
    }

    function playGame() {
        setParameters()
        while (!checkForDraw() && !winner) {
            playRound(getCell())
        }
        announceGameResults()
        return false //For now its set as false, but here should be askForRematch()
    }

/*     while (playGame()) {
        //
    } */
    return {
        playRound,
        getActivePlayer,
        getCurrentTurnNumber,
        getBoard: board.getBoard
    }
}

function displayController() {
    const game = GameController()
    const gameSection = document.querySelector('.game-board')
    const gameField = document.querySelector('.game-field')

    function updateGameBoard() {
        gameField.textContent = ''

        const board = game.getBoard()

        board.forEach(row => {
            row.forEach(cell => {
                const cellButton = document.createElement('button')
                cellButton.classList.add('game-cell')

                cellButton.textContent = cell.getValue()
                gameField.appendChild(cellButton)
            })
        })

    }

    updateGameBoard()
}

displayController()