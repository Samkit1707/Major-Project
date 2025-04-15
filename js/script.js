const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchageIcon = document.querySelector(".exchange"),
      selectTag = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
      translateBtn = document.querySelector("button"),
      micBtn = document.getElementById("from-mic");

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0
            ? country_code == "en-GB" ? "selected" : ""
            : country_code == "bn-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach(match => {
                if (match.id === 0) {
                    toText.value = match.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else if (target.classList.contains("fa-volume-up")) {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});

// ✅ Mic (Speech Recognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
        recognition.lang = selectTag[0].value; // Update to selected source language
        recognition.start();
        micBtn.classList.add("listening");
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        fromText.value = transcript;
        toText.value = ""; // clear translation
    };

    recognition.onerror = (event) => {
        alert("Speech Recognition Error: " + event.error);
    };

    recognition.onend = () => {
        micBtn.classList.remove("listening");
    };
} else if (micBtn) {
    micBtn.style.display = "none";
    alert("Speech Recognition not supported in your browser.");
}
