var $p={};
var synth = window.speechSynthesis;


var inputTxt = document.querySelector('#text_erea');
var button = document.querySelector("#btn");
var resultTxt = document.querySelector('#result');

if (button) {
    button.addEventListener('click', function(){
        $p.spr.load();
        $p.spr.startSpeachRecognation();
        resultTxt.textContent = $p.spr.result;
    });
}
var recognition = new webkitSpeechRecognition();


var voices = [];
$p.spr={
load:function($elm){
    recognition.lang = 'fa-IR'
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onresult = function (event) {
     for (var i = event.resultIndex; i < event.results.length; ++i) {
       inputTxt.textContent = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        inputTxt.textContent = event.results[i][0].transcript;
        this.result = event.results[i][0].transcript;
        stopSpeachRecognation();
      }
     }
    };
}
,startSpeachRecognation:function(){
    inputTxt.textContent = 'Listening .... ';
    recognition.start();
    
},
stopSpeachRecognation:function(){
    recognition.stop();
},result:""

}