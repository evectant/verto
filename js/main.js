//
// Variables.
//

const currentPhraseElement = document.getElementById("currentPhrase");
const translationInputElement = document.getElementById("translationInput");
const feedbackElement = document.getElementById("feedback");
const correctCounterElement = document.getElementById("correctCounter");
const randomizeCheckboxElement = document.getElementById("randomizeCheckbox");

const groupCheckboxes = document.querySelectorAll(".group-checkbox");
const lectureCheckboxes = document.querySelectorAll(".lecture-checkboxes .lecture-checkbox");

let loadedPhrases = [];
let currentPhraseIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;

//
// Functions
//

function displayPhrase() {
    currentPhraseElement.textContent = loadedPhrases[currentPhraseIndex].en;
    translationInputElement.value = "";
    feedbackElement.textContent = "";
    translationInputElement.focus();
}

// Makes the loaded phrases match the checkboxes.
function updateLoadedPhrases() {
    loadedPhrases = [];
    lectureCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            loadedPhrases = loadedPhrases.concat(phrases[checkbox.value]);
        }
    });

    if (loadedPhrases.length === 0) {
        currentPhraseElement.textContent = "⚠️ Selige leciones!";
        return;
    }

    if (randomizeCheckboxElement.checked) {
        shuffle(loadedPhrases);
    }

    currentPhraseIndex = 0;
    displayPhrase();
}

function updateScore() {
    const correctText = correctAnswers > 0 ? toRoman(correctAnswers) : "Nulla";
    const totalText = totalAnswers > 0 ? toRoman(totalAnswers) : "nullis";

    const percentage = Math.round(correctAnswers * 100.0 / totalAnswers);
    const percentageText = percentage > 0 ? toRoman(percentage) : "nullae";

    correctCounterElement.textContent = `${correctText} ex ${totalText} (${percentageText} centesimae)`;
}

function checkTranslation() {
    const userTranslation = translationInputElement.value;
    const correctTranslation = loadedPhrases[currentPhraseIndex].la;

    if (normalize(userTranslation) === normalize(correctTranslation)) {
        feedbackElement.style.color = "green";
        feedbackElement.textContent = "Recte!";
        correctAnswers++;
    } else {
        feedbackElement.style.color = "red";
        feedbackElement.textContent = correctTranslation;
    }

    totalAnswers++;
    updateScore();
}

function nextPhrase() {
    currentPhraseIndex = (currentPhraseIndex + 1) % loadedPhrases.length;
    displayPhrase();

    // Switch Enter to submit mode.
    translationInputElement.removeEventListener("keydown", handleKeyDownNext);
    translationInputElement.addEventListener("keydown", handleKeyDownSubmit);
}

function submitTranslation() {
    if (loadedPhrases.length === 0) {
        return;
    }

    checkTranslation();

    // Switch Enter to next phrase mode.
    translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
    translationInputElement.addEventListener("keydown", handleKeyDownNext);
}

function handleKeyDownSubmit(event) {
    if (event.key === "Enter") {
        submitTranslation();
    }
}

function handleKeyDownNext(event) {
    if (event.key === "Enter") {
        nextPhrase();
    }
}

//
// Event listeners.
//

lectureCheckboxes.forEach(lectureCheckbox => {
    lectureCheckbox.addEventListener("change", updateLoadedPhrases);
});

groupCheckboxes.forEach(groupCheckbox => {
    groupCheckbox.addEventListener("change", function () {
        const group = document.getElementById(this.dataset.group);
        const checkboxes = group.querySelectorAll(".lecture-checkbox");
        checkboxes.forEach(lectureCheckbox => {
            lectureCheckbox.checked = this.checked;
        });
        updateLoadedPhrases();
    });
});

// Changing randomization should trigger reload.
randomizeCheckboxElement.addEventListener("change", updateLoadedPhrases);

// Enter starts in submit mode.
translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

//
// Initialization.
//

updateLoadedPhrases();
displayPhrase();
updateScore();