var $p={};
var synth = window.speechSynthesis;


var inputTxt = document.querySelector('#text_erea');
var button = document.querySelector("#btn");

if (button) {
    button.addEventListener('click', function(){
        inputTxt.textContent = "dasdadas";
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
       inputTxt.textContent = event.results[i][0].transcript+"asda";
      if (event.results[i].isFinal) {
        inputTxt.textContent = event.results[i][0].transcript+ "end";
        recognition.stop();
      }
     }
    };

    recognition.start();
  
}

}