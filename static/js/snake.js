console.log("hello, World!")

const grid = document.querySelector(".grid");
const displayScore = document.querySelector(".score")
const lose = document.querySelector(".lose")
const btns = document.querySelector("#btns")
const restart = document.querySelector("#restart");
const scoreElem = document.querySelector("input[name='score']")
let currentSnakeIndex = 225
width = 30
let state = "noFood"
let size = "noGrow"
let snakeId
let randomFoodIndex
let score = 0
const snakeTail = []
let isDisabled = false;
let left = false;
let right = false;
let up = false;
let down = false;

const Direction = {
    UP: { magnitude: -30, boundary: 29 },
    RIGHT: { magnitude: 1, boundary: width - 1 },
    DOWN: { magnitude: 30, boundary: 420 },
    LEFT: { magnitude: -1, boundary: 0 }
}

function isIndexInBounds(direction, index) {
    switch (direction) {
        case Direction.UP:
            return index > direction.boundary
        case Direction.RIGHT:
            return index % width < direction.boundary
        case Direction.DOWN:
            return index < direction.boundary
        case Direction.LEFT:
            return index % width !== direction.boundary
    }
}

function displayBtns() {
    btns.classList.remove("hide")
}

function gameOver(score) {
    clearInterval(snakeId)
    lose.textContent = "GAME OVER"
    displayBtns();
    isDisabled = true;
    scoreElem.value = score
}

restart.addEventListener("click", function () {
    currentSnakeIndex = 225
    state = "noFood"
    size = "noGrow"
    score = 0
    isDisabled = false;
    left = false;
    right = false;
    up = false;
    down = false;
    snakeTail.splice(0, snakeTail.length)
    squares[randomFoodIndex].classList.remove("food")
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.remove("snake")
    }

})

function didSelfHit() {
    for (let i = 0; i < snakeTail.length; i++) {
        if (currentSnakeIndex == snakeTail[i]) {
            gameOver(score);
        }

    }
}

for (let i = 0; i < 450; i++) {
    const box = document.createElement("div")
    grid.appendChild(box);
}

const squares = Array.from(document.querySelectorAll(".grid div"))

squares[currentSnakeIndex].classList.add("snake");

function keydownHandler(e) {
    if (!isDisabled) {
        switch (e.key) {
            case "ArrowLeft":
                if (!left) {
                    clearInterval(snakeId)
                    snakeId = setInterval(() => moveSnake(Direction.LEFT), 200)
                    left = true;
                    right = true;
                    up = false;
                    down = false;
                }
                break;
            case "ArrowRight":
                if (!right) {
                    clearInterval(snakeId)
                    snakeId = setInterval(() => moveSnake(Direction.RIGHT), 200)
                    right = true;
                    left = true;
                    up = false;
                    down = false;
                }

                break;
            case "ArrowUp":
                if (!up) {
                    clearInterval(snakeId)
                    snakeId = setInterval(() => moveSnake(Direction.UP), 200)
                    up = true;
                    left = false;
                    right = false;
                    down = true;
                }

                break;
            case "ArrowDown":
                if (!down) {
                    clearInterval(snakeId)
                    snakeId = setInterval(() => moveSnake(Direction.DOWN), 200)
                    down = true;
                    left = false;
                    right = false;
                    up = true;

                }
                break;
        }
        console.log(currentSnakeIndex)

        if (state === "noFood") {
            randomFoodSquare();
        }

    }


}

/* can do this to avoid writing enter line squares[currentindex].classlist.remove/add/contain

function add(index, className) {
    squares[index].classList.add(className)
}

function remove(index) {

}*/

function moveSnake(direction) {
    if (isIndexInBounds(direction, currentSnakeIndex)) {
        if (snakeTail.length === 0) {
            squares[currentSnakeIndex].classList.remove("snake")
            currentSnakeIndex += direction.magnitude
            squares[currentSnakeIndex].classList.add("snake")
        } else {
            if (size === "noGrow") {
                snakeTail.unshift(currentSnakeIndex)
                let snakeEnd = snakeTail.pop()
                squares[snakeEnd].classList.remove("snake")
                currentSnakeIndex += direction.magnitude
                squares[currentSnakeIndex].classList.add("snake")
            } else {
                currentSnakeIndex += direction.magnitude
                squares[currentSnakeIndex].classList.add("snake")
                size = "noGrow"
            }

            didSelfHit();
        }
        //when you see one thing that is different, that is the paramater.
        if (squares[currentSnakeIndex].classList.contains("food")) {
            eat();
        }

    } else {
        gameOver(score);
        

    }



}



//when eat occurs, do not remove classlist snake from last index in snake
//check eat because I am always removing the previous piece

function eat() {
    squares[randomFoodIndex].classList.remove("food")
    squares[currentSnakeIndex].classList.add("eat")
    setInterval(flip, 180)
    score++;
    displayScore.textContent = score;
    state = "noFood";
    size = "grow"
    randomFoodSquare();
    grow();

}

function flip() {
    squares[currentSnakeIndex].classList.remove("eat")
    squares[currentSnakeIndex].classList.add("snake")
}


function grow() {
    snakeTail.unshift(currentSnakeIndex)
    squares[currentSnakeIndex].classList.add("snake")
    console.log(snakeTail)
}



function randomFoodSquare() {
    randomFoodIndex = Math.floor(Math.random() * squares.length)
    if (!squares[randomFoodIndex].classList.contains("snake")) {
        squares[randomFoodIndex].classList.add("food");
        console.log(`food index is ${randomFoodIndex}`)
        state = "food"
    } else {
        randomFoodSquare();
    }


}

document.addEventListener("keydown", keydownHandler);


