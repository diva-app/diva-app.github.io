var $p={};
var synth = window.speechSynthesis;


var inputTxt = document.querySelector('#text_erea');
var button = document.querySelector("#btn");

if (button) {
    button.addEventListener('click', function(){
        $p.spr.recognize();
    });
}

var voices = [];
$p.spr={
load:function($elm){
    alert($elm);
}
,recognize:function(){
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'fa-IR'
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onresult = function (event) {
     for (var i = event.resultIndex; i < event.results.length; ++i) {
       inputTxt.text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        inputTxt.text = event.results[i][0].transcript;
        recognition.stop();
      }
     }
    };
    recognition.start();
  
}

}