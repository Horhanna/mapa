//let json = require('./json.json');
let json = {
    "valor0" : "Pernambuco",
    "valor1" : "Sergipe"

}
console.log(json["valor0"])

$('.estado').click(function(e){
    e.preventDefault()
    // console.log('qualquer coisa')
    // alert("hhh")

    let popup = document.getElementById("myPopup");
    console.log(popup)
    popup.classList.toggle("show");
    let x = e.pageX - 10
    let y = e.pageY - 65
    //x = $(this).offset().left
    //y = $(this).offset().top
    $("#myPopup").css("left", x +"px")
    $("#myPopup").css("top", y +"px")

}) 
