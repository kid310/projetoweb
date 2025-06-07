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
    if (localStorage.getItem("registros") === "") {
        document.getElementById("tabela").innerHTML = "Nenhum registro foi adicionado"
        return
    }
    const registrosLocal = JSON.parse(localStorage.getItem("registros"))
    const registrosTabela = Array.prototype.slice.call(document.getElementById("tabela").children)
    let repetido = false
    let chaves = Object.keys(registrosLocal[0])
    for (L = 0; L < registrosTabela.length; L++) {
        for (C = 0; C < registrosLocal.length; C++) {
            if (chaves[C] === "Comprovante" || registrosLocal[L][chaves[C]] !== registrosTabela[L].childNodes[C].innerHTML) continue
            // console.log(`Lt : ${registrosTabela[L].childNodes[C].innerHTML}`)
            // console.log(`Lc : ${registrosLocal[L][chaves[C]]}`)
            // console.log(`Lc : ${registrosLocal[L]}`)
        }
        // console.log(registrosLocal[L])
        if (C === 5) break
    }
    if (L === registrosTabela.length) {
        AumentarTabela(registrosLocal[L])
        if (registrosTabela.length < registrosLocal.length) AtualizarTabela()
    }
    // console.log(registrosTabela[0].childNodes[0].innerHTML) //o primeiro é a linha e o segundo é a coluna
    // console.log(registrosLocal[0]['Paciente'])
    // console.log(Object.entries(registrosLocal[0])) //o primeiro é a linha e o segundo é a coluna
    // console.log(registrosTabela[0].children[0].innerHTML)
    // console.log(teste[0])
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
})

Registrar("Gabriel Machado", "24/05/2025", "16:00", "R$200", "17/08/2024", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "24/05/2025", "9:30", "R$200", "18/08/2024", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "17/05/2025", "20:00", "R$200", "29/08/2024", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "18/08/2024", "bi bi-upload", "CANCELADO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "18/08/2024", "bi bi-upload", "CANCELADO");
AtualizarTabela()