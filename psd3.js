var $p ={};

var synth = window.speechSynthesis;
//create speech recognition object
var recognition = new webkitSpeechRecognition();

var resultText = document.querySelector('.text_area');
var button = document.querySelector(".mic");

//queryselector type of checkbox input
var checkbox = document.querySelector("input[type='checkbox']");
//is checkbox checked change recognition language
checkbox.addEventListener('change', function(){
    if(checkbox.checked){
        $p.spr.changeLanguage('en-US');
        resultText.textContent = "language change to " + recognition.lang;
    }else{
        $p.spr.changeLanguage('fa-IR');
        resultText.textContent = "زبان به " + recognition.lang;
    }
    
});

//if button exists, add click event for start recognition
if (button) {
    button.addEventListener('click', function(){
        $p.spr.load();
        $p.spr.startSpeachRecognation();
        resultText.textContent = $p.spr.result;
    });
}

$p.spr = {
    //load speech recognition
    load:function($elm){
        //set recognition language to parameter or default to English
        // recognition.lang = $elm.attr('data-lang') || 'en-US';
        //set continuous mode to true
        recognition.continuous = true;
        //set interim results to true
        recognition.interimResults = true;
        //add event listener for result
        recognition.onresult = function (event) {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    this.result = event.results[i][0].transcript;
                    resultText.textContent = event.results[i][0].transcript;
                    stopSpeachRecognation();
                }
            }
        }
    },
    startSpeachRecognation:function(){
        //start recognition
        recognition.start();
        //set result to listening
        //if language is English else set to listening in Farsi
        if(recognition.lang == 'en-US'){
            this.result = 'Listening...';
        }else{  
            this.result = 'در حال گوش دادن ...';
        }        
    },
    stopSpeachRecognation:function(){
        //stop recognition
        recognition.stop();
        
    },
    //result is the final result of the recognition
    result:""
    //change recognition language function
    ,changeLanguage:function(lang){
        recognition.lang = lang;
    }
};


 


