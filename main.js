const GameBoard = (() => {
    const gameBoard = [
        ['','',''],
        ['','',''],
        ['','','']
    ]
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
    const updateBoard = (index, mark) => {
        const row = (index<4) ? 0 : (index<7) ? 1 : 2
        const col = (index in {1:null, 4:null, 7:null}) ? 0 : (index in {2:null, 5:null, 8:null}) ? 1 : 2
        gameBoard[row][col] = mark
        drawBoard()
    }
    return { updateBoard }
})()
const Player = (name, type, mark) => {
    return {name, type, mark}
}
const GameManager = () => {

}

GameBoard.updateBoard(5,'o')
GameBoard.updateBoard(1,'x')
GameBoard.updateBoard(9,'o')
GameBoard.updateBoard(7,'x')