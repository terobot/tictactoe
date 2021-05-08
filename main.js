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
    return { gameBoard, setupGameBoard, updateBoard }
})()
const Player = (name, type, mark, score) => {
    return {name, type, mark, score}
}
const GameManager = (() => {
    const gameParameters = {
        gameType: 1,
        gameBoardSize: 3,
        difficulty: 'Easy',
        player1: Player('You', 'human', 'x', 0),
        player2: Player('Bot', 'ai', 'o', 0)
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
    // const drawStats = () => {
    //     const bodyHeader = document.getElementsByTagName('header')[0]
    //     const statsEl = document.createElement('div')
    //     const playerOneEl = document.createElement('div')
    //     const playerTwoEl = document.createElement('div')

    //     statsEl.append(playerOneEl)
    //     statsEl.append(playerTwoEl)
    //     bodyHeader.insertAdjacentElement('afterend',statsEl)
    // }
    const initDisplay = () => {
        const questionsEl = document.getElementsByClassName('questions')[0]
        const gameBoardEl = document.getElementsByClassName('game-container')[0]
        if(questionsEl) {
            while (questionsEl.lastElementChild) {
                questionsEl.lastElementChild.remove()
            }
            questionsEl.remove()
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
        console.log(gameParameters)
    }
    const initSinglePlayerGame = () => {
        gameParameters.gameType = 1
        gameParameters.player1 = Player('You', 'human', 'x', 0)
        gameParameters.player2 = Player('Bot', 'ai', 'o', 0)
        newGame()
    }
    const initTwoPlayerGame = () => {
        gameParameters.gameType = 2
        gameParameters.player1 = Player('Player1', 'human', 'x', 0)
        gameParameters.player2 = Player('Player2', 'human', 'o', 0)
        newGame()
    }
    const placeMark = (e) => {
        const element = e.target
        const index = Number(e.target.id)
        if(element.innerHTML==='') {
            GameBoard.updateBoard(element, index, gameParameters.player1.mark)
        }
        e.preventDefault()
    }
    return { newGame, placeMark }
})()

GameManager.newGame()
// GameBoard.updateBoard(5,'o')
// GameBoard.updateBoard(1,'x')
// GameBoard.updateBoard(9,'o')
// GameBoard.updateBoard(7,'x')