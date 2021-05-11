const GameBoard = (() => {
    const gameBoard = []
    const setupGameBoard = (size) => {
        const root = document.querySelector(':root')
        root.style.setProperty('--cols', `repeat(${size}, 1fr)`)
        root.style.setProperty('--rows', `repeat(${size}, 1fr)`)
        root.style.setProperty('--width', 300+(size-1)*6 + 'px')
        root.style.setProperty('--height', 300+(size-1)*6 + 'px')
        root.style.setProperty('--mark-size', Math.round(0.8*(300/size)) + 'px')
        while (gameBoard.length>0) {
            gameBoard.pop()
        }
        for(i=0; i<size; i++) {
            gameBoard.push([])
            for(j=0; j<size; j++) {
                gameBoard[i].push('')
            }
        }
        drawBoard()
    }
    const drawBoard = () => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const currentBoard = document.getElementsByClassName('game-container')[0]
        const gameBoardEl = document.createElement('div')
        var cellIdCount = 1
        gameBoardEl.setAttribute('class', 'game-container')
        gameBoard.forEach(e => {
            e.forEach(e => {
                var tempCellEl = document.createElement('div')
                tempCellEl.setAttribute('class', 'game-cell')
                tempCellEl.innerHTML = e
                tempCellEl.id = cellIdCount
                cellIdCount++
                tempCellEl.addEventListener('click', GameManager.placeMark)
                gameBoardEl.append(tempCellEl)
            })
        })
        if(!currentBoard){
            bodyHeader.insertAdjacentElement('afterend', gameBoardEl)
        }
        else {
            currentBoard.innerHTML = gameBoardEl.innerHTML
        }
    }
    const calcRow = (index) => {
        const rowQty = gameBoard.length
        for(i=1; rowQty*i<rowQty**2+1; i++) {
            if(index<rowQty*i+1) {
                return i-1
            }
        }
    }
    const calcCol = (index, row) => {
        const colQty = gameBoard.length
        for(i=0; i<colQty; i++) {
            if(index===colQty*row-colQty+i+1) {
                return i
            }
        }
    }
    const updateBoard = (element, index, mark) => {
        const row = calcRow(index)
        const col = calcCol(index, row+1)
        gameBoard[row][col] = mark
        element.innerHTML = mark
    }
    return { gameBoard, setupGameBoard, updateBoard, calcCol, calcRow }
})()
const Player = (name, type, mark, score, turn) => {
    return {name, type, mark, score, turn}
}
const GameManager = (() => {
    const gameParameters = {
        gameType: 1,
        gameBoardSize: 3,
        difficulty: 'Easy',
        player1: Player('You', 'human', 'x', 0, true),
        player2: Player('Bot', 'ai', 'o', 0, false),
        turn: 'x'
    }
    const drawQuestions = (gameType) => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const questionsEl = document.createElement('div')
        const singlePlayerEl = document.createElement('div')
        const twoPlayerEl = document.createElement('div')
        singlePlayerEl.innerHTML = 'Single Player Game'
        singlePlayerEl.addEventListener('click', initSinglePlayerGame)
        twoPlayerEl.innerHTML = 'Two Player Game'
        twoPlayerEl.addEventListener('click', initTwoPlayerGame)
        if(gameType===2) {
            singlePlayerEl.setAttribute('class', 'questions-button-disabled')
            twoPlayerEl.setAttribute('class', 'questions-button')
        }
        else {
            singlePlayerEl.setAttribute('class', 'questions-button')
            twoPlayerEl.setAttribute('class', 'questions-button-disabled')
        }
        questionsEl.setAttribute('class', 'questions')
        questionsEl.append(singlePlayerEl)
        questionsEl.append(twoPlayerEl)
        bodyHeader.insertAdjacentElement('afterend',questionsEl)
    }
    const createStatsEl = () => {
        const statsEl = document.createElement('div')
        statsEl.setAttribute('class', 'stats')
        return statsEl
    }
    const createPlayerStatsEl = (player) => {
        const playerStatsEl = document.createElement('div')
        const nameAndMarkEl = document.createElement('div')
        const scoreEl = document.createElement('div')
        playerStatsEl.setAttribute('class', 'stats-player')
        nameAndMarkEl.innerHTML = `${player.name} play '${player.mark.toUpperCase()}'`
        playerStatsEl.append(nameAndMarkEl)
        scoreEl.innerHTML = player.score
        playerStatsEl.append(scoreEl)
        return playerStatsEl
    }
    const drawStats = () => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const statsEl = createStatsEl()
        const playerOneStatsEl = createPlayerStatsEl(gameParameters.player1)
        const playerTwoStatsEl = createPlayerStatsEl(gameParameters.player2)
        statsEl.append(playerOneStatsEl)
        statsEl.append(playerTwoStatsEl)
        bodyHeader.insertAdjacentElement('afterend',statsEl)
    }
    const initDisplay = () => {
        const questionsEl = document.getElementsByClassName('questions')[0]
        const statsEl = document.getElementsByClassName('stats')[0]
        const gameBoardEl = document.getElementsByClassName('game-container')[0]
        if(questionsEl) {
            while (questionsEl.lastElementChild) {
                questionsEl.lastElementChild.remove()
            }
            questionsEl.remove()
        }
        if(statsEl) {
            while (statsEl.lastElementChild) {
                statsEl.lastElementChild.remove()
            }
            statsEl.remove()
        }
        if(gameBoardEl) {
            while (gameBoardEl.lastElementChild) {
                gameBoardEl.lastElementChild.remove()
            }
            gameBoardEl.remove()
        }
    }
    const newGame = () => {
        initDisplay()
        drawQuestions(gameParameters.gameType)
        GameBoard.setupGameBoard(gameParameters.gameBoardSize)
        drawStats()
        if(gameParameters.gameType === 1 & gameParameters.player2.mark === gameParameters.turn) {
            playBotMove(gameParameters.difficulty, gameParameters.player2.mark, GameBoard.gameBoard, gameParameters.gameBoardSize)
            changeTurn(gameParameters.turn)
        }
        console.log(gameParameters)
    }
    const initSinglePlayerGame = () => {
        gameParameters.gameType = 1
        gameParameters.player1 = Player('You', 'human', 'x', 0, true)
        gameParameters.player2 = Player('Bot', 'ai', 'o', 0, false)
        newGame()
    }
    const initTwoPlayerGame = () => {
        gameParameters.gameType = 2
        gameParameters.player1 = Player('Player1', 'human', 'x', 0, true)
        gameParameters.player2 = Player('Player2', 'human', 'o', 0, false)
        newGame()
    }
    const getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const playBotMove = (difficulty, botMark, board, size) => {
        if (difficulty === 'Easy') {
            var movePlayed = false
            while (!movePlayed) {
                var index = getRandomIntInclusive(1, size*size)
                var element = document.getElementById(`${index}`)
                if (element.innerHTML === '') {
                    GameBoard.updateBoard(element, index, botMark)
                    movePlayed = true
                }
            }
        }
    }
    const checkForEmptyCell = (board) => {
        var emptyCellExist = false
        board.forEach(row => {
            row.forEach(col => {
                if (col === '') {
                    emptyCellExist = true
                }
            })
        })
        return emptyCellExist
    }
    const checkWinningRow = (index, mark, size) => {
        const row = GameBoard.calcRow(index)
        const col = GameBoard.calcCol(index, row+1)
        const board = GameBoard.gameBoard
        console.log('Row: ' + row)
        console.log('Col: ' + col + ' Size:' + size)
        console.log(board)
        if (row-1 >= 0 & row+1 < size) {
            if (board[row-1][col] === mark & board[row+1][col] === mark) {
                return true
            }
        }
        if (row-1 >= 0 & row+1 < size & col-1 >= 0 & col+1 < size) {
            if (board[row-1][col+1] === mark & board[row+1][col-1] === mark) {
                return true
            }
            if (board[row+1][col+1] === mark & board[row-1][col-1] === mark) {
                return true
            }
        }
        if (col-1 >= 0 & col+1 < size) {
            if (board[row][col+1] === mark & board[row][col-1] === mark) {
                return true
            }
        }
        if (row-2 >= 0) {
            if (board[row-1][col] === mark & board[row-2][col] === mark) {
                return true
            }
        }
        if (col-2 >= 0) {
            if (board[row][col-1] === mark & board[row][col-2] === mark) {
                return true
            }
        }
        if (row+2 < size) {
            if (board[row+1][col] === mark & board[row+2][col] === mark) {
                return true
            }
        }
        if (col+2 < size) {
            if (board[row][col+1] === mark & board[row][col+2] === mark) {
                return true
            }
        }
        if (row-2 >= 0 & col+2 < size) {
            if (board[row-1][col+1] === mark & board[row-2][col+2] === mark) {
                return true
            }
        }
        if (row-2 >= 0 & col-2 >= 0) {
            if (board[row-1][col-1] === mark & board[row-2][col-2] === mark) {
                return true
            }
        }
        if (row+2 < size & col+2 < size) {
            if (board[row+1][col+1] === mark & board[row+2][col+2] === mark) {
                return true
            }
        }
        if (row+2 < size & col-2 < size) {
            if (board[row+1][col-1] === mark & board[row+2][col-2] === mark) {
                return true
            }
        }
        return false
    }
    const changeTurn = (turn) => {
        gameParameters.turn = turn === 'x' ? 'o' : 'x'
    }
    const drawWinnerModal = (player) => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const modalOverlay = document.createElement('div')
        const modal = document.createElement('div')
        const modalGuts = document.createElement('div')
        modalOverlay.setAttribute('class', 'modal-overlay')
        modal.setAttribute('class', 'modal')
        modalGuts.setAttribute('class', 'modal-guts')
        modalGuts.innerHTML = player.name !== 'You' ? `${player.name} wins!` : `${player.name} won!`
        modal.append(modalGuts)
        modalOverlay.append(modal)
        bodyHeader.insertAdjacentElement('afterend',modalOverlay)
    }
    const switchMarks = () => {
        const mark1 = gameParameters.player1.mark
        const mark2 = gameParameters.player2.mark
        gameParameters.player1.mark = mark2
        gameParameters.player2.mark = mark1
    }
    const controlGamePlay = (gameType) => {
        const isNotFull = checkForEmptyCell(GameBoard.gameBoard)
        if (isNotFull & gameType === 1) {
            playBotMove(gameParameters.difficulty, gameParameters.player2.mark, GameBoard.gameBoard, gameParameters.gameBoardSize)
        }
        else if (isNotFull & gameType === 2) {
            changeTurn(gameParameters.turn)
        }
    }
    const placeMark = (e) => {
        const element = e.target
        const index = Number(e.target.id)
        if(element.innerHTML==='') {
            GameBoard.updateBoard(element, index, gameParameters.turn)
        }
        if(checkWinningRow(index, gameParameters.turn, gameParameters.gameBoardSize)) {
            if(gameParameters.turn === gameParameters.player1.mark) {
                drawWinnerModal(gameParameters.player1)
                gameParameters.player1.score += 1
                switchMarks()
                gameParameters.turn = 'x'
            }
            else {
                drawWinnerModal(gameParameters.player2)
                gameParameters.player1.score += 1
                switchMarks()
                gameParameters.turn = 'x'
            }
        }
        else {
            controlGamePlay(gameParameters.gameType)
        }
        e.preventDefault()
    }
    return { newGame, placeMark }
})()

GameManager.newGame()