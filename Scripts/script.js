let listaDeQuizzes = [];
obterQuizzes()
function obterQuizzes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
    promessa.then(renderizarQuizzes)
}
function renderizarQuizzes(resposta) {
    listaDeQuizzes = resposta.data
    console.log(listaDeQuizzes)
    const elemento = document.querySelector(".todosQuizzes")
    elemento.innerHTML = "";
    for(let i = 0; i < listaDeQuizzes.length; i++) {
        elemento.innerHTML = `
        <div class="quizz">
        <img src=${listaDeQuizzes[i].image}>
            <div class="nomeDoQuiz">${listaDeQuizzes[i].title}</div>
        </div>
        `;
    }
}