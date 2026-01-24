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
const aiModeSettingsElement = document.getElementById("aiModeSettings");
const apiKeyInputElement = document.getElementById("apiKeyInput");
const generateAiButtonElement = document.getElementById("generateAiButton");
const aiStatusElement = document.getElementById("aiStatus");
const adjectivesCheckboxElement = document.getElementById("adjectivesCheckbox");
const modeRadios = document.querySelectorAll('input[name="mode"]');

const groupCheckboxes = document.querySelectorAll(".group-checkbox");
const conjugationCheckboxes = document.querySelectorAll(".conjugation-checkbox");
const declensionCheckboxes = document.querySelectorAll(".declension-checkbox");
const tenseCheckboxes = document.querySelectorAll(".tense-checkbox");
const sectionCheckboxes = document.querySelectorAll(".section-checkbox");
const nounCountSelectElement = document.getElementById("nounCountSelect");
const verbCountSelectElement = document.getElementById("verbCountSelect");
const adjectiveCountSelectElement = document.getElementById("adjectiveCountSelect");

let loadedPhrases = [];
let currentPhraseIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
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
  });
});

// Handle group checkboxes
groupCheckboxes.forEach((groupCheckbox) => {
  groupCheckbox.addEventListener("change", function () {
    const group = document.getElementById(this.dataset.group);
    const checkboxes = group.querySelectorAll(
      ".conjugation-checkbox, .declension-checkbox, .tense-checkbox, .section-checkbox"
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});

// Changing randomization reshuffles AI phrases.
randomizeCheckboxElement.addEventListener("change", function () {
  if (loadedPhrases.length > 0) {
    if (this.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;
    displayPhrase();
  }
});

// Handle collapsible Fabulae section (if it exists)
const fabulaeLabel = document.querySelector("#groupFabulae > label");
if (fabulaeLabel) {
  fabulaeLabel.addEventListener("click", function (event) {
    // Don't toggle if clicking directly on the checkbox
    if (event.target.tagName === "INPUT") {
      return;
    }
    // Prevent the label from toggling the checkbox
    event.preventDefault();
    document.getElementById("groupFabulae").classList.toggle("collapsed");
  });
}

// Enter starts in submit mode.
translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

// Dismiss story button
dismissStoryButtonElement.addEventListener("click", hideFullStory);

// Save API key when changed
apiKeyInputElement.addEventListener("change", function () {
  setApiKey(this.value);
});

// Generate AI phrases button
generateAiButtonElement.addEventListener("click", async function () {
  // Check which mode is selected
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;
  const storyMode = selectedMode === "story";
  const agreementMode = selectedMode === "agreement";
  const vocabularyMode = selectedMode === "vocabulary";
  const phrasesMode = selectedMode === "phrases";

  // Vocabulary and Phrases modes don't need API key
  const needsApiKey = storyMode || agreementMode;

  if (needsApiKey) {
    const apiKey = apiKeyInputElement.value.trim();
    if (!apiKey) {
      aiStatusElement.textContent = "⚠️ Insere clavem API";
      aiStatusElement.className = "ai-error";
      return;
    }
    // Save the API key
    setApiKey(apiKey);
  }

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

  // Get selected stories for phrases mode
  const selectedStories = [];
  sectionCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedStories.push(checkbox.value);
    }
  });

  // Validate settings based on mode
  if (phrasesMode) {
    // Phrases mode needs at least one story selected
    if (selectedStories.length === 0) {
      aiStatusElement.textContent = "⚠️ Selige fabulās";
      aiStatusElement.className = "ai-error";
      return;
    }
  } else if (vocabularyMode) {
    // Vocabulary mode needs at least nouns, verbs, or adjectives
    if (selectedDeclensions.length === 0 && selectedConjugations.length === 0 && !adjectivesEnabled) {
      aiStatusElement.textContent = "⚠️ Selige vocabula";
      aiStatusElement.className = "ai-error";
      return;
    }
  } else if (agreementMode) {
    // Agreement mode needs declensions
    if (selectedDeclensions.length === 0) {
      aiStatusElement.textContent = "⚠️ Selige declinationes";
      aiStatusElement.className = "ai-error";
      return;
    }
  } else if (storyMode) {
    // Story mode requires declensions, conjugations, and tenses
    if (selectedDeclensions.length === 0) {
      aiStatusElement.textContent = "⚠️ Selige declinationes";
      aiStatusElement.className = "ai-error";
      return;
    }
    if (selectedConjugations.length === 0) {
      aiStatusElement.textContent = "⚠️ Selige coniugationes";
      aiStatusElement.className = "ai-error";
      return;
    }
    if (selectedTenses.length === 0) {
      aiStatusElement.textContent = "⚠️ Selige tempora";
      aiStatusElement.className = "ai-error";
      return;
    }
  }

  // Get vocabulary sample counts from selectors ("all" means no limit)
  const nounCountValue = nounCountSelectElement.value;
  const verbCountValue = verbCountSelectElement.value;
  const adjectiveCountValue = adjectiveCountSelectElement.value;
  const nounCount = nounCountValue === "all" ? Infinity : parseInt(nounCountValue, 10);
  const verbCount = verbCountValue === "all" ? Infinity : parseInt(verbCountValue, 10);
  const adjectiveCount = adjectiveCountValue === "all" ? Infinity : parseInt(adjectiveCountValue, 10);

  // Handle non-AI modes synchronously
  if (vocabularyMode) {
    aiGeneratedPhrases = generateVocabularyPhrases(
      selectedDeclensions,
      selectedConjugations,
      adjectivesEnabled,
      nounCount,
      verbCount,
      adjectiveCount
    );

    aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} vocābula`;
    aiStatusElement.className = "ai-success";

    loadedPhrases = [...aiGeneratedPhrases];
    if (randomizeCheckboxElement.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;

    translationInputElement.removeEventListener("keydown", handleKeyDownNext);
    translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
    translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

    displayPhrase();
    return;
  }

  if (phrasesMode) {
    // Collect phrases from selected stories
    aiGeneratedPhrases = [];
    selectedStories.forEach((storyId) => {
      if (stories[storyId]) {
        aiGeneratedPhrases.push(...stories[storyId]);
      }
    });

    aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} locutiones`;
    aiStatusElement.className = "ai-success";

    loadedPhrases = [...aiGeneratedPhrases];
    if (randomizeCheckboxElement.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;

    translationInputElement.removeEventListener("keydown", handleKeyDownNext);
    translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
    translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

    displayPhrase();
    return;
  }

  // Show loading state for AI modes
  aiStatusElement.textContent = "Generans...";
  aiStatusElement.className = "ai-loading";
  generateAiButtonElement.disabled = true;

  const startTime = performance.now();

  try {
    if (agreementMode) {
      // Agreement practice mode
      aiGeneratedPhrases = await generateAgreementPhrases(
        selectedDeclensions,
        nounCount,
        adjectiveCount
      );
    } else {
      // Story mode
      aiGeneratedPhrases = await generateAIPhrases(
        selectedDeclensions,
        selectedConjugations,
        selectedTenses,
        pronounsEnabled,
        adjectivesEnabled,
        nounCount,
        verbCount,
        adjectiveCount
      );
    }

    const elapsedSeconds = Math.round((performance.now() - startTime) / 1000);

    // Persist phrases to localStorage
    saveAIPhrases(aiGeneratedPhrases);

    const countLabel = agreementMode ? "locutiones" : "sententiae";
    aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} ${countLabel} (${toRoman(elapsedSeconds)} s)`;
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

// Load saved API key if available
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
  aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} sententiae`;
  aiStatusElement.className = "ai-success";
  displayPhrase();
} else {
  currentPhraseElement.textContent = "⚠️ Preme 'Generare'";
}

updateScore();
