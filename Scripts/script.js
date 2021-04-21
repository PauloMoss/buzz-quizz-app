let listaDeQuizzes = [];
let listaDeQuizzesDoUsuario;

obterQuizzes()
function obterQuizzes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
    promessa.then(renderizarQuizzesNaTela)
}
function renderizarQuizzesNaTela(resposta) {
    listaDeQuizzes = resposta.data
    verificarSeusQuizzes()
    renderizarTodosQuizzes()
}
const criarQuiz = document.querySelector(".criarQuizz");
const seusQuizzes = document.querySelector(".seusQuizzes");
const seusQuizzesTitulo = document.querySelector(".seusQuizzesTitulo");
const todosQuizzesTitulo = document.querySelector(".todosQuizzesTitulo");
const ulTodosQuizzes = document.querySelector(".todosQuizzes");
function renderizarTodosQuizzes() {
    ulTodosQuizzes.innerHTML = "";
    for(let i = 0; i < listaDeQuizzes.length; i++) {
        ulTodosQuizzes.innerHTML += `
        <li class="quizz" onclick="escolherQuizz(this)" id="${listaDeQuizzes[i].id}">
            <img src=${listaDeQuizzes[i].image}>
            <div class="nomeDoQuiz">${listaDeQuizzes[i].title}</div>
        </li>
        `;
    }
}
function verificarSeusQuizzes() {
    if(listaDeQuizzesDoUsuario===undefined) {
        seusQuizzes.classList.add("oculto");
        seusQuizzesTitulo.classList.add("oculto")
    } else {
        renderizarSeusQuizzes ()
    }
}
function renderizarSeusQuizzes () {
    // usar find aqui
        criarQuiz.classList.add("oculto");
        seusQuizzes.innerHTML = "";
        for(let i = 0; i < listaDeQuizzesDoUsuario.length; i++) {
            seusQuizzes.innerHTML += `
            <li class="quizz">
                <img src=${listaDeQuizzesDoUsuario[i].image}>
                <div class="nomeDoQuiz">${listaDeQuizzesDoUsuario[i].title}</div>
            </li>
            `;
        }
}
let quizSelecionado;
function escolherQuizz(selecionado) {
    for(let i = 0; i < listaDeQuizzes.length; i++) {
        if(listaDeQuizzes[i].id == selecionado.id) {
            quizSelecionado = listaDeQuizzes[i];
        }
    }
    guardarResultados(quizSelecionado.levels);
    paginaDoQuizz()
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
}
let descriçãoDoNivel;
let titulosResultado =[];
let imagensResultado =[];
let textosResultado =[];
let acertoMinimoResultado =[];
let indiceResultado;
function guardarResultados(Niveis) {
    for(let i=0; i<Niveis.length; i++) {
        titulosResultado.push(Niveis[i].title)
        imagensResultado.push(Niveis[i].image)
        textosResultado.push(Niveis[i].text)
        acertoMinimoResultado.push(Niveis[i].minValue)
    }
}
const paginaInicial = document.querySelector(".pagina-inicial");
const paginaQuizz = document.querySelector(".pagina-Quizz");
function paginaDoQuizz() {
    paginaInicial.classList.add("oculto");
    paginaQuizz.classList.remove("oculto");
}
function adicionarCapaDoQuizz() {
    paginaQuizz.innerHTML = `
    <div class="Quizz-titulo"><img src=${quizSelecionado.image}>
        <div class="titulo">${quizSelecionado.title}</div>
    </div>
    `;
}
let perguntas;
function adicionarPergunta() {
    perguntas = quizSelecionado.questions;
    for(let i = 0; i < perguntas.length; i++) {
        paginaQuizz.innerHTML += `
        <article class="container-pergunta">
            <div class="pergunta" style="background-color:${perguntas[i].color};">
            ${perguntas[i].title}
            </div>
            <article class="respostas naoRespondida"></article>
        </article>
        `;
    }
    renderizarRespostas(perguntas)
}

function renderizarRespostas(perguntas) {
    let todasAsRespostas = [];
    for(let i =0; i < perguntas.length; i++) {
        todasAsRespostas.push(perguntas[i].answers)
    }
    todasAsRespostas.forEach(adicionarResposta)
}
function adicionarResposta(elemento, i) {
    const elementoRespostas = document.querySelector(`article:nth-of-type(${i+1}) .respostas`)
    elemento.sort(() => Math.random() - 0.5)
        for(let j = 0; j < elemento.length; j++) {
            elementoRespostas.innerHTML += `
            <div class="resposta" onclick="selecionarResposta(this)">
                <img src=${elemento[j].image}>
                <p>${elemento[j].text}</p>
            </div>
            `;
            if(elemento[j].isCorrectAnswer) {
                const respostaCorreta = elementoRespostas.children[j];
                respostaCorreta.setAttribute("id", "certa")
            }
        }
}
function adicionarButaoVoltar() {
    paginaQuizz.innerHTML += `
        <article class="container-resultado oculto"></article>
        <button class="reinicia-quizz" onclick="resetarQuizz()">Reiniciar Quizz</button>
        <button onclick="irParaPaginaInicial()" class="retorna-inicio">Voltar pra home</button>
    `
}
let contadorDeJogadas=0;
let contadorDeAcertos=0;
function selecionarResposta(respostaSelecionada) {
    contadorDeJogadas+=1;
    const selecionado = document.querySelector(".selecionado");
    if (selecionado !== null) {
        respostaSelecionada.classList.remove('selecionado');
    } 
    respostaSelecionada.classList.add('selecionado');
    respostaSelecionada.removeAttribute("onclick");
    destacarImagemSelecionada(respostaSelecionada);
    renderizarResultado();
    setTimeout(scrollarProximaPergunta, 2000);
}
function destacarImagemSelecionada(respostaSelecionada) {
    const perguntaRespondida = respostaSelecionada.parentNode;
    const respostasDaPergunta = perguntaRespondida.children;
    for(let i = 0; i < respostasDaPergunta.length; i++) {
        if(!(respostasDaPergunta[i].classList.contains("selecionado"))) {
            respostasDaPergunta[i].classList.add("opacidade")
            respostasDaPergunta[i].removeAttribute("onclick");
        }
    }
    verificarRespostaCerta(respostasDaPergunta)
}
function verificarRespostaCerta(respostasDaPergunta) {
    for(let i = 0; i < respostasDaPergunta.length; i++) {
        if(respostasDaPergunta[i].id==="certa" && respostasDaPergunta[i].classList.contains("selecionado")) {
            respostasDaPergunta[i].classList.add("correta")
            contadorDeAcertos+=1;
        } else if(respostasDaPergunta[i].id==="certa") {
            respostasDaPergunta[i].classList.add("correta")
        } else {
            respostasDaPergunta[i].classList.add("errada")
        }
    }
    atualizarPerguntaRespondida()
}
let perguntaNaorespondida = document.querySelector(".naoRespondida");
function atualizarPerguntaRespondida() {
    let perguntaNaorespondida = document.querySelector(".naoRespondida");
    perguntaNaorespondida.classList.remove('naoRespondida');
    perguntaNaorespondida.classList.add('respondida');
}
function scrollarProximaPergunta() {
    perguntaNaorespondida = document.querySelector(".naoRespondida");
    if(perguntaNaorespondida!==null) {
        perguntaNaorespondida.scrollIntoView({block: "center", behavior: "smooth"});
    } else {
        alert("Fazer scrolar para resultado");
    }
}

function renderizarResultado() {
    if(contadorDeJogadas===perguntas.length) {
        const elementoResultado = document.querySelector(".container-resultado")
        elementoResultado.classList.remove('oculto')
        elementoResultado.innerHTML = `
        <div class="resultado" style="background-color:#EC362D">
            ${resultadoCalculado()[0]}% de acerto: ${resultadoCalculado()[1]}
        </div>
        <article class="resultados">
            <div class="imagem-resultado">
                <img src=${resultadoCalculado()[2]} alt="">
            </div>
            <div class="mensagem-resultado">
                ${resultadoCalculado()[3]}
            </div>
        </article>
        `;
    }
}
function resultadoCalculado() {
    const porcentagemAcerto = Number(100*contadorDeAcertos/contadorDeJogadas).toFixed(0);
    let textoDoNivel;
    let imagemDoNivel;
    for(let j=0; j < acertoMinimoResultado.length; j++){
        if (porcentagemAcerto >= acertoMinimoResultado[j]){
            indiceResultado = j;
            descriçãoDoNivel = titulosResultado[j]
            textoDoNivel = textosResultado[j]
            imagemDoNivel = imagensResultado[j]
        }
    }
    const calculado = [porcentagemAcerto, descriçãoDoNivel, imagemDoNivel, textoDoNivel]
    return calculado;
}
function irParaPaginaInicial() {
    document.querySelector('.pagina-inicial').classList.remove('oculto');
    document.querySelector('.pagina-Quizz').classList.add('oculto');
    document.querySelector('.pagina-criar-Quizz').classList.add('oculto');
}
function resetarQuizz() {
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
    contadorDeJogadas=0;
    contadorDeAcertos=0;
    window.scrollTo(0, 0);
}
function criarQuizz() {
    document.querySelector('.pagina-criar-Quizz').classList.remove('oculto');
    document.querySelector('.tela-3-1').classList.remove('oculto');
    document.querySelector('.pagina-inicial').classList.add('oculto');
}

function criarPerguntas() {
    const okTitulo = validarTitulo(document.querySelector('.dados-entrada-criar input:nth-of-type(1)').value)
    const okUrl = validarUrl(document.querySelector('.dados-entrada-criar input:nth-of-type(2)').value)
    const okQtdNiveis = validarQtdNiveis(document.querySelector('.dados-entrada-criar input:nth-of-type(3)').value)
    const okQtdPerguntas = validarQtdPerguntas(document.querySelector('.dados-entrada-criar input:nth-of-type(4)').value)

    if(okTitulo && okUrl && okQtdNiveis && okQtdPerguntas) {
        document.querySelector('.tela-3-1').classList.toggle('oculto');
        document.querySelector('.tela-3-2').classList.toggle('oculto');
    } else {
        alert('preencha corretamente os dados!')
    }
}
function CriarNiveis() {

    const okUrl = validarUrl(document.querySelector('.dados-entrada-criar input:nth-of-type(2)').value)
}
function validarTextoPergunta(texto) {
    if (texto.length >= 20){
        return true;
    }
    else{
        return false;
    }
}
function validarQtdNiveis(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 2) {
        return true;
    }
    else{
        return false;
    }
}
function validarQtdPerguntas(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 3) {
        return true;
    }
    else{
        return false;
    }
}
function validarTitulo(titulo) {
    if (titulo.length > 20 && titulo.length < 65){
        return true;
    }
    else{
        return false;
    }
}
function validarUrl(url) {
    try {
        new URL(url);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
function validarCorHex(corHexadecimal) {
    return corHexadecimal.match(/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i) !== null;
}