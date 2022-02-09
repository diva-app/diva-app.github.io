var $p = {};

var synth = window.speechSynthesis;
//create speech recognition object
var recognition = new webkitSpeechRecognition();

var resultText = document.querySelector('.text_area');
var mic_fa = document.querySelector(".mic-fa");
var mic_en = document.querySelector(".mic-en");


mic_fa.addEventListener("click", function () {
    $p.spr.load({ language: "fa-IR" });
    mic_fa.style.color = "#CD0000";
    resultText.textContent = "در حال گوش دادن ...";
    resultText.style.direction = "rtl";
    $p.spr.startSpeachRecognation();
});

mic_en.addEventListener("click", function () {
    $p.spr.load({ language: "en-US" });
    mic_en.style.color = "#CD0000";
    resultText.textContent = "Listening ...";
    resultText.style.direction = "ltr";
    $p.spr.startSpeachRecognation();
});


$p.spr = {
    //load speech recognition
    load: function ($elm) {
        recognition.lang = $elm.language;
        recognition.continuous = true;
        recognition.interimResults = true;

    },
    startSpeachRecognation: function () {
        recognition.start();
    },
    stopSpeachRecognation: function () {
        recognition.stop();
    },
    onResult: function (event) {
        var re = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                re += event.results[i][0].transcript;
            } else {
                re += event.results[i][0].transcript;
            }
        }
        $p.spr.stopSpeachRecognation();
        $p.spr.changeView(re);
    },
    changeView: function (text) {
        mic_fa.style.color = "grey";
        mic_en.style.color = "grey";
        resultText.textContent = text;
    }
};

recognition.onresult = $p.spr.onResult;
recognition.onerror = function (event) {
    console.log("Error: " + event.error);
};





