//
// Variables.
//

const currentPhraseElement = document.getElementById("currentPhrase");
const translationInputElement = document.getElementById("translationInput");
const feedbackElement = document.getElementById("feedback");
const correctCounterElement = document.getElementById("correctCounter");
const randomizeCheckboxElement = document.getElementById("randomizeCheckbox");
const storyContainerElement = document.getElementById("storyContainer");
const fullStoryElement = document.getElementById("fullStory");
const dismissStoryButtonElement = document.getElementById("dismissStoryButton");

// AI Mode elements
const aiModeCheckboxElement = document.getElementById("aiModeCheckbox");
const aiModeSettingsElement = document.getElementById("aiModeSettings");
const apiKeyInputElement = document.getElementById("apiKeyInput");
const generateAiButtonElement = document.getElementById("generateAiButton");
const aiStatusElement = document.getElementById("aiStatus");
const storyModeCheckboxElement = document.getElementById("storyModeCheckbox");
const adjectivesCheckboxElement = document.getElementById("adjectivesCheckbox");

const groupCheckboxes = document.querySelectorAll(".group-checkbox");
const conjugationCheckboxes = document.querySelectorAll(".conjugation-checkbox");
const declensionCheckboxes = document.querySelectorAll(".declension-checkbox");
const tenseCheckboxes = document.querySelectorAll(".tense-checkbox");
const sectionCheckboxes = document.querySelectorAll(".section-checkbox");

let loadedPhrases = [];
let currentPhraseIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let isGroupUpdate = false;
let aiModeEnabled = true;
let aiGeneratedPhrases = [];

//
// Functions
//

function displayPhrase() {
  currentPhraseElement.textContent = loadedPhrases[currentPhraseIndex].en;
  translationInputElement.value = "";
  feedbackElement.textContent = "";
  translationInputElement.focus();
}

// Load story phrases based on selected sections.
function loadStoryPhrases() {
  // Skip if AI mode is enabled - AI phrases are managed separately
  if (aiModeEnabled) {
    return;
  }

  loadedPhrases = [];

  // Get selected sections (stories)
  const selectedSections = [];
  sectionCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedSections.push(checkbox.value);
    }
  });

  // Load story phrases if sections are selected
  if (selectedSections.length > 0) {
    const filteredPhrases = phrases.filter(
      (phrase) => phrase.section && selectedSections.includes(phrase.section)
    );
    loadedPhrases = loadedPhrases.concat(filteredPhrases);
  }

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

function displayFullStory() {
  // Display all Latin sentences in the story container
  const latinStory = loadedPhrases.map((phrase) => phrase.la).join(" ");
  fullStoryElement.textContent = latinStory;
  storyContainerElement.classList.remove("hidden");
}

function hideFullStory() {
  storyContainerElement.classList.add("hidden");
}

function nextPhrase() {
  // Check if we've completed all phrases
  if (currentPhraseIndex === loadedPhrases.length - 1) {
    displayFullStory();
    currentPhraseIndex = 0;
  } else {
    currentPhraseIndex = currentPhraseIndex + 1;
  }

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

// Handle conjugation checkboxes (for AI vocabulary filtering)
conjugationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
  });
});

// Handle declension checkboxes (for AI vocabulary filtering)
declensionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
  });
});

// Handle tense checkboxes (for AI grammar filtering)
tenseCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
  });
});

// Handle story section checkboxes
sectionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateGroupCheckbox(this);
    if (!isGroupUpdate) {
      loadStoryPhrases();
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

    // Set flag to prevent child checkboxes from calling loadStoryPhrases
    isGroupUpdate = true;
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
    isGroupUpdate = false;

    // Only reload for story sections (Fabulae)
    if (this.dataset.group === "groupFabulae") {
      setTimeout(() => loadStoryPhrases(), 0);
    }
  });
});

// Changing randomization should trigger reload (only for story mode).
randomizeCheckboxElement.addEventListener("change", function () {
  if (!aiModeEnabled) {
    loadStoryPhrases();
  } else if (loadedPhrases.length > 0) {
    // Reshuffle AI phrases
    if (this.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;
    displayPhrase();
  }
});

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

// Dismiss story button
dismissStoryButtonElement.addEventListener("click", hideFullStory);

// AI Mode event handlers
aiModeCheckboxElement.addEventListener("change", function () {
  aiModeEnabled = this.checked;

  if (aiModeEnabled) {
    // Show AI settings
    aiModeSettingsElement.classList.remove("hidden");

    // Load saved API key if available
    const savedKey = getApiKey();
    if (savedKey) {
      apiKeyInputElement.value = savedKey;
    }

    // If we have AI phrases, use them
    if (aiGeneratedPhrases.length > 0) {
      loadedPhrases = [...aiGeneratedPhrases];
      if (randomizeCheckboxElement.checked) {
        shuffle(loadedPhrases);
      }
      currentPhraseIndex = 0;
      displayPhrase();
    } else {
      currentPhraseElement.textContent = "⚠️ Preme 'Generare'";
    }
  } else {
    // Hide AI settings and switch to story phrases
    aiModeSettingsElement.classList.add("hidden");
    aiStatusElement.textContent = "";
    loadStoryPhrases();
  }
});

// Save API key when changed
apiKeyInputElement.addEventListener("change", function () {
  setApiKey(this.value);
});

// Generate AI phrases button
generateAiButtonElement.addEventListener("click", async function () {
  const apiKey = apiKeyInputElement.value.trim();
  if (!apiKey) {
    aiStatusElement.textContent = "⚠️ Insere clavem API";
    aiStatusElement.className = "ai-error";
    return;
  }

  // Save the API key
  setApiKey(apiKey);

  // Get current settings
  const selectedDeclensions = [];
  const selectedConjugations = [];
  const selectedTenses = [];
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

  const adjectivesEnabled = adjectivesCheckboxElement.checked;

  // Validate settings
  if (selectedConjugations.length === 0) {
    aiStatusElement.textContent = "⚠️ Selige coniugationes";
    aiStatusElement.className = "ai-error";
    return;
  }

  if (selectedDeclensions.length === 0) {
    aiStatusElement.textContent = "⚠️ Selige declinationes";
    aiStatusElement.className = "ai-error";
    return;
  }

  if (selectedTenses.length === 0) {
    aiStatusElement.textContent = "⚠️ Selige tempora";
    aiStatusElement.className = "ai-error";
    return;
  }

  // Get thinking mode from radio buttons
  const thinkingMode = document.querySelector('input[name="thinkingMode"]:checked').value;
  const thinkingBudget = thinkingMode === "slow" ? AI_THINKING_BUDGET_SLOW : AI_THINKING_BUDGET_QUICK;

  // Show loading state
  aiStatusElement.textContent = "Generans...";
  aiStatusElement.className = "ai-loading";
  generateAiButtonElement.disabled = true;

  const startTime = performance.now();

  try {
    aiGeneratedPhrases = await generateAIPhrases(
      selectedDeclensions,
      selectedConjugations,
      selectedTenses,
      pronounsEnabled,
      adjectivesEnabled,
      storyModeCheckboxElement.checked,
      thinkingBudget
    );

    const elapsedSeconds = ((performance.now() - startTime) / 1000).toFixed(1);

    // Persist phrases to localStorage
    saveAIPhrases(aiGeneratedPhrases);

    aiStatusElement.textContent = `✓ ${aiGeneratedPhrases.length} sententiae (${elapsedSeconds}s)`;
    aiStatusElement.className = "ai-success";

    // Load the AI phrases
    loadedPhrases = [...aiGeneratedPhrases];
    if (randomizeCheckboxElement.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;

    // Reset to submit mode
    translationInputElement.removeEventListener("keydown", handleKeyDownNext);
    translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
    translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

    displayPhrase();
  } catch (error) {
    console.error("AI generation error:", error);
    aiStatusElement.textContent = `⚠️ ${error.message}`;
    aiStatusElement.className = "ai-error";
  } finally {
    generateAiButtonElement.disabled = false;
  }
});

//
// Initialization.
//

conjugationCheckboxes.forEach(updateGroupCheckbox);
declensionCheckboxes.forEach(updateGroupCheckbox);
tenseCheckboxes.forEach(updateGroupCheckbox);
sectionCheckboxes.forEach(updateGroupCheckbox);

// Initialize AI mode (checked by default)
aiModeSettingsElement.classList.remove("hidden");
const savedKey = getApiKey();
if (savedKey) {
  apiKeyInputElement.value = savedKey;
}

// Load saved AI phrases from localStorage
const savedPhrases = getAIPhrases();
if (savedPhrases && savedPhrases.length > 0) {
  aiGeneratedPhrases = savedPhrases;
  loadedPhrases = [...aiGeneratedPhrases];
  if (randomizeCheckboxElement.checked) {
    shuffle(loadedPhrases);
  }
  currentPhraseIndex = 0;
  aiStatusElement.textContent = `✓ ${aiGeneratedPhrases.length} sententiae`;
  aiStatusElement.className = "ai-success";
  displayPhrase();
} else {
  currentPhraseElement.textContent = "⚠️ Preme 'Generare'";
}

updateScore();
