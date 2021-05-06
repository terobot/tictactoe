const GameBoard = (() => {
    const gameBoard = [
        // ['','',''],
        // ['','',''],
        // ['','','']
    ]
    const setupGameBoard = (size) => {
        const root = document.querySelector(':root')
        root.style.setProperty('--cols', `repeat(${size}, 1fr)`)
        root.style.setProperty('--rows', `repeat(${size}, 1fr)`)
        root.style.setProperty('--width', 300+(size-1)*6 + 'px')
        root.style.setProperty('--height', 300+(size-1)*6 + 'px')
        root.style.setProperty('--mark-size', Math.round(0.8*(300/size)) + 'px')
        for(i=0; i<size; i++) {
            gameBoard.push([])
            for(j=0; j<size; j++) {
                gameBoard[i].push('')
            }
        }
    }
    const drawBoard = () => {
        const bodyHeader = document.getElementsByTagName('header')[0]
        const currentBoard = document.getElementsByClassName('game-container')[0]
        const gameBoardEl = document.createElement('div')
        gameBoardEl.setAttribute('class', 'game-container')
        gameBoard.forEach(e => {
            e.forEach(e => {
                var tempCellEl = document.createElement('div')
                tempCellEl.setAttribute('class', 'game-cell')
                tempCellEl.innerHTML = e
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
    const updateBoard = (index, mark) => {
        const row = calcRow(index)
        const col = calcCol(index, row+1)
        gameBoard[row][col] = mark
        drawBoard()
    }
    return { gameBoard, setupGameBoard, updateBoard }
})()
const Player = (name, type, mark) => {
    return {name, type, mark}
}
const GameManager = () => {

}

GameBoard.setupGameBoard(3)
GameBoard.updateBoard(5,'o')
GameBoard.updateBoard(1,'x')
GameBoard.updateBoard(9,'o')
GameBoard.updateBoard(7,'x')