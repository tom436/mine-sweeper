"use strict"

const MINE = '💣';
const FLAG = '🚩';
const SHOWN_MINE = "@";


var gBoard = [];

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};



function initGame() {
    buildBoard(9);
    console.table(gBoard);
    renderBoard();
    locateMines(12);
}
function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,

    }
    return cell;
}

function buildBoard(length) {

    for (var i = 0; i < length; i++) {
        gBoard[i] = [];
        for (var j = 0; j < length; j++) {
            gBoard[i][j] = createCell();
        }
    }
}

function setMinesNegsCount(cellI, cellJ) {
    var negCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard.length) continue;

            if (gBoard[i][j].isMine) negCount++;
        }
    }
    return negCount;
}

function renderBoard() {
    var strHtml = `<table >`
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard.length; j++) {
            strHtml += `<td class="cell${i}${j}" onmousedown="cellClicked(this,${i},${j})"> </td>`;
        }
    }
    strHtml += '</tr>';

    strHtml += '</table>';
    var elTable = document.querySelector(".board");
    elTable.innerHTML = strHtml;
}
function locateMines(counter) {
    //var elCell;
    for (var i = 0; i < counter; i++) {
        var cellI = getRndInteger(0, gBoard.length - 1);
        var cellJ = getRndInteger(0, gBoard.length - 1);

        if (!gBoard[cellI][cellJ].isMine) {
            //elCell = document.querySelector(`.cell${cellI}${cellJ}`);
            gBoard[cellI][cellJ].isMine = true;
            //elCell.innerText=MINE;
        }
        else locateMines(1);
    }
}


function cellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown) return;

    if(event.buttons===2) {
        cellMarked(elCell,i,j);
        return;
    }
    if(gBoard[i][j].isMarked) return;

    var negs = setMinesNegsCount(i, j);
    gBoard[i][j].minesAroundCount = negs;
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE;
    }
    else if (negs > 0) {

        elCell.innerText = negs;
    }
    else elCell.innerText = '';
    gBoard[i][j].isShown = true;
    elCell.style.backgroundColor = " rgb(218, 216, 216)";

}



function cellMarked(elCell,i,j) {

    if(gBoard[i][j].isMarked){
        gBoard[i][j].isMarked=false;
        elCell.innerText = '';
        return;
    }
    gBoard[i][j].isMarked=true;
    elCell.innerText = FLAG;

}

function checkGameOver() {



}

function expandShown(board, elCell, i, j) {

}










/* function renderBoard() {
    var strHtml = `<table >`
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                strHtml += `<td class="cell ${i} ${j}" onclick="cellClicked(this,${i},${j})">${MINE}</td>`;
            }
            else {
                var negs = setMinesNegsCount(i, j);
                if(negs>0){
                    gBoard[i][j].minesAroundCount=negs;
                    strHtml +=`<td class="cell ${i} ${j}" onclick="cellClicked(this,${i},${j})">${negs} </td>`;
                }
                else strHtml += `<td class="cell ${i} ${j}" onclick="cellClicked(this,${i},${j})"> </td>`;
            }
        }
        strHtml += '</tr>';
    }
    strHtml += '</table>';
    var elTable = document.querySelector(".board");
    elTable.innerHTML = strHtml;

}*/