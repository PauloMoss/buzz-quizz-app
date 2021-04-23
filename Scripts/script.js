let listaDeQuizzes = [];
let listaDosSeusQuizzesSerializada;

obterQuizzes()
function obterQuizzes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
    promessa.then(renderizarQuizzesNaTela)
}
function renderizarQuizzesNaTela(resposta) {
    listaDeQuizzes = resposta.data
    verificarSeusQuizzes()
    renderizarTodosQuizzes()
    window.scrollTo(0, 0);
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
        </li>`;
    }
}
function verificarSeusQuizzes() {
    listaDosSeusQuizzesSerializada = localStorage.getItem("SeusQuizzes");
    if(listaDosSeusQuizzesSerializada!==null) {
        listaDosSeusQuizzes = JSON.parse(listaDosSeusQuizzesSerializada)
        criarQuiz.classList.add("oculto")
        renderizarSeusQuizzes (listaDosSeusQuizzes)
    } else {
        seusQuizzes.classList.add("oculto");
        seusQuizzesTitulo.classList.add("oculto")
    }
}
function renderizarSeusQuizzes (listaDosSeusQuizzes) {
        seusQuizzes.innerHTML = "";
        for(let i = 0; i < listaDosSeusQuizzes.length; i++) {
            seusQuizzes.innerHTML += `
            <li class="quizz" onclick="escolherQuizz(this)" id="${listaDosSeusQuizzes[i].id}">
                <img src=${listaDosSeusQuizzes[i].image}>
                <div class="nomeDoQuiz">${listaDosSeusQuizzes[i].title}</div>
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
    atualizarContadoresDaPagina()
    guardarResultados(quizSelecionado.levels);
    paginaDoQuizz()
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
}
function guardarResultados(Niveis) {
    const dadosDoResultado = {titulosResultado: [],imagensResultado: [],textosResultado: [],acertoMinimoResultado: []}
    for(let i=0; i<Niveis.length; i++) {
        dadosDoResultado.titulosResultado.push(Niveis[i].title)
        dadosDoResultado.imagensResultado.push(Niveis[i].image)
        dadosDoResultado.textosResultado.push(Niveis[i].text)
        dadosDoResultado.acertoMinimoResultado.push(Niveis[i].minValue)
    }
    return dadosDoResultado;
}
const paginaInicial = document.querySelector(".pagina-inicial");
const paginaQuizz = document.querySelector(".pagina-Quizz");
const paginaCriarQuizz = document.querySelector(".pagina-criar-Quizz");
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
let elementoResultado;
function adicionarButaoVoltar() {
    paginaQuizz.innerHTML += `
        <article class="container-resultado oculto"></article>
        <button class="reinicia-quizz" onclick="resetarQuizz()">Reiniciar Quizz</button>
        <button onclick="irParaPaginaInicial()" class="retorna-inicio">Voltar pra home</button>
    `
    elementoResultado = document.querySelector(".container-resultado")
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
let perguntaNaorespondida;
function atualizarPerguntaRespondida() {
    perguntaNaorespondida = document.querySelector(".naoRespondida");
    perguntaNaorespondida.classList.remove('naoRespondida');
    perguntaNaorespondida.classList.add('respondida');
}
function scrollarProximaPergunta() {
    perguntaNaorespondida = document.querySelector(".naoRespondida");
    if(perguntaNaorespondida!==null) {
        perguntaNaorespondida.scrollIntoView({block: "center", behavior: "smooth"});
    } else {
        elementoResultado.scrollIntoView({block: "center", behavior: "smooth"});
    }
}
function resultadoCalculado() {
    const porcentagemAcerto = Number(100*contadorDeAcertos/contadorDeJogadas).toFixed(0);
    const dadosDoResultado = guardarResultados(quizSelecionado.levels);
    let textoDoNivel;
    let imagemDoNivel;
    let descriçãoDoNivel;
    for(let j=0; j < dadosDoResultado.acertoMinimoResultado.length; j++){
        if (porcentagemAcerto >= dadosDoResultado.acertoMinimoResultado[j]){
            const indiceResultado = j;
            descriçãoDoNivel = dadosDoResultado.titulosResultado[j]
            textoDoNivel = dadosDoResultado.textosResultado[j]
            imagemDoNivel = dadosDoResultado.imagensResultado[j]
        }
    }
    const calculado = [porcentagemAcerto, descriçãoDoNivel, imagemDoNivel, textoDoNivel]
    return calculado;
}
function renderizarResultado() {
    if(contadorDeJogadas===perguntas.length) {
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
        </article>`;
    }
}
function irParaPaginaInicial() {
    document.querySelector('.pagina-inicial').classList.remove('oculto');
    document.querySelector('.pagina-Quizz').classList.add('oculto');
    document.querySelector('.pagina-criar-Quizz').classList.add('oculto');
    atualizarContadoresDaPagina()
}
function resetarQuizz() {
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
    atualizarContadoresDaPagina()
}
function atualizarContadoresDaPagina() {
    contadorDeJogadas=0;
    contadorDeAcertos=0;
    window.scrollTo(0, 0);
}
const comecePeloComeco = document.querySelector('.tela-3-1');
const crieSuasPerguntas = document.querySelector('.tela-3-2');
const decidaOsNiveis = document.querySelector('.tela-3-3');
const quizzPronto = document.querySelector('.tela-3-4');

function criarQuizz() {
    paginaInicial.classList.add("oculto");
    paginaCriarQuizz.classList.remove("oculto");
    renderizarTela_3_1()
    renderizarInputsDaTela_3_1()
}
function renderizarTela_3_1() {
    paginaCriarQuizz.innerHTML =`
    <div class="tela-3-1">
        <div class="container-comeco">
            <h1>Comece pelo Começo</h1> 
            <article class="dados-entrada-criar">
            </article>
            <button onclick="validacaoDeDados()">Prosseguir pra criar perguntas</button>
        </div>
    </div>`
}
function inputsDaTela_3_1() {
    const placeholderDosInputs = ["Título do seu quizz", "URL da imagem do seu quizz", "Quantidade de perguntas do quizz", "Quantidade de níveis do quizz"];
    const tituloDosInputs = ["O título deve possuir entre 20 e 65 caracteres.", "A imagem deve possuir uma URL válida!", "O Quizz deve possuir no mínimo 3 perguntas", "O Quizz deve possuir no mínimo 2 Níveis"];
    let atributoDosInputs = [];
    for(let i =0;i < 4; i++) {
        atributoDosInputs[i] = {placeholder: `"${placeholderDosInputs[i]}"`, title: `"${tituloDosInputs[i]}"`};
    }
    return atributoDosInputs;
}
function renderizarInputsDaTela_3_1() {
    const caixaDeInputsTela_3_1 = document.querySelector(".dados-entrada-criar");
    for(let i = 0; i< inputsDaTela_3_1().length; i++) {
        caixaDeInputsTela_3_1.innerHTML+= `
        <input type="text" placeholder=${inputsDaTela_3_1()[i].placeholder}  title=${inputsDaTela_3_1()[i].title} value=${dados_3_1[i]}>
        <div class="validacaoDeDados">${listaDeValidacao_3_1[i]}</div>`
    }
    const inputDaURL = document.querySelector(".dados-entrada-criar input:nth-of-type(2)");
    inputDaURL.setAttribute("class", "utl-Img")
}
//Começa aqui 
let objNovoQuizz = {}
let armazenarDados_3_1;
let dados_3_1 = ["", "", "", ""]
function dadosInseridos_3_1() {
    for(let i = 0; i < inputsDaTela_3_1().length; i++) {
        dados_3_1[i] = (document.querySelector(`.dados-entrada-criar input:nth-of-type(${i+1})`).value);
    }
    armazenarDados_3_1 = {title: `${dados_3_1[0]}`, image: `${dados_3_1[1]}`, numerQuestions: Number(`${dados_3_1[2]}`), numberLevels: Number(`${dados_3_1[3]}`)}
}
let quantidadeDePerguntas;
let quantidaDeDeNiveis;
let listaDeValidacao_3_1=["","","",""];
function validacaoDeDados() {
    dadosInseridos_3_1()
    let variavelDeVerificação = true;
    if(!validarTitulo(armazenarDados_3_1.title)) {
        listaDeValidacao_3_1[0] = "O Título deve ter no mínimo 20 e no máximo 65 caracteres";
        variavelDeVerificação = false;
    }
    if(!validarUrl(armazenarDados_3_1.image)) {
        listaDeValidacao_3_1[1] = "O valor informado não é uma URL válida";
        variavelDeVerificação = false;
    }
    if(!validarQtdPerguntas(armazenarDados_3_1.numerQuestions)) {
        listaDeValidacao_3_1[2] = "O quizz deve ter no mínimo 3 perguntas";
        variavelDeVerificação = false;
    }
    if(!validarQtdNiveis(armazenarDados_3_1.numberLevels)) {
        listaDeValidacao_3_1[3] = "O quizz deve ter no mínimo 2 niveis";
        variavelDeVerificação = false;
    }
    if (variavelDeVerificação) {
        quantidadeDePerguntas = armazenarDados_3_1.numerQuestions;
        quantidaDeDeNiveis = armazenarDados_3_1.numberLevels;
        criarPerguntas()
        objNovoQuizz.title = (armazenarDados_3_1.title)
        objNovoQuizz.image = (armazenarDados_3_1.image)
    } else {
        renderizarTela_3_1();
        renderizarInputsDaTela_3_1();
        listaDeValidacao_3_1=["","","",""]
    };
}
function criarPerguntas() {
    paginaCriarQuizz.innerHTML = `
        <div class="tela-3-2">
            <div class="container-comeco">
                <h1>Crie suas perguntas</h1>
            </div>
        </div>`;
    const paginaPerguntas = document.querySelector('.tela-3-2 .container-comeco');
    for (let i=1; i < quantidadeDePerguntas+1; i++){
        paginaPerguntas.innerHTML += `
            <article class="dados-entrada-criar" id="${i}">
                <div class="pergunta-minimizada">
                    <h2>Pergunta ${i}</h2>
                    <img onclick="alternarPergunta(this.parentNode)" src="img/create.svg" alt="expandir pergunta">
                </div>
            </article>
        `;
    }
    paginaPerguntas.innerHTML += `<button  onclick="validarDadosFormulario_3_2()">Prosseguir pra criar níveis</button>`
    if(elementoPerguntaAnterior===undefined) {
        const iniciarComPrimeiraPerguntaExpandida = document.querySelector(`.container-comeco article:first-of-type`)
        elementoPerguntaAnterior = iniciarComPrimeiraPerguntaExpandida;
        identificadorPerguntaAnterior = "1";
        expandirPergunta( elementoPerguntaAnterior, identificadorPerguntaAnterior)
    }
}
let elementoPerguntaAnterior;
let identificadorPerguntaAnterior;
function alternarPergunta(elementoSelecionado) {
    dadosInseridos_3_2(identificadorPerguntaAnterior);
    if (elementoPerguntaAnterior!==undefined) {
        minimizarPergunta(elementoPerguntaAnterior, identificadorPerguntaAnterior)
    } 
    const elementoPerguntaAtual = elementoSelecionado.parentNode;
    const identificadorDaPergunta = elementoPerguntaAtual.id;
    expandirPergunta(elementoPerguntaAtual, identificadorDaPergunta);
    elementoPerguntaAnterior = elementoPerguntaAtual
    identificadorPerguntaAnterior = identificadorDaPergunta
}
function expandirPergunta(elementoPergunta, identificadorDaPergunta) {
        elementoPergunta.innerHTML = `
        <div class="pergunta-expandida">
            <h2>Pergunta ${identificadorDaPergunta}</h2>
        </div>`
        renderizarInputsDaTela_3_2(identificadorDaPergunta)
}
function minimizarPergunta(elementoPergunta, identificadorDaPergunta) {
            elementoPergunta.innerHTML = `
            <div class="pergunta-minimizada">
                <h2>Pergunta ${identificadorDaPergunta}</h2>
                <img onclick="alternarPergunta(this.parentNode)" src="img/create.svg" alt="expandir pergunta">
            </div>`;
}

let formulario_3_2 = []
formulario_3_2[0] = ["","","","","","","","","","",];
function renderizarInputsDaTela_3_2(id) {
    const caixaDeInputsTela_3_2 = document.querySelector(".pergunta-expandida");
    const placeholderDosInputs = ["Resposta incorreta 1", "URL da imagem 1", "Resposta incorreta 2", "URL da imagem 2", "Resposta incorreta 3", "URL da imagem 3"];
    caixaDeInputsTela_3_2.innerHTML+= `
    <input type="text" placeholder="Texto da pergunta" value=${formulario_3_2[id-1][0]}>
    <input class="corHex" type="text" placeholder="Cor de fundo da pergunta (Hexadecimal)" value=${formulario_3_2[id-1][1]}>
    <h2>Resposta correta</h2>
    <input type="text" placeholder="Resposta correta" value=${formulario_3_2[id-1][2]}>
    <input class="utl-Img" type="text" title="A imagem deve possuir uma URL válida!" placeholder="URL da imagem" value=${formulario_3_2[id-1][3]}>
    <h2>Respostas incorretas</h2>`
    for(let i = 0; i< 5; i+=2) {
        caixaDeInputsTela_3_2.innerHTML+= `
        <input type="text" placeholder="${placeholderDosInputs[i]}" value=${formulario_3_2[id-1][4+i]}>
        <input class="utl-Img" type="text" placeholder="${placeholderDosInputs[i+1]}"  title="A imagem deve possuir uma URL válida!" value=${formulario_3_2[id-1][5+i]}>`
    }
}
let armazenarDados_3_2 = [];
function dadosInseridos_3_2(id) {
    const qntDeInputsNoFormulario_3_2 = 10;
    for(let i = 0; i < qntDeInputsNoFormulario_3_2; i++) {
        formulario_3_2[id-1][i] = (document.querySelector(`.pergunta-expandida input:nth-of-type(${i+1})`).value);
    }
    if(formulario_3_2[id]===undefined && id < quantidadeDePerguntas){
        formulario_3_2[id] = ["","","","","","","","","","",]
    }
    const dadosDoFormulario_3_2 = {textoDaPergunta: `${formulario_3_2[id-1][0]}`, CorDeFundo: `${formulario_3_2[id-1][1]}`, RespostaCerta: `${formulario_3_2[id-1][2]}`, URLdaImagemCerta: `${formulario_3_2[id-1][3]}`, RespostaErrada1: `${formulario_3_2[id-1][4]}`, URLdaImagemErrada1: `${formulario_3_2[id-1][5]}`, RespostaErrada2: `${formulario_3_2[id-1][6]}`, URLdaImagemErrada2: `${formulario_3_2[id-1][7]}`, RespostaErrada3: `${formulario_3_2[id-1][8]}`, URLdaImagemErrada3: `${formulario_3_2[id-1][9]}`}
    armazenarDados_3_2[id - 1] = dadosDoFormulario_3_2;
}
function validarDadosFormulario_3_2() {
    dadosInseridos_3_2(identificadorPerguntaAnterior)
    for (let i=0; i < armazenarDados_3_1.numerQuestions; i++){
        let criterio = validarTextoPergunta(armazenarDados_3_2[i].textoDaPergunta)
        if (criterio === false){
            armazenarDados_3_2 = []
            return alert('Preencha a pagina toda, novamente!')
            ;
        }
    }
    for (let i=0; i < armazenarDados_3_1.numerQuestions; i++){
        let criterio = validarCorHex(armazenarDados_3_2[i].CorDeFundo)
        if (criterio === false){
            armazenarDados_3_2 = []
            return alert('Preencha a pagina toda, novamente!')
            ;
        }
    }
    for (let i=0; i < armazenarDados_3_1.numerQuestions; i++){
        let criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaCerta)
        let criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemCerta)
        if (criterioTexto === false || criterioUrl === false){
            armazenarDados_3_2 = []
            return alert('Preencha a pagina toda, novamente!')
            ;
        }
    }
    for (let i=0; i < armazenarDados_3_1.numerQuestions; i++){
        let criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada1)
        let criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada1)
        if (criterioTexto === false || criterioUrl === false){
            armazenarDados_3_2 = []
            return alert('Preencha a pagina toda, novamente!')
            ;
        } else if (armazenarDados_3_2[i].RespostaErrada2 !== ""){
            criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada2)
            criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada2)
            if (criterioTexto === false || criterioUrl === false){
                armazenarDados_3_2 = []
                return alert('Preencha a pagina toda, novamente!')
                ;
            }
        } else if (armazenarDados_3_2[i].RespostaErrada3 !== ""){
            criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada2)
            criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada2)
            if (criterioTexto === false || criterioUrl === false){
                armazenarDados_3_2 = []
                return alert('Preencha a pagina toda, novamente!')
                ;
            }
        }
    }
    montarObjetoParaEnvioServidor()
    CriarNiveis()
}
let questions =[];
function montarObjetoParaEnvioServidor() {
    armazenarDados_3_2.forEach((item)=>{
        const title = item.textoDaPergunta;
        const color = item.CorDeFundo;
        const answers = [];
        answers.push({
            text: item.RespostaCerta,
            image: item.URLdaImagemCerta,
            isCorrectAnswer: true
        });
        answers.push({
            text: item.RespostaErrada1,
            image: item.URLdaImagemErrada1,
            isCorrectAnswer: false
        });
        answers.push({
            text: item.RespostaErrada2,
            image: item.URLdaImagemErrada2,
            isCorrectAnswer: false
        });
        answers.push({
            text: item.RespostaErrada3,
            image: item.URLdaImagemErrada3,
            isCorrectAnswer: false
        });
        const pergunta = {title, color, answers};
        questions.push(pergunta);
    });
    objNovoQuizz.questions = questions;
}
let elementoNivelAnterior;
let identificadorNivelAnterior;
function CriarNiveis() {
    paginaCriarQuizz.innerHTML = `
        <div class="tela-3-3">
            <div class="container-comeco">
                <h1>Agora, decida os níveis</h1> 
            </div>
        </div>`
    const paginaNiveis = document.querySelector('.container-comeco');
    for (let i=1; i < quantidaDeDeNiveis+1; i++){
        paginaNiveis.innerHTML += `
        <article class="dados-entrada-criar" id="${i}">
            <div class="pergunta-minimizada">
                <h2>Nível ${i}</h2>
                <img onclick="alternarNivel(this.parentNode)" src="img/create.svg" alt="expandir nivel">
            </div>
        </article>`;
    }
    paginaNiveis.innerHTML += `<button  onclick="validarDadosFormulario_3_3()">Finalizar Quizz</button>`
    if(elementoNivelAnterior===undefined) {
        const iniciarComPrimeiroNivelExpandido = document.querySelector(`.container-comeco article:first-of-type`)
        elementoNivelAnterior = iniciarComPrimeiroNivelExpandido;
        identificadorNivelAnterior = "1";
        expandirNivel(iniciarComPrimeiroNivelExpandido, identificadorNivelAnterior)
    }
}
let identificadorDoNivel;
function alternarNivel(elementoSelecionado) {
    const elementoNivelAtual = elementoSelecionado.parentNode;
    identificadorDoNivel = elementoNivelAtual.id;
    dadosInseridos_3_3(identificadorNivelAnterior)
    if (elementoNivelAnterior!==undefined) {
        minimizarNivel(elementoNivelAnterior, identificadorNivelAnterior)
    }
    expandirNivel(elementoNivelAtual, identificadorDoNivel);
    elementoNivelAnterior = elementoNivelAtual
    identificadorNivelAnterior = identificadorDoNivel
}
function expandirNivel(elementoNivel, identificadorDoNivel) {
    elementoNivel.innerHTML = `
    <div class="pergunta-expandida">
        <h2>Nível ${identificadorDoNivel}</h2>
    </div>`
    renderizarInputsDaTela_3_3(identificadorDoNivel)
}
function minimizarNivel(elementoNivel, identificadorDoNivel) {
        elementoNivel.innerHTML = `
        <div class="pergunta-minimizada">
            <h2>Nível ${identificadorDoNivel}</h2>
            <img onclick="alternarNivel(this.parentNode)" src="img/create.svg" alt="expandir nivel">
        </div>`;
}
let formulario_3_3 = []
formulario_3_3[0] = ["","","",""];
function renderizarInputsDaTela_3_3(id) {
    const placeholderDosInputs = ["Título do nível", "% de acerto mínima", "URL da imagem do nível", "Descrição do nível"];
    const caixaDeInputsTela_3_3 = document.querySelector(".pergunta-expandida");
    for(let i = 0; i< 4; i++) {
        caixaDeInputsTela_3_3.innerHTML+= `
        <input type="text" placeholder="${placeholderDosInputs[i]}" value=${formulario_3_3[id-1][i]}>`
    }
    const inputDaURL = document.querySelector(".pergunta-expandida input:nth-of-type(3)");
    inputDaURL.setAttribute("class", "utl-Img")
}
let armazenarDados_3_3 = [];
function dadosInseridos_3_3(id) {
    const qntDeInputsNoFormulario_3_3 = 4;
    for(let i = 0; i < qntDeInputsNoFormulario_3_3; i++) {
        formulario_3_3[id-1][i] = (document.querySelector(`.pergunta-expandida input:nth-of-type(${i+1})`).value);
    }
    if(formulario_3_3[id]===undefined && id < quantidaDeDeNiveis){
        formulario_3_3[id] = ["","","",""]
    }
    const dadosDoFormulario_3_3 = {tituloDoNivel: `${formulario_3_3[id-1][0]}`, PorcentagemMinAcerto: `${formulario_3_3[id-1][1]}`, URLdaImagem: `${formulario_3_3[id-1][2]}`, descricaoDoNivel: `${formulario_3_3[id-1][3]}`}
    armazenarDados_3_3[id - 1] = dadosDoFormulario_3_3;
}
function validarDadosFormulario_3_3() {
    dadosInseridos_3_3(identificadorDoNivel);
    let ListaPorcentagemMinAcerto = [];
    for (let i=0; i < armazenarDados_3_1.numberLevels; i++){
        if(!(validarTituloNivel(armazenarDados_3_3[i].tituloDoNivel))) {
            return alert('Preencha a pagina corretamente!')
        }
        if(!(porcentagemDeAcertoNivel(armazenarDados_3_3[i].PorcentagemMinAcerto))) {
            return alert('Preencha a pagina corretamente!')
        }
        if(!(validarUrl(armazenarDados_3_3[i].URLdaImagem))) {
            return alert('Preencha a pagina corretamente!')
        }
        if(!(validarTextoNivel(armazenarDados_3_3[i].descricaoDoNivel))) {
            return alert('Preencha a pagina corretamente!')
        }
        ListaPorcentagemMinAcerto.push(parseInt(armazenarDados_3_3[i].PorcentagemMinAcerto));
    }
    let found = ListaPorcentagemMinAcerto.find(elemento => elemento === 0);
    if (found === undefined){
        return alert('Preencha a pagina toda, novamente!');
    }
    finalizarQuizz()
}
function finalizarQuizz() {
    
    /**ListaPorcentagemMinAcerto =[];
    for (let i=0; i < armazenarDados_3_1.numberLevels; i++){
        let criterio = validarTituloNivel(armazenarDados_3_3[i].tituloDoNivel)
        if (criterio === false){
            armazenarDados_3_3 = [];
            return alert('Preencha a pagina toda, novamente!')
        }
    }
    for (let i=0; i < armazenarDados_3_1.numberLevels; i++){
        let criterio = validarUrl(armazenarDados_3_3[i].URLdaImagem)
        if (criterio === false){
            armazenarDados_3_3 = [];
            return alert('Preencha a pagina toda, novamente!')
        }
    }
    for (let i=0; i < armazenarDados_3_1.numberLevels; i++){
        let criterio = validarTextoNivel(armazenarDados_3_3[i].descricaoDoNivel)
        if (criterio === false){
            armazenarDados_3_3 = [];
            return alert('Preencha a pagina toda, novamente!')
        }
    }
    for (let i=0; i < armazenarDados_3_1.numberLevels; i++){
        let criterio = validarAcertoNivel(armazenarDados_3_3[i].PorcentagemMinAcerto)
        if (criterio === false){
            armazenarDados_3_3 = [];
            return alert('Preencha a pagina toda, novamente!')
        } else {
            ListaPorcentagemMinAcerto.push(parseInt(armazenarDados_3_3[i].PorcentagemMinAcerto));
        }
    }
    let found = ListaPorcentagemMinAcerto.find(elemento => elemento === 0);
    if (found === undefined){
        armazenarDados_3_3 = [];
        return alert('Preencha a pagina toda, novamente!')
    }**/
    niveis =[];
    armazenarDados_3_3.forEach((item)=>{
        const titulo = item.tituloDoNivel;
        const imagem = item.URLdaImagem;
        const texto = item.descricaoDoNivel;
        const valorMinimo = item.PorcentagemMinAcerto;
        niveis.push({
            title: titulo,
            image: imagem,
            text: texto,
            minValue: valorMinimo
        });
    });
    objNovoQuizz.levels = niveis;
    
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", objNovoQuizz);
    request.catch(QuizzErro)
    request.then(QuizzEnviado)
    //onclick id
    paginaCriarQuizz.innerHTML = `
        <div class="tela-3-4">
            <div class="container-comeco fim">
                <h1>Seu quizz está pronto!</h1>
                    <div class="quizz fim" onclick="escolherQuizz(this)" id=''> 
                        <img src=${armazenarDados_3_1.image}>
                        <div class="nomeDoQuiz fim">
                            ${armazenarDados_3_1.title}
                        </div>
                    </div>
                <button class="reinicia-quizz fim">Acessar Quizz</button>
                <button onclick="irParaPaginaInicial()" class="retorna-inicio fim">Voltar pra home</button>
            </div>
        </div>
    `;
}
let listaDeQuizzesDoUsuario =[];
let idQuizzEnviado;
function QuizzEnviado(resposta) {
    idQuizzEnviado = (resposta.data.id);
    listaDeQuizzesDoUsuario.push(resposta.data);
    const listaSeriada = JSON.stringify(listaDeQuizzesDoUsuario);
    localStorage.setItem("SeusQuizzes", listaSeriada);
    const promessa = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/${idQuizzEnviado}`)
    promessa.then(renderizarQuizzNaTela3_4);
}
function renderizarQuizzNaTela3_4() {
    document.querySelector('.container-comeco.fim').innerHTML = `
        <h1>Seu quizz está pronto!</h1>
        <div class="quizz fim" onclick="escolherQuizz(this)" id='${idQuizzEnviado}'> 
            <img src=${armazenarDados_3_1.image}>
            <div class="nomeDoQuiz fim">
                ${armazenarDados_3_1.title}
            </div>
        </div>
        <button class="reinicia-quizz fim" onclick="escolherQuizz(this)" id='${idQuizzEnviado}'>Acessar Quizz</button>
        <button onclick="irParaPaginaInicial()" class="retorna-inicio fim">Voltar pra home</button>
    `;
}
function QuizzErro (erro) {
    const error = erro.response.data;
    const statusErro = erro.response.status;
    alert(`Erro: ${statusErro}`)
}
function validarTextoRespostas(texto) {
    if (texto.length > 0){
        return true;
    } else{
        return false;
    }
}
function validarAcertoNivel(valor) {
    const acertoMin = parseInt(valor)
    if (acertoMin >= 0 || acertoMin <= 100){
        return true;
    } else{
        return false;
    }
}
function validarTituloNivel(texto) {
    if (texto.length >= 10){
        return true;
    } else{
        return false;
    }
}
function validarTextoNivel(texto) {
    if (texto.length >= 30){
        return true;
    } else{
        return false;
    }
}
function porcentagemDeAcertoNivel(numero) {
    if (numero <= 100 || numero >= 0){
        return true;
    } else{
        return false;
    }
}
function validarTextoPergunta(texto) {
    if (texto.length >= 20){
        return true;
    } else{
        return false;
    }
}
function validarQtdNiveis(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 2) {
        return true;
    } else{
        return false;
    }
}
function validarQtdPerguntas(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 3) {
        return true;
    } else{
        return false;
    }
}
function validarTitulo(titulo) {
    if (titulo.length > 20 && titulo.length < 65){
        return true;
    } else{
        return false;
    }
}
function validarUrl(url) {
    try {
        new URL(url);
    } catch (e) {
        console.error(e);
        return false;
    } return true;
}
function validarCorHex(corHexadecimal) {
    return corHexadecimal.match(/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i) !== null;
}