/******************
Based on original code by Vamoss & Guilherme Vieira,
Code by Rodrigo Junqueira (RodJun)
******************/

let tamanho, quadrados;
let paleta = [
  "#004aa3",
  "#ff666c",
  "#e6e6d8"
];

/* FERRAMENTA */

let corTipografia;

/* texto tag */
let corFundoTipografiaTag;
let fonteTag;
let tamanhoTextoTag = 32;

/* texto principal */
let corFundoTipografiaPrincipal;
let fontePrincipal;
let tamanhoTextoPrincipal;
let nrLinhasTextoPrincipal = 5;

/* interface */
let inputTag;
let inputData;
let inputTextoPrincipal = [];
let buttonGerar;
let buttonSalvar;
let buttonContagemRegressiva;

function preload() {
  fonteTag = loadFont('assets/fonts/Tomorrow-Medium.ttf');
  fontePrincipal = loadFont('assets/fonts/Fraunces144ptSuperSoft-Black.otf');
}

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  tamanho = min(width, height) / 5;
  inicializaQuadrados();
  inicializaInterface();
  inicializaTipografia();
}

function inicializaQuadrados(){
  quadrados = [];
  for(let y = 0; y < height; y += tamanho){
    for(let x = 0; x < width; x += tamanho){
      var grafico = createGraphics(tamanho, tamanho);
      //grafico.pixelDensity(1);
      grafico.noFill();
      
      shuffle(paleta, true);
      var cor = paleta[0];
      
      var ondas = [];
      var distancia = dist(x, y, width/2, height/2);
      if(random() < distancia/(width/2)){
        // altura, resolucao_x, resolucao_y, frequencia, velocidade 
        ondas[0] = new Onda(grafico, paleta[1], random(30, 100), 8, 10, random(0.01, 0.3), 0.01);
        ondas[1] = new Onda(grafico, paleta[2], random(30, 100), 8, 20, random(0.01, 0.3), -0.01);
        quadrados.push({grafico, x, y, cor, ondas});
      }else{
        grafico.background(cor);
        image(grafico, x, y);
      }
    }
  }
}

function draw() {
  //draw grid
  const t = frameCount/200;
  quadrados.forEach((quadrado, index) => {
    quadrado.grafico.background(quadrado.cor);
    quadrado.ondas[0].desenhar();
    quadrado.ondas[1].desenhar();
    image(quadrado.grafico, quadrado.x, quadrado.y);
  });
  desenhaTipografia();

}



class Onda {
  constructor(grafico, cor, altura, resolucao_x, resolucao_y, frequencia, velocidade) {
    this.grafico = grafico;
    this.cor = cor;
    this.altura = altura;
    this.resolucao_x = resolucao_x;
    this.resolucao_y = resolucao_y;
    this.frequencia = frequencia;
    this.velocidade = velocidade;
    this.tempo = 0;
  };

  desenhar() {
    this.grafico.stroke(this.cor);
    for (let y = -this.altura; y < this.grafico.height + this.altura; y += this.resolucao_y) {
      let comprimento = 0;
      this.grafico.beginShape();
      for (let x = 0; x < this.grafico.width + this.resolucao_x; x += this.resolucao_x) {
        let y_sin = sin(comprimento + this.tempo) * this.altura + y;
        this.grafico.vertex(x, y_sin);
        comprimento += this.frequencia;
      }
      this.grafico.endShape();
    }

    this.tempo += this.velocidade;
  }
}

function inicializaInterface() {
  /* tag */
  inputTag = createInput();
  inputTag.addClass('tag-line');

  /* texto principal */
  inputTag.position(width,0);
  for (let i = 0; i < nrLinhasTextoPrincipal; i++) {
    inputTextoPrincipal.push(createInput());
    inputTextoPrincipal[i].input(atualizaTamanhoTextoPrincipal);
    inputTextoPrincipal[i].position(width,40*(i + 1));
  }

  /* gerar & salvar */
  buttonGerar = createButton('gerar');
  buttonGerar.position(width, height-67);
  buttonGerar.mousePressed(gerar);

  buttonSalvar = createButton('salvar');
  buttonSalvar.position(width+100, height-67);
  buttonSalvar.mousePressed(salvar);

  /* contagem regressiva */
  inputData = createInput("um dia importante");
  inputData.id('dia');
  flatpickr("#dia", { dateFormat: "d-m-Y" });
  inputData.position(width,height/2);

  buttonContagemRegressiva = createButton('faltam quantos dias?');
  buttonContagemRegressiva.position(width,height/2 + 40);
  buttonContagemRegressiva.class('contagem-regressiva');
  buttonContagemRegressiva.mousePressed(calcularContagemRegressiva);

}

function inicializaTipografia() {
  let _paleta = [...paleta];
  corFundoTipografiaTag = _paleta.splice(floor(random(_paleta.length)),1);
  corFundoTipografiaPrincipal = _paleta.splice(floor(random(_paleta.length)),1);
  corTipografia = _paleta.splice(floor(random(_paleta.length)),1);
}

function atualizaTamanhoTextoPrincipal() {
  let algumaLinha = false;
  for (let i = 0; i < inputTextoPrincipal.length; i++) {
    if (inputTextoPrincipal[i].value().length > 0) {
      algumaLinha = true;
      break;
    }
  }
  let maiorLinha;
  if (algumaLinha) {
    maiorLinha = 0;
    for (let i = 1; i < inputTextoPrincipal.length; i++) {
      if (inputTextoPrincipal[i].value().length > inputTextoPrincipal[maiorLinha].value().length) {
        maiorLinha = i;
      }
    }    
  }
  tamanhoTextoPrincipal = 1;
  textSize(tamanhoTextoPrincipal);
  while (textWidth(inputTextoPrincipal[maiorLinha].value()) < tamanho*1.8) {
    tamanhoTextoPrincipal += 0.5;
    textSize(tamanhoTextoPrincipal);
  }
}


function desenhaTipografia() {
  push();
  noStroke();
  translate(tamanho,tamanho);
  textAlign(CENTER,CENTER);

  /* tag */
  fill(corFundoTipografiaTag);
  textFont(fonteTag);
  textSize(tamanhoTextoTag);
  textLeading(tamanhoTextoTag);  
  rect(0,-tamanho/8,textWidth(textoTag())*1.3,tamanho/8 + tamanho/4);
  fill(corTipografia);
  text(textoTag(),0,-tamanho/8,textWidth(textoTag())*1.3,tamanho/4*1.5*0.85);
  
  /* principal */
  textFont(fontePrincipal);
  textSize(tamanhoTextoPrincipal);
  textLeading(tamanhoTextoPrincipal);
  fill(corFundoTipografiaPrincipal);
  rect(0,(textoTag().length > 0?tamanho/4:0),tamanho*3,(textoTag().length > 0?tamanho*2.5 + tamanho/4:tamanho*3));
  fill(corTipografia);
  text(textoPrincipal(),0,(textoTag().length > 0?tamanho/4:0),tamanho*3,(textoTag().length > 0?tamanho*2.5 + tamanho/4:tamanho*3));
  pop();
}

function textoTag() {
  /* monta texto da tag line */
  return inputTag.value().toUpperCase();
}

function textoPrincipal() {
  /* monta texto principal a partir dos inputs */
  let t = "";
  for (let i = 0; i < inputTextoPrincipal.length; i++) { 
    let l = trim(inputTextoPrincipal[i].value()).toUpperCase();
    if (l.length > 0) {
      t += l;
      if (i < inputTextoPrincipal.length-1) {
        t += "\n"
      }
    }
  }
  return t;
}

function calcularContagemRegressiva() {
  let parseDia = inputData.value().split('-');
  let hoje = new Date(); 
  let evento = new Date(parseDia[1] + "/" + parseDia[0] + "/" + parseDia[2]);
  let diferenca = evento.getTime() - hoje.getTime(); 
  var dias = ceil(diferenca / (1000 * 3600 * 24)); 
  inputTag.value("FALTA" + (dias != 1?"M":"") + " " + dias + " DIA" + (dias != 1?"S":""));
}

function gerar() {
  inicializaQuadrados();
  inicializaTipografia();
}

function salvar() {
  saveCanvas('pcd-post', 'png');
}