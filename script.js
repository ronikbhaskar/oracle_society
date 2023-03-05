

const dialogue = document.getElementById("dialogue");
const bottom = document.getElementById("bottom");
const buttons = document.getElementById("buttons");
const container = document.getElementById("container");
const continueElement = document.getElementById("continue");
const speed = 60;
var numHostages = 39;
var day = 0;
var buffer = "";
var started = false;
var finishedGame = false;
var doOptionSelect = false;
var doNewDay = false;
var didFirstQuestion = false;
var didSecondQuestion = false;
var readyToContinue = false;
var numQuestions = 4;
var exposition = [
    `????: Ah, Detective, so nice to hear from you. I was worried you might never call.\n\n`,
    `Detective: You know why I'm here. Release the hostages.\n\n`,
    `????: Now Detective, where are your manners? I'm a fan of your work, so I will meet your demands, as long as you can meet mine.\n\n`,
    `Detective: List your demands. The faster we get this over with, the better.\n\n`,
    `????: Why so eager to leave? You're just like the children locked in the basement, so impatient. We can have lots of fun, just give me a chance.\n\n`,
    `Detective: Stop playing games. Tell me what you want, and let those innocent people go.\n\n`,
    `????: Actually, it is you who will be playing games. All I need from you is the number of hostages in my possession. Tell me this, and they're all yours.\n\n`,
    `Detective: You know that's impossible. It's between 1 and 100, and that's all anybody knows.\n\n`,
    `????: Well, it seems you have a lot of guessing to do, Detective, so get to it, because their lives depend on it.\n\n`
]

var afterFirstQuestion = [
    `????: No.\n\n`,
    `Detective: "No"? That's it?? You won't clarify or give me any hints?\n\n`,
    `????: Yep.\n\n`,
    `Detective: Alright, looks like I'm guessing every number. Are there—\n\n????: Let me cut you off there, Detective. First, you can only ask me 4 questions per day—that's what my boss told me—and you've already asked two, including your recent disbelief to me saying no. Second, I only allow yes-or-no questions. Those are the rules. Think carefully about your next question.\n\n`,
]

var restOfLevel = []

const nos = [
    `????: Signs point to no. Even my magic 8 ball is doing better than you.\n\n`,
    `????: No.\n\n`,
    `????: Nope. Keep going, I am loving this.\n\n`,
    `????: No, sorry. Well, I'm not sorry, but you're still incorrect.\n\n`,
    `????: No.\n\n`,
    `????: Nope.\n\n`,
    `????: The answer is no.\n\n`,
]

const yesses = [
    `????: Signs point to yes. You're finally keeping up with my magic 8 ball.\n\n`,
    `????: Yes.\n\n`,
    `????: Indeed, you are correct. Keep going, I am loving this.\n\n`,
    `????: Yes, that is correct. You're giving these helpless souls hope. Try not to screw it up.\n\n`,
    `????: Yes.\n\n`,
    `????: Indeed, that is true.\n\n`,
    `????: Yes, that is correct.\n\n`,
]

const newdaystarts = [
    `????: To answer your question from yesterday...\n\n`
]

const unhingedStatements = [
    "Hope you slept well in your warm bed. The hostages have been sleeping on the concrete. I hear it's good for your back.",
    "The children have been asking about when you will finally rescue them.",
    "The hostages are trying to scratch their way out. I wonder if they'll make it out faster than you can save them. At your current pace, they might.",
    "Another day, another hostage released. Just kidding, I'm not letting any escape.",
    "You again? I thought you gave up."
]

const exactGuessButton = document.createElement("button");
exactGuessButton.innerHTML = `Are there <input type="number" placeholder="0" min="1" max="100" size="number" id="exactGuess"> hostages?`;
exactGuessButton.onclick = () => {
    doGuess("exactGuess", "Are there ", " hostages?", "Is there ", " hostage?");
};

exactGuessButton.children[0].addEventListener("keyup", function(event) {
    if (event.code === "Enter") {
        doGuess("exactGuess", "Are there ", " hostages?", "Is there ", " hostage?");
    }
});

const higherOrLowerButton = document.createElement("button");
higherOrLowerButton.innerHTML = `Are there more than or fewer than <input type="number" placeholder="0" min="1" max="100" size="number" id="higherOrLower"> hostages?`;
higherOrLowerButton.onclick = () => {
    doGuess("higherOrLower", "Are there more than or fewer than ", " hostages?", "Is there more than or fewer than ", " hostage?");
};

higherOrLowerButton.children[0].addEventListener("keyup", function(event) {
    if (event.code === "Enter") {
        doGuess("higherOrLower", "Are there more than or fewer than ", " hostages?", "Is there more than or fewer than ", " hostage?");
    }
});

const higherButton = document.createElement("button");
higherButton.innerHTML = `Are there more than <input type="number" placeholder="0" min="1" max="100" size="number" id="higher"> hostages?`;
higherButton.onclick = () => {
    doGuess("higher", "Are there more than ", " hostages?", "Are there more than ", " hostage?");
};

higherButton.children[0].addEventListener("keyup", function(event) {
    if (event.code === "Enter") {
        doGuess("higher", "Are there more than ", " hostages?", "Are there more than ", " hostage?");
    }
});

const lowerButton = document.createElement("button");
lowerButton.innerHTML = `Are there fewer than <input type="number" placeholder="0" min="1" max="100" size="number" id="lower"> hostages?`;
lowerButton.onclick = () => {
    doGuess("lower", "Are there fewer than ", " hostages?", "Are there fewer than ", " hostage?");
};

lowerButton.children[0].addEventListener("keyup", function(event) {
    if (event.code === "Enter") {
        doGuess("lower", "Are there fewer than ", " hostages?", "Are there fewer than ", " hostage?");
    }
});

setInterval(() => {
    if (buffer.length) {
        bottom.scrollIntoView({ behavior: "smooth", block: "end" });
    }
}, 100);

setInterval(() => {
    if (started && !buffer.length && !doOptionSelect) {
        continueElement.style.animation = "fadeIn 5s";
        continueElement.innerText = "Press Enter to Continue";
        readyToContinue = true;
    } else {
        continueElement.style.animation = "";
        continueElement.innerText = " ";
        readyToContinue = false;
    }
}, 300);

setInterval(type, speed);

function type() {
    if (buffer.length) {
        if (buffer[0] === " ") {
            dialogue.innerText += buffer[0] + buffer[1];
            buffer = buffer.slice(2);
        } else {
            dialogue.innerText += buffer[0];
            buffer = buffer.slice(1);
        }
        
    } else if (doNewDay) {
        doNewDay = false;
        newDay();
    }
}

function doGuess(id, str1plural, str2plural, str1singular, str2singular) {

    let val = document.getElementById(id).value;
    document.getElementById(id).value = "";
    if (isNaN(parseInt(val)))
        return;
    
    numQuestions -= 1;

    let num = parseInt(val);
    buttons.innerHTML = "";
    if (num !== 1)
        buffer += `Detective: ${str1plural}${num}${str2plural}\n\n`;
    else
        buffer += `Detective: ${str1singular}${num}${str2singular}\n\n`;

    if (!didSecondQuestion && didFirstQuestion) {
        didSecondQuestion = true;
        restOfLevel.unshift(`????: Yes, the number of hostages is either greater than or less than ${num}. I don't mean to judge, but that seems like a silly question to ask. The rest of the Oracle Society was expecting better from you. I suppose not. Anyways, time to ask the last question of the day. No pressure.\n\n`);
    } else if (!didFirstQuestion) {
        if (num === numHostages)
            numHostages = 100 - numHostages;
        numQuestions -= 1;
        didFirstQuestion = true;
    } else {
        if (id === "exactGuess" && num === numHostages) {
            finishGame();
            return;
        } else if (id === "exactGuess") {
            restOfLevel.unshift(nos[Math.floor(Math.random() * nos.length)]);
        } else if (id === "higherOrLower" && num === numHostages) {
            restOfLevel.unshift(nos[Math.floor(Math.random() * nos.length)]);
        } else if (id === "higherOrLower") {
            restOfLevel.unshift(yesses[Math.floor(Math.random() * yesses.length)]);
        } else if (id === "higher") {
            if (num < numHostages) {
                restOfLevel.unshift(yesses[Math.floor(Math.random() * yesses.length)]);
            } else {
                restOfLevel.unshift(nos[Math.floor(Math.random() * nos.length)]);
            }
        } else if (id === "lower") {
            if (num > numHostages) {
                restOfLevel.unshift(yesses[Math.floor(Math.random() * yesses.length)]);
            } else {
                restOfLevel.unshift(nos[Math.floor(Math.random() * nos.length)]);

            }
        }
    }

    doOptionSelect = false;

    if (!numQuestions) {
        buffer += `????: I'll answer that tomorrow...\n\n`;
        doNewDay = true;
    }
}

function finishGame() {
    finishedGame = true;
    document.getElementById("title").innerText = "";
    buffer += `????: You are correct. The hostages are located at 01101 Archimedes Avenue. In each room, there are either 3 or 4 hostages, and the doors can all be unlocked with the key underneath the doormat.\n\n`;
    setTimeout(() => {
        dialogue.style.animation = "fadeOut 5s";
    }, 3000);
    setTimeout(() => {
        dialogue.innerText = "";
        spacepause = "                        ";
        buffer = `????: Now that you have your precious civilians, allow me to introduce myself. ${spacepause}\n\n` +
        `????: I am but a single member of The Oracle Society. Just like our Quantum Computing counterparts, we have information that you so desperately need. ${spacepause}\n\n` +
        `????: We will allow you to ask us questions, but we are very selective on the ones we will answer. ${spacepause}\n\n` +
        `????: Ask good questions, and you will receive what you desire. Ask poor questions, and you will be stumbling through the dark. ${spacepause}\n\n` +
        `????: Mark my words, you will come to one of us again, looking for answers, and when you do, I hope you remember this game of life and death. ${spacepause}\n\n` +
        `????: Thanks for playing.`
    }, 8000);
}

function generateNewDayStart() {
    return `????: ${unhingedStatements[Math.floor(Math.random() * unhingedStatements.length)]} Anyways, to answer your question from yesterday...\n\n`
}

function newDay() {
    buffer = "";
    dialogue.innerText = "";
    if (day > 0) {
        restOfLevel.unshift(generateNewDayStart());
    }
    document.getElementById("title").innerText = ``;
    document.getElementById("title").style.animation = "fadeIn 5s";
    document.getElementById("title").innerText = `Day ${day}`;
    
    day += 1;
    numQuestions = 4;
}

document.addEventListener("keyup", function(event) {
    document.getElementById("title").style.animation = "";
    if (finishedGame) {
        return;
    }
    if (event.code === "Enter") {
        if (!buffer.length && readyToContinue && !doOptionSelect) {
            if (exposition.length) {
                buffer += exposition.shift();
            }

            if (!buffer.length && !exposition.length && !didFirstQuestion) {
                doOptionSelect = true;
                buttons.appendChild(exactGuessButton);
            }

            if (didFirstQuestion && afterFirstQuestion.length) {
                buffer += afterFirstQuestion.shift();
            }

            if (!buffer.length && didFirstQuestion && !afterFirstQuestion.length && !didSecondQuestion) {
                doOptionSelect = true;
                // buttons.appendChild(exactGuessButton);
                buttons.appendChild(higherOrLowerButton);

            }

            if (didFirstQuestion && didSecondQuestion && restOfLevel.length) {
                buffer += restOfLevel.shift();
            } else if (didFirstQuestion && didSecondQuestion) {
                doOptionSelect = true;
                buttons.appendChild(exactGuessButton);
                buttons.appendChild(higherOrLowerButton);
                buttons.appendChild(higherButton);
                buttons.appendChild(lowerButton);
            }

            continueElement.style.animation = "";
            continueElement.innerText = " ";
        } else if (buffer.length && !finishedGame) {
            // this would definitely have non-deterministic bug issues, but oh well
            dialogue.innerText += buffer;
            buffer = "";
            bottom.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }
});

setTimeout(() => {
    started = true;
    buffer += exposition.shift();
}, 3000);

newDay();

