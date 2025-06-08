// adicionar novas cobranças
// pesquisar por nomes ou datas
// limitar tamanho da tabela e adicionar páginas
// navegar entre páginas

// OPCIONAL
// upload de arquivo na coluna de Comprovante
// gerar um qrcode de pagamento

if (localStorage.getItem("registros") == null) {
    localStorage.setItem("registros", "")
}
function AtualizarTabela() {
    const tabela = document.getElementById("tabela");

    // Verificação inicial
    const dados = localStorage.getItem("registros");
    if (!dados || dados === "[]") {
        tabela.innerHTML = `<tr id="tabelaVazia"><td colspan='5'>Nenhum registro foi adicionado</td></tr>`;
        return;
    }

    const registrosLocal = JSON.parse(dados);
    const linhasTabela = Array.from(tabela.getElementsByTagName("tr"));

    registrosLocal.forEach((registro) => {
        const jaExiste = linhasTabela.some((linha) => {
            const colunas = Array.from(linha.children);
            return Object.entries(registro).every(([chave, valor], index) => {
                if (chave === "Comprovante") return true; // Ignora "Comprovante"
                return colunas[index]?.innerText === String(valor);
            });
        });

        if (!jaExiste) {

            AumentarTabela(registro);
        }
    });
}
function Registrar(Paciente, Atendimento, Horario, Valor, Vencimento, Comprovante, Situacao) {
    const registro = {
        Paciente,
        Atendimento,
        Horario,
        Valor,
        Vencimento,
        Comprovante,
        Situacao
    }
    // Verificando se tem algum registro exatamente igual já adicionado
    if (localStorage.getItem('registros') === "") {
        localStorage.setItem('registros', JSON.stringify([registro]))
    } else {
        const novaArray = JSON.parse(localStorage.getItem("registros"))
        for (R of novaArray) {
            if (JSON.stringify(registro) == JSON.stringify(R)) {
                console.log(`Este registro já está incluso.`)
                AtualizarTabela()
                return
            }
        }
        novaArray.push(registro)
        localStorage.setItem('registros', JSON.stringify(novaArray))
    }
    AtualizarTabela()

}

function AumentarTabela(registro) {
    const tabela = document.getElementById("tabela")
    const linha = document.createElement("tr")
    if (document.getElementById("tabelaVazia") !== null){
        document.getElementById("tabelaVazia").remove();
    }

    for (dado in registro) {
        const coluna = document.createElement("td")
        const span = document.createElement("span")
        let classe = ""
        if (dado == "Situacao") {
            span.innerHTML = registro[dado]
            if (registro[dado] == "PAGO") {
                classe = "status-pago"
            } else if (registro[dado] == "CANCELADO") {
                classe = "status-cancelado"
            } else {
                classe = "status-pendente"
            }
            span.className = `badge ${classe} p-2`
            coluna.appendChild(span)
            linha.appendChild(coluna)
        } else if (dado == "Comprovante") {
            coluna.innerHTML = `
            <button class="btn btn-light btn-upload"><i class="bi bi-upload"></i></button>
            `
            linha.appendChild(coluna)
        } else {
            coluna.innerHTML = registro[dado]
            linha.appendChild(coluna)
        }
        tabela.appendChild(linha)
    }
}



document.getElementById("registroForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const paciente = document.getElementById("paciente").value;
    const atendimento = document.getElementById("atendimento").value;
    const horario = document.getElementById("horario").value;
    const valor = document.getElementById("valor").value;
    const vencimento = document.getElementById("vencimento").value;
    const situacao = document.getElementById("situacao").value;

    Registrar(paciente, atendimento, horario, valor, vencimento, "bi bi-upload", situacao);

    document.getElementById("paciente").value = ""
    document.getElementById("atendimento").value = ""
    document.getElementById("horario").value = ""
    document.getElementById("valor") = ""
    document.getElementById("vencimento").value = ""
    document.getElementById("situacao").value = ""

    document.getElementById("fechaOffcanvas").click()
})

Registrar("Gabriel Machado", "24/05/2025", "16:00", "R$200", "08/06/2025", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "24/05/2025", "9:30", "R$200", "08/06/2025", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "17/05/2025", "20:00", "R$200", "08/06/2025", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "08/06/2025", "bi bi-upload", "CANCELADO");
Registrar("Gabriel Machado", "24/05/2025", "16:00", "R$200", "08/06/2025", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "24/05/2025", "9:30", "R$200", "08/06/2025", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "17/05/2025", "20:00", "R$200", "08/06/2025", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "08/06/2025", "bi bi-upload", "CANCELADO");
Registrar("Gabriel Machado", "24/05/2025", "16:00", "R$200", "08/06/2025", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "24/05/2025", "9:30", "R$200", "08/06/2025", "bi bi-upload", "PAGO");

AtualizarTabela()