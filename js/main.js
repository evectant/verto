//
// Variables.
//

const currentPhraseElement = document.getElementById("currentPhrase");
const translationInputElement = document.getElementById("translationInput");
const feedbackElement = document.getElementById("feedback");
const correctCounterElement = document.getElementById("correctCounter");
const randomizeCheckboxElement = document.getElementById("randomizeCheckbox");

const groupCheckboxes = document.querySelectorAll(".group-checkbox");
const conjugationCheckboxes = document.querySelectorAll(
  ".conjugation-checkbox"
);
const declensionCheckboxes = document.querySelectorAll(".declension-checkbox");
const tenseCheckboxes = document.querySelectorAll(".tense-checkbox");
const sectionCheckboxes = document.querySelectorAll(".section-checkbox");

let loadedPhrases = [];
let currentPhraseIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let isGroupUpdate = false;

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
  const selectedDeclensions = [];
  const selectedTenses = [];

  // Get selected conjugations and declensions
  const selectedConjugations = [];
  let pronounsEnabled = false;

  conjugationCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedConjugations.push(checkbox.value);
    }
  });

  declensionCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      if (checkbox.value === "pronouns") {
        pronounsEnabled = true;
      } else {
        selectedDeclensions.push(checkbox.value);
      }
    }
  });

  tenseCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedTenses.push(checkbox.value);
    }
  });

  // Get selected sections (stories)
  const selectedSections = [];
  sectionCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedSections.push(checkbox.value);
    }
  });

  // Load story phrases if sections are selected (stories don't need template expansion)
  if (selectedSections.length > 0) {
    const filteredPhrases = phrases.filter(
      (phrase) => phrase.section && selectedSections.includes(phrase.section)
    );
    loadedPhrases = loadedPhrases.concat(filteredPhrases);
  }

  // Load template-based phrases if conjugations, tenses, and (declensions or pronouns) are selected
  if (
    selectedConjugations.length > 0 &&
    selectedTenses.length > 0 &&
    (selectedDeclensions.length > 0 || pronounsEnabled)
  ) {
    // Only load template phrases (those without a section property)
    const templatePhrases = phrases.filter((phrase) => !phrase.section);
    loadedPhrases = loadedPhrases.concat(templatePhrases);
  }

  if (loadedPhrases.length === 0) {
    currentPhraseElement.textContent = "⚠️ Selige sectiones!";
    return;
  }

  // Expand any templates in the loaded phrases using selected declensions, tenses, and conjugations
  if (selectedDeclensions.length > 0 || pronounsEnabled) {
    loadedPhrases = expandTemplates(
      loadedPhrases,
      selectedDeclensions,
      selectedTenses,
      selectedConjugations,
      pronounsEnabled
    );
  }

  // If after expansion we have no phrases (templates couldn't expand), show warning
  if (loadedPhrases.length === 0) {
    currentPhraseElement.textContent = "⚠️ Selige sectiones!";
    return;
  }

  if (randomizeCheckboxElement.checked) {
    shuffle(loadedPhrases);
  }

  currentPhraseIndex = 0;

  // Reset to submit mode in case we were in next phrase mode.
  translationInputElement.removeEventListener("keydown", handleKeyDownNext);
  translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
  translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

  displayPhrase();
}

function updateScore() {
  const correctText = correctAnswers > 0 ? toRoman(correctAnswers) : "Nulla";
  const totalText = totalAnswers > 0 ? toRoman(totalAnswers) : "nullis";

  const percentage = Math.round((correctAnswers * 100.0) / totalAnswers);
  const percentageText = percentage > 0 ? toRoman(percentage) : "nullae";

  // Determine color based on percentage ranges
  let percentageColor;
  if (percentage === 100) {
    percentageColor = "#BA68C8"; // Soft purple for 100%
  } else if (percentage >= 90) {
    percentageColor = "#64B5F6"; // Soft blue for 90-99%
  } else if (percentage >= 80) {
    percentageColor = "#66BB6A"; // Soft green for 80-89%
  } else if (percentage >= 70) {
    percentageColor = "#FDD835"; // Soft yellow for 70-79%
  } else {
    percentageColor = "#FFA726"; // Soft orange for 0-69%
  }

  correctCounterElement.innerHTML = `${correctText} ex ${totalText} <span style="color: ${percentageColor}">(${percentageText} centesimae)</span>`;
}

function checkTranslation() {
  const userTranslation = translationInputElement.value;
  const correctTranslation = loadedPhrases[currentPhraseIndex].la;

  if (haveSameWords(userTranslation, correctTranslation)) {
    feedbackElement.style.color = "#66BB6A";
    feedbackElement.textContent = "Recte!";
    correctAnswers++;
  } else {
    feedbackElement.style.color = "";
    feedbackElement.innerHTML = getColoredFeedback(
      userTranslation,
      correctTranslation
    );
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

function updateGroupCheckbox(checkbox) {
  const group = checkbox.closest(".section-group");
  const groupCheckbox = group.querySelector(".group-checkbox");
  const checkboxes = group.querySelectorAll(
    ".conjugation-checkbox, .declension-checkbox, .tense-checkbox, .section-checkbox"
  );

  const checkedCount = Array.from(checkboxes).filter((cb) => cb.checked).length;

  groupCheckbox.checked = checkedCount === checkboxes.length;
  groupCheckbox.indeterminate =
    checkedCount > 0 && checkedCount < checkboxes.length;
}

//
// Event listeners.
//

// Handle conjugation checkboxes
conjugationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
    if (!isGroupUpdate) {
      updateLoadedPhrases();
    }
  });
});

// Handle declension checkboxes
declensionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
    if (!isGroupUpdate) {
      updateLoadedPhrases();
    }
  });
});

// Handle tense checkboxes
tenseCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
    if (!isGroupUpdate) {
      updateLoadedPhrases();
    }
  });
});

// Handle story section checkboxes
sectionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
    if (!isGroupUpdate) {
      updateLoadedPhrases();
    }
  });
});

// Handle group checkboxes
groupCheckboxes.forEach((groupCheckbox) => {
  groupCheckbox.addEventListener("change", function () {
    const group = document.getElementById(this.dataset.group);
    const checkboxes = group.querySelectorAll(
      ".conjugation-checkbox, .declension-checkbox, .tense-checkbox, .section-checkbox"
    );

    // Set flag to prevent child checkboxes from calling updateLoadedPhrases
    isGroupUpdate = true;
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
    isGroupUpdate = false;

    // Defer updateLoadedPhrases to next event loop tick for instant UI update
    setTimeout(() => updateLoadedPhrases(), 0);
  });
});

// Changing randomization should trigger reload.
randomizeCheckboxElement.addEventListener("change", updateLoadedPhrases);

// Handle collapsible Fabulae section
const fabulaeLabel = document.querySelector("#groupFabulae > label");
fabulaeLabel.addEventListener("click", function (event) {
  // Don't toggle if clicking directly on the checkbox
  if (event.target.tagName === "INPUT") {
    return;
  }
  // Prevent the label from toggling the checkbox
  event.preventDefault();
  document.getElementById("groupFabulae").classList.toggle("collapsed");
});

// Enter starts in submit mode.
translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

//
// Initialization.
//

conjugationCheckboxes.forEach(updateGroupCheckbox);
declensionCheckboxes.forEach(updateGroupCheckbox);
tenseCheckboxes.forEach(updateGroupCheckbox);
sectionCheckboxes.forEach(updateGroupCheckbox);
updateLoadedPhrases();
updateScore();
