const select = document.querySelectorAll("select"),
    fromText = document.querySelector(".fromText"),
    toText = document.querySelector(".toText"),
    exchange = document.querySelector(".fa-exchange-alt"),
    icons = document.querySelectorAll(".row .icons"),
    transBtn = document.querySelector(".transBtn");

select.forEach((tag, id) => {
    for (const daCountry in countries) {
        let selected;
        if (id == 0 && daCountry == "en-GB") {
            selected = "selected"
        }
        else if (id == 1 && daCountry == "hi-IN") {
            selected = "selected"
        }
        let option = `<option value="${daCountry}" ${selected}>${countries[daCountry]}</option>`;
        tag.insertAdjacentHTML("beforeend", option)
    }
});

transBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = select[0].value,
        translateTo = select[1].value;
    assignAPI(text, translateFrom, translateTo);

});

exchange.addEventListener("click", () => {
    let newToText = fromText.value,
        newSelect = select[0].value;
    select[0].value = select[1].value;
    select[1].value = newSelect;
    fromText.value = toText.value;
    toText.value = newToText;
})

function assignAPI(text, translateFrom, translateTo) {
    apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
    });
}

function iconFunction(n, btn) {
    if (btn == 'copy') {
        if (n == 0) {
            navigator.clipboard.writeText(fromText.value);
        }
        else {
            navigator.clipboard.writeText(toText.value);
        }
    }
    else if (btn == 'speek') {
        let utter;

        if (n == 0) {
            utter = new SpeechSynthesisUtterance(fromText.value);
        }
        else {
            utter = new SpeechSynthesisUtterance(toText.value);
        }
        utter.lang = select[n].value;
        speechSynthesis.speak(utter);
    }
    else if (btn == 'record') {
        recording();
    }
}


function recording() {
    const speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
        fromText.innerHTML = transcript;

        assignAPI(transcript, select[0].value, select[1].value);
    });

    if (speech == true) {
        recognition.start();
    }
    else {
        alert("Your Mic Isn't On.");
    }
}

