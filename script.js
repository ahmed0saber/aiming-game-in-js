const gameContainer = document.querySelector(".game-container")
const currentScoreWrapper = document.querySelector(".current-score")
const highestScoreWrapper = document.querySelector(".highest-score")
const restartBtn = document.querySelector(".restart-btn")
let currentScore = 0, missedTargets = 0, isLose = false

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const displayCurrentScore = () => {
    currentScoreWrapper.textContent = currentScore
}

const displayRemainingLives = () => {
    const remainingLivesWrapper = document.querySelector(".remaining-lives")
    remainingLivesWrapper.textContent = Math.max(3 - missedTargets, 0)
}

const endGame = () => {
    const highestScore = getHighestScore()
    if (currentScore > highestScore) {
        localStorage.setItem("highest-score", currentScore)
        displayHighestScore()
    }

    const targets = document.querySelectorAll(".game-container .target")
    targets.forEach(target => {
        target.remove()
    })

    isLose = true

    Swal.fire({
        title: "You lose",
        html: `
            <p>current score: ${currentScore}</p>
            <p>highest score: ${highestScore}</p>
        `,
        confirmButtonText: 'play again',
    })
}

const createTarget = () => {
    const target = document.createElement("div")
    target.className = "target"
    target.style.top = getRandomNumber(4, gameContainer.clientWidth - 104) + "px"
    target.style.left = getRandomNumber(4, gameContainer.clientWidth - 104) + "px"

    target.addEventListener("click", function () {
        currentScore++
        displayCurrentScore()
        target.classList.add("is-clicked")
        target.remove()
        createTarget()
    })

    setTimeout(() => {
        gameContainer.appendChild(target)

        setTimeout(function () {
            if (target.classList.contains("is-clicked")) {
                return
            }

            missedTargets++
            displayRemainingLives()
            if (missedTargets >= 3) {
                if (!isLose) {
                    endGame()
                }
            } else {
                target.remove()
                createTarget()
            }
        }, 3000)
    }, getRandomNumber(1000, 3000))
}

const getHighestScore = () => {
    const highestScore = localStorage.getItem("highest-score")
    if (highestScore) return parseInt(highestScore)

    return 0
}

const displayHighestScore = () => {
    const highestScore = getHighestScore()
    highestScoreWrapper.textContent = highestScore
}

const startNewGame = () => {
    currentScore = 0
    missedTargets = 0
    isLose = false

    displayCurrentScore()
    displayHighestScore()
    displayRemainingLives()

    for (let i = 0; i < 3; i++) {
        createTarget()
    }
}

startNewGame()

restartBtn.addEventListener("click", startNewGame)
