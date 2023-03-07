

const dialogue = document.getElementById("dialogue");
const bottom = document.getElementById("bottom");
const buttons = document.getElementById("buttons");
const container = document.getElementById("container");
const continueElement = document.getElementById("continue");
const speed = 50;
const maxNumQuestions = 9;
var numHostages = [39, 36, 30, 5, 92, 67, 64, 14][Math.floor(Math.random() * 8)] + 1;
var day = 0;
var buffer = "";
var started = false;
var finishedGame = false;
var doOptionSelect = false;
var doNewDay = false;
var didFirstQuestion = false;
var didSecondQuestion = false;
var readyToContinue = false;
var numQuestions = maxNumQuestions;
var exposition = [
    `????: Ah, Detective, so nice to hear from you. I was worried you might never call.\n\n`,
    `Detective: We are tracking your location as we speak. Give up the hostages now, and you won't have to get hurt.\n\n`,
    `????: I'm sorry, what did you say? I can't hear you over the sound of screaming coming from the other room. Should I kill a few people so I can hear you better?\n\n`,
    `Detective: Wait, you don't have to hurt anyone. Just tell us your demands, and we will get you what you want.\n\n`,
    `????: Demands, demands, demands! Everyone is so demanding these days. You demand the hostages. The adults demand food for the starving children in the basement. Why should I contribute to this excessive impatience? We can have lots of fun, just give me a chance.\n\n`,
    `Detective: ...\n\n`,
    `????: What? Is your puny, little brain incapable of comprehending that I don't want anything? I suppose I can placate you... ah yes! I've got it! I know what I want, but I won't tell you.\n\n`,
    `Detective: How can I meet your demands if you don't tell me what they are? Please, tell me what you want, and this can all be over.\n\n`,
    `????: QUIET! Sorry, not you. The sound of handcuffs rattling against metal pipes is absolutely infuriating. Anyways, I'm bored, so my demands are that we play a game. Ready for the rules? Guess how many hostages I have. Do this, and they're all yours.\n\n`,
    `Detective: You know that's impossible. It's between 1 and 100, and that's all anybody knows.\n\n`,
    `????: Well, it seems you have a lot of guessing to do, Detective, so get to it, because their lives depend on it.\n\n`
]

var afterFirstQuestion = [
    `????: No.\n\n`,
    `Detective: "No"? That's it?? You won't clarify or give me any hints?\n\n`,
    `????: Yep.\n\n`,
    `Detective: Alright, looks like I'm guessing every number. Are there—\n\n????: Let me cut you off there, Detective. First, for every ${maxNumQuestions} questions you ask that don't guess the correct answer, I am going to kill a hostage—that's what my boss told me to do. You've already asked two questions. Second, I only allow yes-or-no questions. Those are the rules. Think carefully about your next question.\n\n`,
]

var restOfLevel = []

const nos = [
    `????: Signs point to no. Even my magic 8 ball is doing better than you.\n\n`,
    `????: No. Do you really care about these people?\n\n`,
    `????: Nope. Keep going, I am loving this.\n\n`,
    `????: No, sorry. Well, I'm not sorry, but you're still incorrect.\n\n`,
    `????: The answer is no. QUIET! Sorry, they scream every time you get a question wrong.\n\n`,
]

const yesses = [
    `????: Signs point to yes. You're finally keeping up with my magic 8 ball.\n\n`,
    `????: Yes, but you still have a long ways to go if you want to keep these people alive.\n\n`,
    `????: Indeed, you are correct. Keep going, I am loving this.\n\n`,
    `????: Yes, that is correct. You're giving these helpless souls hope. Try not to screw it up.\n\n`,
    `????: Yes, that is correct.\n\n`,
    `????: You are correct, but are you making progress fast enough? I think your pace is wonderful, but these people may have a different opinion.\n\n`
]

const newdaystarts = [
    `????: To answer your question from earlier...\n\n`
]

const unhingedStatements = [
    "Great, that one's going to take forever to clean out of the carpet. Lucky me. The state of this box I call a home is really deteriorating.",
    "Now his teddy bear can go to another child. Know that your questions really have made a difference in the world.",
    "I can never relate to only children. I have too many siblings in the Oracle Society, and we're all so very like-minded. I also can't relate to being dead, but that's besides the point.",
    "Another one bites the dust! Ah, such a good song."
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
        restOfLevel.unshift(`????: Yes, the number of hostages is either greater than or less than ${num}. I don't mean to judge, but that seems like a silly question to ask. The rest of the Oracle Society was expecting better from you. I suppose not. Anyways, the questions are counting down. No pressure.\n\n`);
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
        buffer += `????: I'll answer that in a moment...      \n\n`;
        doNewDay = true;
    }
}

function finishGame() {
    doOptionSelect = true;
    finishedGame = true;
    if (!numHostages) {
        buffer += `????: Aaaand they're all dead. Congratulations, you failed. The next time you approach a member of the Oracle Society, be prepared with better questions.`;
        return;
    }
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
    return `????: ${unhingedStatements[Math.floor(Math.random() * unhingedStatements.length)]} Anyways, to answer your question from earlier...\n\n`
}

function newDay() {
    numHostages -= 1;
    if (!numHostages) {
        finishGame();
        return;
    }
    buffer = "";
    dialogue.innerText = "";
    if (day > 0) {
        restOfLevel.unshift(generateNewDayStart());
    }
    document.getElementById("title").innerText = ``;
    document.getElementById("title").style.animation = "fadeIn 5s";
    document.getElementById("title").innerText = `Deaths: ${day}`;
    
    day += 1;
    numQuestions = maxNumQuestions;
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

