//
// Variables.
//

const currentPhraseElement = document.getElementById("currentPhrase");
const translationInputElement = document.getElementById("translationInput");
const feedbackElement = document.getElementById("feedback");
const correctCounterElement = document.getElementById("correctCounter");
const randomizeCheckboxElement = document.getElementById("randomizeCheckbox");
const difficultySelectElement = document.getElementById("difficultySelect");
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
const settingsContainerElement = document.querySelector(".settings-container");

// Text mode elements
const textSelectElement = document.getElementById("textSelect");
const TEXT_SELECTION_STORAGE_KEY = "verto_selected_text";
const MODE_STORAGE_KEY = "verto_mode";

const groupCheckboxes = document.querySelectorAll(".group-checkbox");
const conjugationCheckboxes = document.querySelectorAll(".conjugation-checkbox");
const declensionCheckboxes = document.querySelectorAll(".declension-checkbox");
const tenseCheckboxes = document.querySelectorAll(".tense-checkbox");
const nounCountSelectElement = document.getElementById("nounCountSelect");
const nounCount45SelectElement = document.getElementById("nounCount45Select");
const verbCountSelectElement = document.getElementById("verbCountSelect");
const adjectiveCountSelectElement = document.getElementById("adjectiveCountSelect");

let loadedPhrases = [];
let currentPhraseIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let phraseResults = [];
let aiGeneratedPhrases = [];
let loadedPhrasesShufflable = true; // false for texts, whose units must stay in source order

//
// Functions
//

function displayPhrase() {
  currentPhraseElement.textContent = loadedPhrases[currentPhraseIndex].en;
  translationInputElement.value = "";
  feedbackElement.textContent = "";
  translationInputElement.focus();
}

// Replace the current phrase set and restart from the first phrase, with Enter in submit mode.
// Texts pass shufflable = false: their units build on each other and must stay in source order.
function loadPhrases(phrases, shufflable = true) {
  loadedPhrases = [...phrases];
  loadedPhrasesShufflable = shufflable;
  if (shufflable && randomizeCheckboxElement.checked) {
    shuffle(loadedPhrases);
  }
  currentPhraseIndex = 0;
  phraseResults = [];

  translationInputElement.removeEventListener("keydown", handleKeyDownNext);
  translationInputElement.removeEventListener("keydown", handleKeyDownSubmit);
  translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

  displayPhrase();
}

function updateScore() {
  // Half points ("almost" answers) are written the Roman way: S for semis, e.g. "VII S"
  const wholeCorrect = Math.floor(correctAnswers);
  const correctText = correctAnswers > 0
    ? [wholeCorrect > 0 ? toRoman(wholeCorrect) : "", correctAnswers % 1 !== 0 ? "S" : ""].filter((p) => p).join(" ")
    : "Nulla";
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

  const verdict = gradeTranslation(userTranslation, correctTranslation);
  phraseResults[currentPhraseIndex] = verdict;

  if (verdict === "correct") {
    feedbackElement.style.color = "#66BB6A";
    feedbackElement.textContent = "✓ " + correctTranslation;
    correctAnswers++;
  } else if (verdict === "almost") {
    feedbackElement.style.color = "";
    feedbackElement.innerHTML = "<span style=\"color: #FFEE58\">≈</span> " + getColoredFeedback(
      userTranslation,
      correctTranslation
    );
    correctAnswers += 0.5;
  } else {
    feedbackElement.style.color = "";
    feedbackElement.innerHTML = "<span style=\"color: #EF5350\">✗</span> " + getColoredFeedback(
      userTranslation,
      correctTranslation
    );
  }

  totalAnswers++;
  updateScore();
}

function displaySampledWords(words) {
  const stripGloss = (w) => w.replace(/\s*\(.*\)\s*$/, "");
  const lines = [];
  if (words.nouns && words.nouns.length > 0) {
    lines.push(`Nōmina: ${words.nouns.map(stripGloss).join(", ")}`);
  }
  if (words.verbs && words.verbs.length > 0) {
    lines.push(`Verba: ${words.verbs.map(stripGloss).join(", ")}`);
  }
  if (words.adjectives && words.adjectives.length > 0) {
    lines.push(`Adiectīva: ${words.adjectives.map(stripGloss).join(", ")}`);
  }
  fullStoryElement.innerHTML = lines.join("<br><br>");
  storyContainerElement.classList.remove("hidden");
}

function displayFullStory() {
  const latinStory = loadedPhrases
    .map((phrase, i) => {
      const color = phraseResults[i] === "correct" ? "#66BB6A" : phraseResults[i] === "almost" ? "#FFEE58" : "#EF5350";
      return `<span style="color: ${color}">${phrase.la}</span>`;
    })
    .join(" ");
  fullStoryElement.innerHTML = latinStory;
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
    ".conjugation-checkbox, .declension-checkbox, .tense-checkbox"
  );

  const checkedCount = Array.from(checkboxes).filter((cb) => cb.checked).length;

  groupCheckbox.checked = checkedCount === checkboxes.length;
  groupCheckbox.indeterminate =
    checkedCount > 0 && checkedCount < checkboxes.length;
}

// Fill the text dropdown from the library (see js/data/texts.js) and restore the last selection.
function populateTextSelect() {
  textSelectElement.innerHTML = "";

  if (textLibrary.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Nulli textus";
    option.disabled = true;
    option.selected = true;
    textSelectElement.appendChild(option);
    textSelectElement.disabled = true;
    return;
  }

  for (const text of textLibrary) {
    const option = document.createElement("option");
    option.value = text.id;
    option.textContent = text.author ? `${text.title} (${text.author})` : text.title;
    textSelectElement.appendChild(option);
  }

  const savedId = localStorage.getItem(TEXT_SELECTION_STORAGE_KEY);
  if (savedId && textLibrary.some((text) => text.id === savedId)) {
    textSelectElement.value = savedId;
  }
}

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

// Apply the selected mode to the settings panel: CSS shows or hides the settings each mode uses
// (see the [data-mode] rules in main.css), and the action button gets a fitting label.
function updateModeOptions() {
  const selectedMode = getSelectedMode();
  settingsContainerElement.dataset.mode = selectedMode;
  generateAiButtonElement.textContent = selectedMode === "text" ? "Aperire" : "Generare";
}

// Make a library text the current phrase set, in source order, and remember it for reloads.
function loadText(text) {
  localStorage.setItem(TEXT_SELECTION_STORAGE_KEY, text.id);
  aiStatusElement.textContent = `✓ ${toRoman(text.sentences.length)} sententiae`;
  aiStatusElement.className = "ai-success";
  loadPhrases(text.sentences, false);
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

// Handle group checkboxes
groupCheckboxes.forEach((groupCheckbox) => {
  groupCheckbox.addEventListener("change", function () {
    const group = document.getElementById(this.dataset.group);
    const checkboxes = group.querySelectorAll(
      ".conjugation-checkbox, .declension-checkbox, .tense-checkbox"
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});

// Changing randomization reshuffles the loaded phrases (texts excepted: they keep their order).
randomizeCheckboxElement.addEventListener("change", function () {
  if (loadedPhrases.length > 0 && loadedPhrasesShufflable) {
    if (this.checked) {
      shuffle(loadedPhrases);
    }
    currentPhraseIndex = 0;
    displayPhrase();
  }
});

// The selected mode is remembered across reloads, and the settings panel follows it.
modeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    localStorage.setItem(MODE_STORAGE_KEY, this.value);
    updateModeOptions();
  });
});

// Remember the chosen text across reloads.
textSelectElement.addEventListener("change", function () {
  localStorage.setItem(TEXT_SELECTION_STORAGE_KEY, this.value);
});

// Enter starts in submit mode.
translationInputElement.addEventListener("keydown", handleKeyDownSubmit);

// Dismiss story button
dismissStoryButtonElement.addEventListener("click", hideFullStory);

// Save API key when changed
apiKeyInputElement.addEventListener("change", function () {
  setApiKey(this.value);
});

// The Generare / Aperire button: loads the selected text, samples vocabulary, or generates via AI
generateAiButtonElement.addEventListener("click", async function () {
  // Check which mode is selected
  const selectedMode = getSelectedMode();
  const storyMode = selectedMode === "story";
  const agreementMode = selectedMode === "agreement";
  const vocabularyMode = selectedMode === "vocabulary";
  const textMode = selectedMode === "text";

  // Vocabulary and Text modes don't need API key
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

  // Text mode: load the selected authentic text as-is; no sampling or vocabulary settings involved
  if (textMode) {
    const text = textLibrary.find((t) => t.id === textSelectElement.value);
    if (!text) {
      aiStatusElement.textContent = "⚠️ Selige textum";
      aiStatusElement.className = "ai-error";
      return;
    }
    loadText(text);
    return;
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

  // Validate settings based on mode
  if (vocabularyMode) {
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
  const nounCount45Value = nounCount45SelectElement.value;
  const verbCountValue = verbCountSelectElement.value;
  const adjectiveCountValue = adjectiveCountSelectElement.value;
  const nounCount123 = nounCountValue === "all" ? Infinity : parseInt(nounCountValue, 10);
  const nounCount45 = nounCount45Value === "all" ? Infinity : parseInt(nounCount45Value, 10);
  const verbCount = verbCountValue === "all" ? Infinity : parseInt(verbCountValue, 10);
  const adjectiveCount = adjectiveCountValue === "all" ? Infinity : parseInt(adjectiveCountValue, 10);

  // Handle non-AI modes synchronously
  if (vocabularyMode) {
    aiGeneratedPhrases = generateVocabularyPhrases(
      selectedDeclensions,
      selectedConjugations,
      adjectivesEnabled,
      nounCount123,
      nounCount45,
      verbCount,
      adjectiveCount
    );

    aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} vocābula`;
    aiStatusElement.className = "ai-success";

    loadPhrases(aiGeneratedPhrases);
    return;
  }

  // Show loading state for AI modes
  aiStatusElement.textContent = "Generans...";
  aiStatusElement.className = "ai-loading";
  generateAiButtonElement.disabled = true;

  const updateStatus = (text) => { aiStatusElement.textContent = text; };
  const showWords = (words) => { displaySampledWords(words); };

  try {
    let result;
    if (agreementMode) {
      // Agreement practice mode
      result = await generateAgreementPhrases(
        selectedDeclensions,
        nounCount123,
        nounCount45,
        adjectiveCount,
        updateStatus,
        showWords
      );
    } else {
      // Story mode
      result = await generateAIPhrases(
        selectedDeclensions,
        selectedConjugations,
        selectedTenses,
        difficultySelectElement.value,
        adjectivesEnabled,
        nounCount123,
        nounCount45,
        verbCount,
        adjectiveCount,
        updateStatus,
        showWords
      );
    }

    aiGeneratedPhrases = result.phrases;

    // Persist phrases to localStorage
    saveAIPhrases(aiGeneratedPhrases);

    const countLabel = agreementMode ? "locutiones" : "sententiae";
    aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} ${countLabel} (${toRoman(result.generateSeconds)} + ${toRoman(result.verifySeconds)} s)`;
    aiStatusElement.className = "ai-success";

    loadPhrases(aiGeneratedPhrases);
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

// Restore the last mode (the radios carry autocomplete="off", so the browser leaves them to us).
const savedMode = localStorage.getItem(MODE_STORAGE_KEY);
const savedModeRadio = Array.from(modeRadios).find((radio) => radio.value === savedMode);
if (savedModeRadio) {
  savedModeRadio.checked = true;
}
populateTextSelect();
updateModeOptions();

// Load saved API key if available
const savedKey = getApiKey();
if (savedKey) {
  apiKeyInputElement.value = savedKey;
}

// Restore the last phrase set: the chosen text in text mode, otherwise the saved AI phrases.
const savedText = textLibrary.find((t) => t.id === textSelectElement.value);
const savedPhrases = getAIPhrases();
if (getSelectedMode() === "text") {
  if (savedText) {
    loadText(savedText);
  } else {
    currentPhraseElement.textContent = "⚠️ Preme 'Aperire'";
  }
} else if (savedPhrases && savedPhrases.length > 0) {
  aiGeneratedPhrases = savedPhrases;
  aiStatusElement.textContent = `✓ ${toRoman(aiGeneratedPhrases.length)} sententiae`;
  aiStatusElement.className = "ai-success";
  loadPhrases(aiGeneratedPhrases);
} else {
  currentPhraseElement.textContent = "⚠️ Preme 'Generare'";
}

updateScore();
