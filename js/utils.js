const romanNumerals = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
];

function toRoman(num) {
    if (num === 0) {
        return "";
    }

    for (let i = 0; i < romanNumerals.length; i++) {
        if (num >= romanNumerals[i][0]) {
            return romanNumerals[i][1] + toRoman(num - romanNumerals[i][0]);
        }
    }
}

function normalize(text) {
    return text
        .normalize("NFD").replace(/\p{Diacritic}/gu, "") // Drop macrons.
        .replace(/[.,:\-—!?'()]/g, "") // Drop punctuation.
        .replace(/\s{2,}/g, " ") // Drop double spaces.
        .trim()
        .toLowerCase();
}

function haveSameWords(phrase1, phrase2) {
    function toSortedWords(text) {
        return text.split(/\s+/).sort();
    }

    const words1 = toSortedWords(normalize(phrase1));
    const words2 = toSortedWords(normalize(phrase2));

    if (words1.length !== words2.length) {
        return false;
    }

    for (let i = 0; i < words1.length; i++) {
        if (words1[i] !== words2[i]) {
            return false;
        }
    }

    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}