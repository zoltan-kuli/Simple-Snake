let canvasContext;

let tileSize;
let gridOrder;

let snakeHeadXCoordinate;
let snakeHeadYCoordinate;
let snakeTailCoordinates;
let snakeTailLength;
let initialSnakeTailLength;

let collectibleXCoordinate;
let collectibleYCoordinate;

let frameRate;
let isUpdated;
let isRunning;
let message;

let snakeXVelocity;
let snakeYVelocity;

main();

function main() {
    construct(400, 20);

    start();
}

function construct(dimension) {
    setCanvas(dimension);

    setGrid(dimension);
    
    setSnakeCoordinates();
    
    setRandomCollectibleCoordinates();
    
    setRunEssentials();
}

function setCanvas(dimension) {
    let canvas = document.querySelector("#snakeCanvas");
    canvasContext = canvas.getContext("2d");

    canvas.width = dimension;
    canvas.height = dimension;
}

function setGrid(dimension) {
    tileSize = 20;
    gridOrder = dimension / tileSize;
}

function setRandomSnakeHeadCoordinates() {
    snakeHeadXCoordinate = parseInt(Math.random() * tileSize);
    snakeHeadYCoordinate = parseInt(Math.random() * tileSize);
}

function setSnakeCoordinates() {
    setRandomSnakeHeadCoordinates();
    initialSnakeTailLength = 1;
    setSnakeTailCoordinates();
}

function setSnakeTailCoordinates() {
    snakeTailCoordinates = [];
    snakeTailLength = initialSnakeTailLength;
}

function setRandomCollectibleCoordinates() {
    let isSettingCollectible = true;
    while (isSettingCollectible) {
        collectibleXCoordinate = parseInt(Math.random() * tileSize);
        collectibleYCoordinate = parseInt(Math.random() * tileSize);

        isSettingCollectible = false;
        for (let i = 0; i < snakeTailCoordinates.length; i++) {
            if (snakeTailCoordinates[i].x == collectibleXCoordinate && snakeTailCoordinates[i].y == collectibleYCoordinate) {
                isSettingCollectible = true;
                break;
            }
        }
        
        if (collectibleXCoordinate == snakeHeadXCoordinate && collectibleXCoordinate == snakeHeadXCoordinate) {
            isSettingCollectible = true;
        }
    }
}

function setRunEssentials() {
    frameRate = 8;
    isUpdated = true;
    isRunning = false;

    message = "Simple Snake";

    snakeXVelocity = 0;
    snakeYVelocity = 0;
}

function start() {
    setInterval(update, parseInt(1000 / frameRate));

    document.addEventListener("keydown", (event) => {
        handleKeyDown(event, this);
    });
}

function update() {
    if (isRunning) {
        updateSnakePositions();

        checkState();

        updateSnakeTailLength();

        isUpdated = true;
    }

    updateCanvasContext();
}

function checkState() {
    handleIfCollectibleCollected();
    handleIfGameLost();
}

function handleIfCollectibleCollected() {
    if (snakeHeadXCoordinate == collectibleXCoordinate && 
        snakeHeadYCoordinate == collectibleYCoordinate) {
            setRandomCollectibleCoordinates();
            snakeTailLength++;
    }
}

function handleIfGameLost() {
    for (let i = 0; i < snakeTailCoordinates.length; i++) {
        if (snakeTailCoordinates[i].x == snakeHeadXCoordinate && snakeTailCoordinates[i].y == snakeHeadYCoordinate) {
            snakeTailLength = initialSnakeTailLength;
            snakeTailCoordinates = [];
            isRunning = false;
            message = "Game Over";
        }
    }
}

function updateSnakePositions() {
    updateSnakeHeadPosition();
    handleSnakeWrapAroundIfNecessary();
}

function updateSnakeHeadPosition() {
    snakeHeadXCoordinate += snakeXVelocity;
    snakeHeadYCoordinate += snakeYVelocity;
}

function handleSnakeWrapAroundIfNecessary() {
    if (snakeHeadXCoordinate < 0) {
        snakeHeadXCoordinate = gridOrder - 1;
    }

    if (snakeHeadXCoordinate > gridOrder - 1) {
        snakeHeadXCoordinate = 0;
    }

    if (snakeHeadYCoordinate < 0) {
        snakeHeadYCoordinate = gridOrder - 1;
    }

    if (snakeHeadYCoordinate > gridOrder - 1) {
        snakeHeadYCoordinate = 0;
    }
}
function updateSnakeTailLength() {
    snakeTailCoordinates.push({x:snakeHeadXCoordinate, y:snakeHeadYCoordinate})
    while(snakeTailCoordinates.length > snakeTailLength) {
        snakeTailCoordinates.shift();
    }
}

function updateCanvasContext() {
    drawBackground();

    drawCollectible();

    drawSnake();

    drawMessage();
}

function drawBackground() {
    canvasContext.fillStyle = "Gainsboro";
    canvasContext.fillRect(0, 0, tileSize * gridOrder, tileSize * gridOrder);
}

function drawSnake() {
    drawSnakeTail();
    drawSnakeHead();
}

function drawSnakeHead() {
    canvasContext.fillStyle = "ForestGreen";
    drawTile(snakeHeadXCoordinate, snakeHeadYCoordinate);
}

function drawSnakeTail() {
    canvasContext.fillStyle = "ForestGreen";
    for (let i = 0; i < snakeTailCoordinates.length; i++) {
        drawTile(snakeTailCoordinates[i].x, snakeTailCoordinates[i].y);
    }
}

function drawCollectible() {
    canvasContext.fillStyle = "Red";
    drawTile(collectibleXCoordinate, collectibleYCoordinate);
}

function drawTile(xCoordinate, yCoordinate) {
    canvasContext.fillRect(xCoordinate * tileSize + 1, yCoordinate * tileSize + 1, 
        tileSize - 2, tileSize - 2);
}

function drawMessage() {
    if (!isRunning) {
        canvasContext.fillStyle = "DimGrey";
        canvasContext.textAlign = "center";
        canvasContext.font = "bold 2rem Arial";
        canvasContext.fillText(message, (tileSize * gridOrder) / 2, (tileSize * gridOrder) / 2);
    }
}

function handleKeyDown(event) {
    if (isUpdated) {
        switch(event.key) {
            case "ArrowLeft":
                if (snakeXVelocity != 1) {
                    snakeXVelocity = -1;
                    snakeYVelocity = 0;
                }
                isUpdated = false;
                isRunning = true;
                break;
            case "ArrowUp":
                if (snakeYVelocity != 1) {
                    snakeXVelocity = 0;
                    snakeYVelocity = -1;
                }
                isUpdated = false;
                isRunning = true;
                break;
            case "ArrowRight":
                if (snakeXVelocity != -1) {
                    snakeXVelocity = 1;
                    snakeYVelocity = 0;
                }
                isUpdated = false;
                isRunning = true;
                break;
            case "ArrowDown":
                if (snakeYVelocity != -1) {
                    snakeXVelocity = 0;
                    snakeYVelocity = 1;
                }
                isUpdated = false;
                isRunning = true;
                break;
        }
    }
}
