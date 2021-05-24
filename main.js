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
        difficulty: 'easy',
        player1: Player('You', 'human', 'x', 0, true),
        player2: Player('Bot', 'ai', 'o', 0, false),
        turn: 'x',
        botMakingMove: false
    }
    const drawQuestions = (gameType, size, difficulty) => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const questionsEl = document.createElement('div')
        const singlePlayerEl = document.createElement('div')
        const twoPlayerEl = document.createElement('div')
        const sizeThree = document.createElement('div')
        const sizeFive = document.createElement('div') 
        const easy = document.createElement('div')
        const impossible = document.createElement('div')
        singlePlayerEl.innerHTML = 'Single Player Game'
        singlePlayerEl.addEventListener('click', initSinglePlayerGame)
        twoPlayerEl.innerHTML = 'Two Player Game'
        twoPlayerEl.addEventListener('click', initTwoPlayerGame)
        sizeThree.innerHTML = '3x3'
        sizeThree.addEventListener('click', initThreeSizeGame)
        sizeFive.innerHTML = '5x5'
        sizeFive.addEventListener('click', initFiveSizeGame)
        easy.innerHTML = 'Easy'
        easy.addEventListener('click', initEasyGame)
        impossible.innerHTML = 'Impossible'
        impossible.addEventListener('click', initImpossibleGame)
        if(gameType===2) {
            singlePlayerEl.setAttribute('class', 'questions-button-disabled')
            twoPlayerEl.setAttribute('class', 'questions-button')
        }
        else {
            singlePlayerEl.setAttribute('class', 'questions-button')
            twoPlayerEl.setAttribute('class', 'questions-button-disabled')
        }
        if(size === 3) {
            sizeThree.setAttribute('class', 'questions-button')
            sizeFive.setAttribute('class', 'questions-button-disabled')
        }
        else {
            sizeThree.setAttribute('class', 'questions-button-disabled')
            sizeFive.setAttribute('class', 'questions-button')
        }
        if(difficulty === 'easy') {
            easy.setAttribute('class', 'questions-button')
            impossible.setAttribute('class', 'questions-button-disabled')
        }
        else {
            easy.setAttribute('class', 'questions-button-disabled')
            impossible.setAttribute('class', 'questions-button')
        }
        questionsEl.setAttribute('class', 'questions')
        questionsEl.append(singlePlayerEl)
        questionsEl.append(twoPlayerEl)
        questionsEl.append(sizeThree)
        questionsEl.append(sizeFive)
        if (gameType !== 2) {
            questionsEl.append(easy)
            if (size === 3) {
                questionsEl.append(impossible)
            }
        }
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
        const modalEl = document.getElementsByClassName('modal-overlay')[0]
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
        if(modalEl) {
            while (modalEl.lastElementChild) {
                modalEl.lastElementChild.remove()
            }
            modalEl.remove()
        }
    }
    const newGame = () => {
        initDisplay()
        drawQuestions(gameParameters.gameType, gameParameters.gameBoardSize, gameParameters.difficulty)
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
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        newGame()
    }
    const initTwoPlayerGame = () => {
        gameParameters.gameType = 2
        gameParameters.player1 = Player('Player1', 'human', 'x', 0, true)
        gameParameters.player2 = Player('Player2', 'human', 'o', 0, false)
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        newGame()
    }
    const initThreeSizeGame = () => {
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        gameParameters.gameBoardSize = 3
        newGame()
    }
    const initFiveSizeGame = () => {
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        gameParameters.gameBoardSize = 5
        gameParameters.difficulty = 'easy'
        newGame()
    }
    const initEasyGame = () => {
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        gameParameters.difficulty = 'easy'
        newGame()
    }
    const initImpossibleGame = () => {
        gameParameters.turn = 'x'
        gameParameters.botMakingMove = false
        gameParameters.difficulty = 'impossible' 
        newGame()
    }
    const playBotMove = (difficulty, botMark, board, size) => {
        const emptyIndexes = getEmptyIndexes(board)
        var index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
        if (difficulty === 'impossible') {
            index = minimax(board, 0, true)
        }
        const element = document.getElementById(`${index}`)
        setTimeout(f => GameBoard.updateBoard(element, index, botMark), 500)
        gameParameters.botMakingMove = false
        if(checkResult(board, botMark, size)) {
            switchMarks()
            gameParameters.turn = 'x'
            setTimeout(f => newGame(), 500)
        }
    }
    const minimax = (board, depth, isMaximizing) => {
        const emptyIndexes = getEmptyIndexes(board)
        const humanMark = gameParameters.player1.mark
        const botMark = gameParameters.player2.mark
        const size = gameParameters.gameBoardSize
        if (checkWinningRow(board, botMark, size)) {
            return 10-depth
        }
        else if (checkWinningRow(board, humanMark, size)) {
            return depth-10
        }
        else if (emptyIndexes.length === 0) return 0

        var moves = []

        emptyIndexes.forEach(index => {
            var move = {}
            var row = GameBoard.calcRow(index)
            var col = GameBoard.calcCol(index, row+1)
            board[row][col] = isMaximizing ? botMark : humanMark
            move.value = minimax(board, depth+1, !isMaximizing)
            move.index = index
            board[row][col] = ''
            moves.push(move)
        })

        var bestMove
        if (isMaximizing) {
            var bestValue = -Infinity
            moves.forEach(move => {
                if (move.value > bestValue) {
                    bestValue = move.value
                    bestMove = move.index
                }
            })
            if (depth !== 0) return bestValue
        }
        else {
            var bestValue = Infinity
            moves.forEach(move => {
                if (move.value < bestValue) {
                    bestValue = move.value
                    bestMove = move.index
                }
            })
            if (depth !== 0) return bestValue
        }
        return bestMove
    }
    const getEmptyIndexes = (board) => {
        const emptyIndexes = []
        var index = 0
        for(i=0; i<board.length; i++) {
            for(j=0; j<board[i].length; j++) {
                index++
                if(board[i][j] === '') {
                    emptyIndexes.push(index)
                }
            }
        }
        return emptyIndexes
    }
    const checkWinningRow = (board, mark, size) => {
        var rowStr = ''
        var colStr = ''
        var diaStr = ''
        var winStr = size === 3 ? mark.repeat(3) : mark.repeat(4)
        for(i=0; i<size; i++) {
            for(j=0; j<size; j++) {
                rowStr+=board[i][j]
            }
            if (rowStr.search(winStr) !== -1) return true
            rowStr = ''
        }
        for(i=0; i<size; i++) {
            for(j=0; j<size; j++) {
                colStr+=board[j][i]
            }
            if (colStr.search(winStr) !== -1) return true
            colStr = ''
        }
        for(a=0; a<size; a++) {
            for(i=0; i<size; i++) {
                for(j=0; j<size; j++) {
                    if (i===j-a) diaStr+=board[i][j] ? board[i][j] : '-'
                }
                if (diaStr.search(winStr) !== -1) return true
                if (i === size-1) diaStr = ''
            }
        }
        for(a=0; a<size; a++) {
            for(i=0; i<size; i++) {
                for(j=0; j<size; j++) {
                    if (i-a===j) diaStr+=board[i][j] ? board[i][j] : '-'
                }
                if (diaStr.search(winStr) !== -1) return true
                if (i === size-1) diaStr = ''
            }
        }
        for(a=0; a<size; a++) {
            for(i=0; i<size; i++) {
                for(j=size-1; j>-1; j--) {
                    if (i === size-1-j-a) diaStr+=board[i][j] ? board[i][j] : '-'
                }
                if (diaStr.search(winStr) !== -1) return true
                if (i === size-1) diaStr = ''
            }
        }
        for(a=0; a<size; a++) {
            for(i=0; i<size; i++) {
                for(j=size-1; j>-1; j--) {
                    if (i-a === size-1-j) diaStr+=board[i][j] ? board[i][j] : '-'
                }
                if (diaStr.search(winStr) !== -1) return true
                if (i === size-1) diaStr = ''
            }
        }
        return false
    }
    const changeTurn = (turn) => {
        gameParameters.turn = turn === 'x' ? 'o' : 'x'
    }
    const drawModal = (player, type) => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const modalOverlay = document.createElement('div')
        const modal = document.createElement('div')
        const modalGuts = document.createElement('div')
        modalOverlay.setAttribute('class', 'modal-overlay')
        modal.setAttribute('class', 'modal')
        modalGuts.setAttribute('class', 'modal-guts')
        if(type === 'win') {
            modalGuts.innerHTML = player.name !== 'You' ? `${player.name} wins!` : `${player.name} won!`
        }
        if(type === 'draw') {
            modalGuts.innerHTML = 'Draw!'
        }
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
    const checkResult = (board, mark, size) => {
        if(checkWinningRow(board, mark, size)) {
            if(mark === gameParameters.player1.mark) {
                drawModal(gameParameters.player1, 'win')
                gameParameters.player1.score += 1
                return true
            }
            else {
                drawModal(gameParameters.player2, 'win')
                gameParameters.player2.score += 1
                return true
            }
        }
        else if(getEmptyIndexes(GameBoard.gameBoard).length === 0) {
            drawModal(null, 'draw')
            return true
        }
        return false
    }
    const controlGamePlay = (gameType) => {
        const emptyIndexes = getEmptyIndexes(GameBoard.gameBoard)
        if (emptyIndexes.length !== 0 & gameType === 1) {
            playBotMove(gameParameters.difficulty, gameParameters.player2.mark, GameBoard.gameBoard, gameParameters.gameBoardSize)
        }
        else if (emptyIndexes.length !== 0 & gameType === 2) {
            changeTurn(gameParameters.turn)
        }
    }
    const placeMark = (e) => {
        const element = e.target
        const index = Number(e.target.id)
        const board = GameBoard.gameBoard
        const turn = gameParameters.turn
        const size = gameParameters.gameBoardSize
        const type = gameParameters.gameType
        if (!gameParameters.botMakingMove) {
            if(element.innerHTML==='') {
                GameBoard.updateBoard(element, index, turn)
                if (type === 1) {
                    gameParameters.botMakingMove = true
                }
                if(!checkResult(board, turn, size)) {
                    controlGamePlay(type)
                }
                else {
                    switchMarks()
                    gameParameters.botMakingMove = false
                    gameParameters.turn = 'x'
                    setTimeout(f => newGame(), 1000)
                }
            }  
        } 
        e.preventDefault()
    }
    return { newGame, placeMark }
})()

GameManager.newGame()