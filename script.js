Color = function(hexOrObject) {
    var obj;
    if (hexOrObject instanceof Object) {
        obj = hexOrObject;
    } else {
        obj = LinearColorInterpolator.convertHexToRgb(hexOrObject);
    }
    this.r = obj.r;
    this.g = obj.g;
    this.b = obj.b;
}
Color.prototype.asRgbCss = function() {
    return "rgb("+this.r+", "+this.g+", "+this.b+")";
}

var LinearColorInterpolator = {
    // convert 6-digit hex to rgb components;
    // accepts with or without hash ("335577" or "#335577")
    convertHexToRgb: function(hex) {
        match = hex.replace(/#/,'').match(/.{1,2}/g);
        return new Color({
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16)
        });
    },
    // left and right are colors that you're aiming to find
    // a color between. Percentage (0-100) indicates the ratio
    // of right to left. Higher percentage means more right,
    // lower means more left.
    findColorBetween: function(left, right, percentage) {
        newColor = {};
        components = ["r", "g", "b"];
        for (var i = 0; i < components.length; i++) {
            c = components[i];
            newColor[c] = Math.round(left[c] + (right[c] - left[c]) * percentage / 100);
        }
        return new Color(newColor);
    }
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
   
var canvas = d3.select("#grafico").append("svg")
                .attr("width", 2560 )
                .attr("height", 1440)
                

let estados = {}
let interval = null
let diaAtual = 0
let diaFinal = 0
let somaTotalCasos= 0;


d3.csv("./estados.csv").then( function (data){
    //data é um argumento da função, a função then recebe os valores da função csv e passa data (que é um array de objetos do csv)
    //console.log(data);
    for(var key in data){
        let text= data[key][Object.keys(data[key])[0]].split(";")
        //uma string partida em tres
        //array de strings 
        let estado = text[0] //estados
        if (estado === "estado"){
            continue;
        }
        let dia = text[1] //dia
        let quantidade = parseInt(text[2], 10)//quantidaDeCasos
        
        let casosObjetos = {DIA: dia, QUANTIDADE: quantidade}
        if(estados[estado] === undefined ){ 
            //estado atual não existe ainda, crio ele 
            //o estado é um objeto que possui um array de casos. um caso é um objeto que contem {DIA: dia, QUANTIDADE: quantidade}
            estados[estado] = {caso: [casosObjetos], casoTotal: quantidade}
        } else {
            //o estado já existe, atualiza a lista de casos do estado (adc um novo caso)
            estados[estado].caso.push(casosObjetos) 

        }
    }
    interval = setInterval(desenhaGrafico, 150)
    diaFinal = estados["Rondonia"].caso.length 
})

function desenhaGrafico(){

    //console.log(diaAtual)
    //console.log(diaFinal)

    let i=0;
    //vai limpar tela e desenhar
    if (diaAtual === diaFinal-2){
        clearInterval(interval)
        return 
    }

    canvas = d3.select("#grafico").append("svg")
                .attr("width", 2560)
                .attr("height", 1440)
                
    $("#diaPrint").text(estados["Rondonia"].caso[diaAtual].DIA)           
    $("#totalCasosPrint").text(somaTotalCasos)           


    for(var key in estados){
        if (estados[key].caso[diaAtual] === undefined){
            continue
        }

        somaTotalCasos = somaTotalCasos + estados[key].casoTotal

        let l = new Color ("#8d8f8e");
        let r = new Color("#bf0016");
        let pct = estados[key].casoTotal/50
        if (pct > 100){
            pct =100
        }
        let bg = LinearColorInterpolator.findColorBetween(l, r, pct).asRgbCss();
        let estadoHtml = document.getElementById(key.toLowerCase())
        if (estadoHtml === null){
            console.log(key)

        }
        estadoHtml.style.fill = bg
        i= i + 1;
        
        estados[key].casoTotal = estados[key].casoTotal + estados[key].caso[diaAtual + 1].QUANTIDADE        
    }

    diaAtual = diaAtual + 1;
    if (diaAtual === diaFinal){
        clearInterval(interval)
    }
    
            
}

// function voltarTudo(){
//     diaAtual = 0;
//     somaTotalCasos = 0
//     clearInterval(interval)
//     desenhaGrafico()
// }

function playDia(){
    clearInterval(interval)
    interval = setInterval(desenhaGrafico, 150)


}
function pauseDia(){
    clearInterval(interval)
}
function avancaDia(){
    diaAtual = diaAtual;
    clearInterval(interval)
    desenhaGrafico()
}