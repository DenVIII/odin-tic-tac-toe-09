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
                if(_board[i][j].getValue() === '') {
                    availableCells.push([i, j])
                }
            }
        }
        return availableCells
    }

    function checkHorizontals(cell) {
        let rowIndex = cell[0]
        let cellValue = _board[rowIndex][0].getValue()
        let result = []

        for (let i = 0; i < rows; i++) {
            result.push([rowIndex, i])
            if (cellValue !== _board[rowIndex][i].getValue()) {
                result = false
                break 
            }
        }
        return result
    }

    function checkVerticals(cell) {
        let colIndex = cell[1]
        let cellValue = _board[0][colIndex].getValue()
        let result = []

        for (let i = 0; i < cols; i++) {
            result.push([i, colIndex])
            if (cellValue !== _board[i][colIndex].getValue()) {
                result = false
                break 
            }
        }
        return result
    }

    function checkDiagonals(cell) {
        let rowIndex = cell[0]
        let colIndex = cell[1]
        let cellValue = _board[rowIndex][colIndex].getValue()
        let result = []

        for (let i = 0; i < rows; i++) {
            result.push([i,i]) 
            if (cellValue !== _board[i][i].getValue()) {
                result = []
                break
            }
        }   

        if (result.length === rows) {
            console.log('First diagonal') //For testing
            return result
        }

        for (let i = 0; i < rows; i++) {
            result.push([i,rows - 1 - i])
            if (cellValue !== _board[i][rows - 1 - i].getValue()) {
                result = false
                break
            }
        }
        
        console.log('Second diagonal') //For testing
        return result
    }

    function printBoard() {
        const boardWithCellValues = _board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    function clearBoard() {
        _board.forEach(row => {
            row.forEach(cell => {
                cell.clearCell()
            })
        })
    }

    return {
        getBoard,
        getAvailableBoardCells,
        placeMark,
        printBoard,
        checkHorizontals,
        checkVerticals,
        checkDiagonals,
        clearBoard
    }
}

function Cell(){
    let value = ''

    function addMark(player) {
        value = player
    }

    function getValue() {
        return value
    }

    function clearCell() {
        value = ''
    }

    return {
        addMark,
        getValue,
        clearCell
    }
}

function GameController(
    playerOne = 'Player One',
    playerTwo = 'Player Two',
    gameMode
){
    const board = Gameboard()
    let activePlayer, turnCounter, winner
    const players = [
        { 
            name: playerOne,
            mark: 'X',
            wins: 0,
            bot: false
        },
        {
            name: playerTwo,
            mark: 'O',
            wins: 0,
            bot: false
        }
    ]

    setParameters()

    if (gameMode === 'option-vs-bot') {
        players[1].bot = true
    }

    function setParameters() {
        board.clearBoard()
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

    function getPlayerInfo(index, prop) {
        return players[index][prop]
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
        return cell
    }

    function checkForDraw() {
        if (board.getAvailableBoardCells().length === 0 && !winner){
            board.printBoard()
            return 'Draw'
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
        let result = board.checkHorizontals(cell) || board.checkVerticals(cell) || board.checkDiagonals(cell)
        if (result) {
            board.printBoard()
            winner = activePlayer
            winner.wins++
            return result
        }
    }

    function playRound(coordinates) {
        let result
        let cell = coordinates;

        printNewRound()

        if (gameMode === 'option-vs-bot' && activePlayer.bot) {
            cell = getCell()
        }
        console.log(`${getActivePlayer().name} placing ${getActivePlayer().mark} to ${cell[0] + 1} row, ${cell[1] + 1} column`)
        
        if (board.placeMark(cell, getActivePlayer().mark)) {
            result = checkTheWinConditions(cell) || checkForDraw()
            switchPlayersTurn()
            countTurns()
            if (result) {
                return result
            }
        }   
        else {
            console.log('Pick a valid cell!')
        }
    }

    function getWinner() {
        return winner.name
    }

    function rematch() {
        players.forEach(player => {
            player.wins = 0;
        })
    }

    return {
        playRound,
        getActivePlayer,
        getCurrentTurnNumber,
        setParameters,
        getBoard: board.getBoard,
        getWinner,
        getPlayerInfo,
        rematch
    }
}

function displayController(playerOne, playerTwo, gameMode) {
    const game = GameController(playerOne, playerTwo, gameMode)
    const gameField = document.querySelector('.game-field')
    const playerOneName = document.querySelector('.one>.player-name>span')
    const playerTwoName = document.querySelector('.two>.player-name>span')
    const playerOneWins = document.querySelector('.score-one')
    const playerTwoWins = document.querySelector('.score-two')
    const roundResultScreen = document.querySelector('.result-screen')
    const roundResultDisplay = document.querySelector('.result-display')
    const turnNumber = document.querySelector('.turn-number')
    const turnPlayer = document.querySelector('.turn-player')
    const restartGameBtn = document.querySelector('.restart')

    function updatePlayerNames() {
        playerOneName.textContent = playerOne
        playerTwoName.textContent = playerTwo
    }

    function updateGameBoard() {
        gameField.textContent = ''

        const board = game.getBoard()

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button')
                cellButton.classList.add('game-cell')

                cellButton.dataset.cell = [rowIndex, colIndex]
                cellButton.textContent = cell.getValue()
                gameField.appendChild(cellButton)
            })
        })

        playerOneWins.textContent = game.getPlayerInfo(0, 'wins')
        playerTwoWins.textContent = game.getPlayerInfo(1, 'wins')
        turnNumber.textContent = game.getCurrentTurnNumber()
        turnPlayer.textContent = game.getActivePlayer().name

        emulatePlayerTurn()
    }

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.cell

        if (!selectedCell) return

        const result = game.playRound(selectedCell.split(','))
        updateGameBoard()

        if (result) {
            changeResultScreenContent(result)
            crossLine(result)
            setTimeout(showGameResultScreen, 2000)
        }
    }

    function showGameResultScreen() {
        roundResultScreen.classList.toggle('active')
    }

    function changeResultScreenContent(result) {
        if (result === 'Draw') {       
            roundResultDisplay.textContent = `It's a draw!`
        } else {
            roundResultDisplay.innerHTML = `And the winner is: <span class="winner-name">${game.getWinner()}</span>`
        }
    }

    function closeGameResultScreen() {
        roundResultScreen.classList.toggle('active')
        game.setParameters()
        updateGameBoard()
    }

    function crossLine(indexArr) {
        indexArr.forEach(index => {
            const btn = document.querySelector(`[data-cell="${index.join(',')}"]`)
            btn.style = `
                border: 0.2em solid var(--main-color);
            `
        })
    }

    function restartGame(e) {
        game.setParameters()
        game.rematch()
        updateGameBoard()
    }

    function clearAllEventListeners() {
        gameField.removeEventListener('click', clickHandlerBoard)
        roundResultScreen.removeEventListener('click', closeGameResultScreen)
        restartGameBtn.removeEventListener('click', restartGame)
    }

    function emulatePlayerTurn() {
        if (gameMode === 'option-vs-bot' && game.getActivePlayer().name === 'Computer') {
            const result = game.playRound()
            setTimeout(updateGameBoard, 1500)

            if (result) {
                changeResultScreenContent(result)
                crossLine(result)
                setTimeout(showGameResultScreen, 2000)
            }
        }
    }

    gameField.addEventListener('click', clickHandlerBoard)
    roundResultScreen.addEventListener('click', closeGameResultScreen)
    restartGameBtn.addEventListener('click', restartGame)

    updatePlayerNames()
    updateGameBoard()

    return {
        restartGame,
        clearAllEventListeners
    }
}

function menuController() {
    let display, gameMode
    const gameModes = document.querySelectorAll('.option-radio')
    const playerOneName = document.querySelector('#player-one-input')
    const playerTwoName = document.querySelector('#player-two-input')
    const gameStartBtn = document.querySelector('.start-btn')
    const gameMenu = document.querySelector('.game-menu')
    const gameBoard = document.querySelector('.game-board')
    const gameIcons = document.querySelector('.game-icons')
    const endGameBtn = document.querySelector('.end')

    function startNewGame(e) {
        e.preventDefault()
        setDefaultPlayerNames()
        gameModes.forEach(radio => {
            if (radio.checked) {
                display = displayController(playerOneName.value, playerTwoName.value, gameMode)
                setTimeout(toggleVisibility, 300)
            }
        })
        
    }

    function toggleVisibility() {
        gameMenu.classList.toggle('hidden')
        gameBoard.classList.toggle('hidden')
        gameIcons.classList.toggle('hidden')
    }    

    function endGame(e) {
        e.preventDefault()
        playerOneName.value = ''
        playerTwoName.value = ''
        display.restartGame()
        display.clearAllEventListeners()
        setTimeout(toggleVisibility, 300)
    }

    function toggleActivePlayerInput()  {
        gameMode = this.id
        if (this.id === 'option-vs-bot') {
            playerTwoName.value = 'Computer'
            playerTwoName.setAttribute('disabled')
        } else {
            if (playerTwoName.value === 'Computer') {
                playerTwoName.value = ''
            }
            playerTwoName.setAttribute('enabled')
        }
    }
    
    function setDefaultPlayerNames() {
        if (playerOneName.value === '') {
            playerOneName.value = 'Player One'
        }
        if (playerTwoName.value === '') {
            playerTwoName.value = 'Player Two'
        }
    }

    gameStartBtn.addEventListener('click', startNewGame)
    endGameBtn.addEventListener('click', endGame)
    gameModes.forEach(mode => {
        mode.addEventListener('change', toggleActivePlayerInput)
    })
}

menuController()
