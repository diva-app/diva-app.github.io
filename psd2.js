var button = document.querySelector("#btn");
var input = document.querySelector("#text_erea");

if (button) {
    button.addEventListener('click', function(){
        alert(input.value);
    });
}