const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-btn");
const yspace = 10;
let score = 0;
let timerid;

const lTetra = [
    [1, yspace + 1, yspace * 2 + 1, 2],
    [yspace, yspace + 1, yspace + 2, yspace * 2 + 2],
    [1, yspace + 1, yspace * 2 + 1, yspace * 2],
    [yspace, yspace * 2, yspace * 2 + 1, yspace * 2 + 2],
];

const zTetra = [
    [yspace * 2, yspace * 2 + 1, yspace + 1, yspace + 2],
    [0, yspace, yspace + 1, yspace * 2 + 1],
    [yspace * 2, yspace * 2 + 1, yspace + 1, yspace + 2],
    [0, yspace, yspace + 1, yspace * 2 + 1],
];

const tTetra = [
    [yspace, yspace + 1, yspace + 2, 1],
    [1, yspace + 1, yspace * 2 + 1, yspace + 2],
    [yspace, yspace + 1, yspace + 2, yspace * 2 + 1],
    [1, yspace + 1, yspace * 2 + 1, yspace],
];

const oTetra = [
    [0, 1, yspace, yspace + 1],
    [0, 1, yspace, yspace + 1],
    [0, 1, yspace, yspace + 1],
    [0, 1, yspace, yspace + 1],
];

const iTetra = [
    [1, yspace + 1, yspace * 2 + 1, yspace * 3 + 1],
    [yspace, yspace + 1, yspace + 2, yspace + 3],
    [1, yspace + 1, yspace * 2 + 1, yspace * 3 + 1],
    [yspace, yspace + 1, yspace + 2, yspace + 3],
];

const theTetras = [lTetra, zTetra, tTetra, oTetra, iTetra];

let currentPosition = 4;
let currentRotation = 0;
let nextRandom = 0
let randomTetras = Math.floor(Math.random() * theTetras.length);
// let tetrasRotate = Math.floor(Math.random()*4);
let current = theTetras[randomTetras][currentRotation];

function draw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.add("tetras");
    });
}

// draw();

function unDraw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.remove("tetras");
    });
}

// timerid = setInterval(moveDown, 1000);

function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}

document.addEventListener("keyup", control);

function moveDown() {
    unDraw();
    currentPosition += yspace;
    draw();
    freeze();
}

function freeze() {
    if (
        current.some((index) =>
            squares[currentPosition + index + yspace].classList.contains("taken")
        )
    ) {
        current.forEach((index) =>
            squares[currentPosition + index].classList.add("taken")
        );
        randomTetras = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetras.length);
        current = theTetras[randomTetras][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
        (index) => (currentPosition + index) % yspace === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
        current.some((index) =>
            squares[currentPosition + index].classList.contains("taken")
        )
    ) {
        currentPosition += 1;
    }
    draw();
}

function moveRight() {
    unDraw();

    const isAtRightEdge = current.some(
        (index) => (currentPosition + index + 1) % yspace === 0
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
        current.some((index) =>
            squares[currentPosition + index].classList.contains("taken")
        )
    ) {
        currentPosition -= 1;
    }
    draw();
}

function rotate() {
    unDraw();

    currentRotation++;

    if (currentRotation === current.length) {
        currentRotation = 0;
    }

    current = theTetras[randomTetras][currentRotation];
    draw();
}

const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

const upNextTetras = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [displayWidth * 2, displayWidth * 2 + 1, displayWidth + 1, displayWidth + 2],
    [displayWidth, displayWidth + 1, displayWidth + 2, 1],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
];

function displayShape() {
    displaySquares.forEach((square) => {
        square.classList.remove('tetras');
    });

    upNextTetras[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add("tetras");
    });
}

startBtn.addEventListener('click', () => {
    if (timerid) {
        clearInterval(timerid);
        timerid = null;
    } else {
        draw();
        timerid = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetras.length);
        displayShape();
    }
});

function addScore() {
    for (let i = 0; i < 199; i += yspace) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetras');
            })
            const squaresRemoved = squares.splice(i, yspace);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))

        }
    }
}

function gameOver(){
if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    scoreDisplay.innerHTML='end';
    clearInterval(timerid);
}
}