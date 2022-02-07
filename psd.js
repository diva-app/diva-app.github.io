var $p={};
var synth = window.speechSynthesis;


var inputTxt = document.querySelector('#text_erea');
var button = document.querySelector("#btn");
var result = document.querySelector('#result');

if (button) {
    button.addEventListener('click', function(){
        inputTxt.textContent = "dasdadas";
        $p.spr.recognize();
    });
}

var voices = [];
$p.spr={
    var: recognition = new webkitSpeechRecognition(), 
load:function($elm){
    
    recognition.lang = 'fa-IR'
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onresult = function (event) {
     for (var i = event.resultIndex; i < event.results.length; ++i) {
       inputTxt.textContent = event.results[i][0].transcript+"asda";
       result.textContent = result.textContent + event.results[i][0].textContent;
      if (event.results[i].isFinal) {
        inputTxt.textContent = event.results[i][0].transcript+ "end";
        recognition.stop();
      }
     }
    };
}
,recognize:function(){
    recognition.start();
}

}