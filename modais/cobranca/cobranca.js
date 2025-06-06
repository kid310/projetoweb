const registros = []

function Registrar(Paciente, Atendimento, Horario, Valor, Vencimento, Comprovante, Situacao) {
    const tabela = document.getElementById("tabela")
    const linha = document.createElement("tr")
    const registro = {
        Paciente,
        Atendimento,
        Horario,
        Valor,
        Vencimento,
        Comprovante,
        Situacao
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
            console.log(coluna)
        } else if (dado == "Comprovante") {
            coluna.innerHTML = `
            <button class="btn btn-light btn-upload"><i class="bi bi-upload"></i></button>
            `
            linha.appendChild(coluna)
        } else {
            coluna.innerHTML = registro[dado]
            linha.appendChild(coluna)
        }

        // console.log(dado)
    }
    tabela.appendChild(linha)
    registros.push(registro)
}

// const coisa = new Registro("helenaldo","e","s","d","s","ds","sd")
Registrar("Gabriel Machado", "24/05/2025", "16:00", "R$200", "17/08/2024", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "24/05/2025", "9:30", "R$200", "18/08/2024", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "17/05/2025", "20:00", "R$200", "29/08/2024", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "18/08/2024", "bi bi-upload", "CANCELADO");
Registrar("Igor Sodré", "17/05/2025", "18:30", "R$200", "18/08/2024", "bi bi-upload", "CANCELADO");

