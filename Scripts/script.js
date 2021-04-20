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
    //usar forEach aqui
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
    paginaDoQuizz()
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
}
const paginaInicial = document.querySelector(".pagina-inicial");
const paginaQuizz = document.querySelector(".pagina-Quizz");
function paginaDoQuizz() {
    paginaInicial.classList.add("oculto");
    paginaQuizz.classList.remove("oculto");
}
function adicionarCapaDoQuizz() {
    paginaQuizz.innerHTML = `
    <div class="Quizz-titulo"><img src=${quizSelecionado.image}> alt="">
        <div class="titulo">${quizSelecionado.title}</div>
    </div>
    <article class="container-pergunta"></article>
    <article class="container-resultado"></article>
    `;
}

function adicionarPergunta() {
    const elementoPerguntas = document.querySelector(".container-pergunta")
    const perguntas = quizSelecionado.questions;
    console.log(perguntas)
    for(let i = 0; i < perguntas.length; i++) {
        elementoPerguntas.innerHTML += `
        <div class="pergunta" style="background-color:${perguntas[i].color};">
            ${perguntas[i].title}
        </div>
        <article class="respostas"></article>
        `;
    }
    renderizarRespostas(perguntas)
}
let respostas = [];
function renderizarRespostas(perguntas) {
    
    for(let i =0; i < perguntas.length; i++) {
        respostas.push(perguntas[i].answers)
    }
    for(let i = 0; i < respostas.length; i++) {
        const elementoRespostas = document.querySelector(`.container-pergunta article:nth-of-type(${i+1})`)
        respostas[i].sort(() => Math.random() - 0.5)
        for(let j = 0; j < respostas[i].length; j++) {
            elementoRespostas.innerHTML += `
            <div class="resposta" onclick="selecionarResposta(this)">
                <img src=${respostas[i][j].image}>
                <p>${respostas[i][j].text}</p>
            </div>
            `;
        }
    }
}
function adicionarButaoVoltar() {
    paginaQuizz.innerHTML += `
        <button class="reinicia-quizz">Reiniciar Quizz</button>
        <button onclick="irParaPaginaInicial()" class="retorna-inicio">Voltar pra home</button>
    `
}
function selecionarResposta(respostaSelecionada) {
    const selecionado = document.querySelector(".selecionado")
    if (selecionado !== null) {
        respostaSelecionada.classList.remove('selecionado');
    } 
    respostaSelecionada.classList.add('selecionado');
    respostaSelecionada.removeAttribute("onclick");

    const perguntaRespondida = respostaSelecionada.parentNode;
    const todasRespostas = perguntaRespondida.children;
    for(let i = 0; i < todasRespostas.length; i++) {
        if(!(todasRespostas[i].classList.contains("selecionado"))) {
            todasRespostas[i].classList.add("opacidade")
            todasRespostas[i].removeAttribute("onclick");
        }
    }
}

function irParaPaginaInicial() {
    document.querySelector('.pagina-inicial').classList.remove('oculto');
    document.querySelector('.pagina-Quizz').classList.add('oculto');
    document.querySelector('.pagina-criar-Quizz').classList.add('oculto');
}

