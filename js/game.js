"use strict"

const MINE = '💣';
const FLAG = '🚩';
const SMILEY='😀 ';
const DEAD_SMILEY='🥴';
const WIN_SMILEY=' 😎 ';

var gBoard = [];
var gFirstClick = true;
var gHintMode = false;
var gTimeInterval;
var gLevel = {
    size: 8,
    mines: 12
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    LifeCount:3
};



function initGame(length) {
    clearInterval(gTimeInterval);
    gBoard = [];
    var elTable = document.querySelector(".board");
    elTable.innerHTML = '';
    initSmiley(SMILEY);
    initHintBtn();
    gGame.isOn = false;
    gFirstClick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.LifeCount=3;
    updateLife(0);
    buildBoard(length);
    renderBoard();
    gGame.secsPassed=0;
    setTimer();
}

function initHintBtn() {
    var ellHint = document.querySelector(".hint");
    var strHtml = '';
    for (var i = 0; i < 3; i++) {

        strHtml += `<button class="hint-btn" onclick="getHint(this)">💡</button>`;
    }
    ellHint.innerHTML = strHtml;
}
function initSmiley(smiley){
    var elSmiley=document.querySelector(".smiley");
    elSmiley.innerHTML=smiley;
}
function updateLife(num){
    gGame.LifeCount-=num;
    var ellLife=document.querySelector(".lifeCount");
    ellLife.innerText=gGame.LifeCount;

}

function changeLevel(length, minesCount) {
    gLevel.mines = minesCount;
    gLevel.length = length;
    initGame(gLevel.length);

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
            strHtml += `<td class="cell${i}-${j}" onmousedown="cellClicked(this,${i},${j})"> </td>`;
        }
    }
    strHtml += '</tr>';

    strHtml += '</table>';
    var elTable = document.querySelector(".board");
    elTable.innerHTML = strHtml;
}
function locateMines(counter, iDx, jDx) {
    for (var i = 0; i < counter; i++) {
        var cellI = getRndInteger(0, gBoard.length - 1);
        var cellJ = getRndInteger(0, gBoard.length - 1);
        if ((!gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isShown) && !isNeg(cellI, cellJ, iDx, jDx)) {
            gBoard[cellI][cellJ].isMine = true;

        }
        else locateMines(1, iDx, jDx);
    }
}
function isNeg(cellI, cellJ, iDx, jDx) {

    for (var i = iDx - 1; i <= iDx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (var j = jDx - 1; j <= jDx + 1; j++) {
            if (i === iDx && j === jDx) continue;
            if (j < 0 || i >= gBoard.length) continue;
            if (i === cellI && j === cellJ) return true;

        }
    }
    return false;

}


function gameOver() {
    var elCell;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.innerText = MINE;
            }
        }
    }
    initSmiley(DEAD_SMILEY);

    //stop clock

    //
    gGame.isOn = false;
}



function cellClicked(elCell, i, j) {

    if (gHintMode) {
        showHint(i, j)
        return;
    }
    if (event.buttons === 2 && !gBoard[i][j].isShown) {
        if (gGame.isOn) cellMarked(elCell, i, j);
        else if (gFirstClick === true) cellMarked(elCell, i, j);
        checkWin();
        return;
    }

    if (gFirstClick && !gBoard[i][j].isMarked) {
        gTimeInterval=setInterval(setTimer,1000);
        gFirstClick = false;
        gGame.isOn = true;
        gBoard[i][j].isShown = true;
        locateMines(gLevel.mines, i, j);
        elCell.style.backgroundColor = " rgb(218, 216, 216)";
        expandShown(i, j);
        checkWin();
        return;
    }
    if (!gGame.isOn) return;

    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;

    var negs = setMinesNegsCount(i, j);
    gBoard[i][j].minesAroundCount = negs;
    if (gBoard[i][j].isMine) {
        updateLife(1)
        alert("lost life");
        if(gGame.LifeCount===0){
            clearInterval(gTimeInterval);
            alert("game over");
            elCell.style.backgroundColor = "rgb(209, 79, 79)";
             gameOver();
        }
        
        return;

    }
    else if (negs > 0) {
        elCell.innerText = negs;
        elCell.style.backgroundColor = " rgb(218, 216, 216)";
        gBoard[i][j].isShown = true;
        checkWin();
        return;
    }

    else {
        elCell.innerText = '';
        gBoard[i][j].isShown = true;
        elCell.style.backgroundColor = " rgb(218, 216, 216)";
        gGame.shownCount++;
        checkWin();
        expandShown(i, j);
    }
}



function cellMarked(elCell, i, j) {

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        return;
    }
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;

}

function getHint(ellBtn) {


    if (ellBtn.innerText === "🚫") return;
    ellBtn.innerText = "🚫"
    gHintMode = true;
}


function showHint(cellI, cellJ) {

    gHintMode = false;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;

            var elCell = document.querySelector(`.cell${i}-${j}`);
            var negs = setMinesNegsCount(i, j);
            gBoard[i][j].minesAroundCount = negs;
            if (gBoard[i][j].isMine) elCell.innerText = MINE;
            else if (negs > 0) elCell.innerText = negs;
            else elCell.innerText = '';
            elCell.style.backgroundColor = " rgb(218, 216, 216)";
        }
    }
    gGame.isOn = false;
    setTimeout(function () { gGame.isOn = true; hideHint(cellI, cellJ); }, 1000)

}
function hideHint(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;

            if (!gBoard[i][j].isShown) {
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.innerText = '';
                elCell.style.backgroundColor = "rgb(161, 161, 161)";
            }
        }
    }
}


function checkWin() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) return;
            if (!gBoard[i][j].isMine && gBoard[i][j].isMarked) return;
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return;

        }
    }
    clearInterval(gTimeInterval);
    initSmiley(WIN_SMILEY);
    alert("you won!");
}

function expandShown(i, j) {


    for (var cellI = i - 1; cellI <= i + 1; cellI++) {
        if (cellI < 0 || cellI >= gBoard.length) continue;

        for (var cellJ = j - 1; cellJ <= j + 1; cellJ++) {
            if (i === cellI && j === cellJ) continue;
            if (cellJ < 0 || cellJ >= gBoard.length) continue;
            var elCell = document.querySelector(`.cell${cellI}-${cellJ}`);
            if (!gBoard[cellI][cellJ].isMine) cellClicked(elCell, cellI, cellJ);
        }
    }
}
function setTimer(){
    
    var elTime=document.querySelector(".timer");
    elTime.innerText=gGame.secsPassed++;

}







