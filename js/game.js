'use strict'

const MINE = '💣'
const FLAG = '🚩'


var gBoard;
var gBoardSize = 4;
var gLives;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gLevel = {
    size: 4,
    mines: 2
}


function restat() {
    init()
}

function init() {
    gLives = 3;
    gBoard = buildBoard()
    addMines();
    renderBoard(gBoard);
    checkGameOver();
}

function changeLevel(elBtn, size, mines, levelName) {
    gLevel.size = size
    gLevel.mines = mines
    gBoardSize = size
    elBtn.innerHTML = levelName
    init()
}


function buildBoard() {
    var gBoard = [];
    for (var i = 0; i < gBoardSize; i++) {
        gBoard.push([]);
        for (var j = 0; j < gBoardSize; j++) {
            var cell = {
                minesAroundCount: setMinesNegsCount(),
                isShown: false,
                isMine: false,
                isMarked: false

            };
            gBoard[i][j] = cell;

        }
    }

    // console.table(gBoard);
    return gBoard;
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < gBoardSize; i++) {
        strHTML += '<tr>';

        for (var j = 0; j < gBoardSize; j++) {
            
            var currCell = '';
            var className = `cell cell-${i}-${j}`;
            var classGame = (!board[i][j].isShown) ? 'hide' : 'show';
            
            

            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) {
                    currCell = MINE;
                    // elCell.innerText=MINE;

                } else {
                    currCell = setMinesNegsCount(board, i, j)

                }
            }

            // var currCell = gBoard[i][j].isMine;
            // if (currCell === false) {
            //     currCell = 0

            // }
            // if (currCell) {
            //     currCell = MINE

            // } else {
            //     currCell = setMinesNegsCount(board, i, j)

            // }
            // if (board[i][j].isMarked) {
            //     board[i][j].isMarked = FLAG
            // }
            strHTML += `<td class="${className}" class="${classGame}" onclick="cellClicked(${i},${j},this)"oncontextmenu="cellMarked(this, ${i}, ${j})">${currCell}</td>`;
        }
        var elBoard = document.querySelector('.board-container');
        elBoard.innerHTML = strHTML;
        strHTML += '</tr>';
    }

    console.log(strHTML);
}


function getEmptyPos() {
    var res = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine === false) res.push({ i: i, j: j });
        }
    }

    if (res.length) return res[getRandomIntInclusive(0, res.length - 1)];
    return null;

}

function addMines() {
    var n = 0
    while (n < gLevel.mines) {

        var pos = getEmptyPos();
        if (!pos) return;
        for (var i = 0; i < gLevel.size; i++) {
            gBoard[pos.i][pos.j].isMine = true;

        }
        n++;
    }

}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    if (count === 0) { return 0 } else { return count }


}


function cellClicked(i, j, elCell) {
    gGame.isOn = true;
    
    if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    console.table(gBoard);
    elCell.style.backgroundColor = 'rgb(228, 115, 134)';
    elCell.innerText=setMinesNegsCount(gBoard, i, j)
    gGame.shownCount++;
        if (gBoard[i][j].isMine) {
        elCell.style.backgroundColor = 'red';
        elCell.innerText=MINE
        lives()
    }
    // console.table(gBoard);
    checkGameOver();
    renderBoard()
}

function cellMarked(elCell, i, j) {
    gGame.isOn = true;
    if (gBoard[i][j].isShown) return;
    window.event.preventDefault()
    if (elCell.classList.contains('marked')) {
        elCell.classList.remove('marked')
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
    } else {
        elCell.classList.add('marked')
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
    }
    checkGameOver();
    renderBoard();
}

function lives() {
    gLives--;
    var elLives = document.querySelector('.lives');
    if (gLives === 3) {
        elLives.innerText = 'lives:💖💖💖';
    } else if (gLives === 2) {
        elLives.innerText = 'lives:💖💖';
    } else if (gLives === 1) {
        elLives.innerText = 'lives:💖';
    } else if (gLives === 0) {
        elLives.innerText = '';
    }
}



function checkGameOver(gBoard, elcell, i, j) {
    var eSmile = document.querySelector('.smile');
    if (gLives === 0) {
        eSmile.innerText = '😲';
        alert('you lose!')
        gGame.isOn = false;
    }
    else if
        ((gGame.markedCount === gLevel.mines) && (gGame.shownCount + gGame.markedCount === gLevel.size ** 2)) {
        eSmile.innerText = '😍';
        alert('you win!')
        gGame.isOn = false;

    }

}



