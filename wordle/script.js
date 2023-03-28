import { WORDS } from "./words.js"

const GUESSES=6
let guesses_left=GUESSES
let current_guess=[]
let next_letter=0
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(rightGuessString)

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

document.addEventListener("keyup",(e)=> {
    if (guesses_left===0){
        return
    }

    let pressed_key= String(e.key)
    if (pressed_key==='Backspace' && next_letter!==0){
        deleteLetter()
        return
    }

    if (pressed_key==='Enter'){
        checkGuess()
        return
    }

    let found = pressed_key.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } 
    else {
        //console.log('insert function called')
        insertLetter(pressed_key)
    }

})

function insertLetter (pressed_key) {
    if (next_letter === 5) {
        return
    }
    pressed_key = pressed_key.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guesses_left]
    let box = row.children[next_letter]
    box.textContent = pressed_key
    box.classList.add("filled-box")
    current_guess.push(pressed_key)
    next_letter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guesses_left]
    let box = row.children[next_letter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    current_guess.pop()
    next_letter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guesses_left]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of current_guess) {
        guessString += val
    }

    if (guessString.length != 5) {
        alert("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        alert("Word not in list!")
        return
    }

    
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = current_guess[i]
        
        let letterPosition = rightGuess.indexOf(current_guess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } 
        else {
            if (current_guess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        document.getElementById('game-info').innerHTML= "You guessed right! Game over!"
        document.getElementById('game-info').style.color='green'
        guesses_left = 0
        return
    } else {
        guesses_left -= 1;
        current_guess = [];
        next_letter = 0;

        if(guesses_left === 0) {
            document.getElementById('game-info').innerHTML= "Game over! "+`The word was: ${rightGuessString}`
            document.getElementById('game-info').style.color='red'
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})


