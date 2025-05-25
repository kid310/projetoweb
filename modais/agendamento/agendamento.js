if (!window.eventos) {
    window.eventos = [];
}

    window.prontuarios = [{
    id: 1,
    paciente: "Henrique Silva",
    historico: "Consulta de rotina"
}, {
    id: 2,
    paciente: "Maria Oliveira",
    historico: "Acompanhamento pós-operatório"
}];


function iniciarCalendario() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt-br',
            height: 'parent', // Usa 100% da altura do container pai
            contentHeight: 'auto',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: window.eventos,
            dateClick: function(info) {
                abrirModalAgendamento(info.dateStr);
            },
            eventClick: function(info) {
                mostrarResumoEvento(info.event);
            },
            eventDidMount: function(info) {
                info.el.style.cursor = 'pointer';
            }
        });
        calendar.render();
    }
}


function abrirModalAgendamento(data) {
      const options = window.prontuarios.map(p => 
        `<option value="${p.id}">${p.paciente}</option>`
    ).join('');
    Swal.fire({
        title: 'Novo Agendamento',
        html: `
             <select id="prontuario" class="swal2-select" placeholder="Paciente">
                ${options}
            </select>
            <input type="time" id="hora-inicio" class="swal2-input" placeholder="Hora Início">
            <input type="time" id="hora-fim" class="swal2-input" placeholder="Hora Fim">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                prontuario: document.getElementById('prontuario').value,
                start: data + 'T' + document.getElementById('hora-inicio').value,
                end: data + 'T' + document.getElementById('hora-fim').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const novoEvento = result.value;
            eventos.push(novoEvento);
            iniciarCalendario(); // Recarrega o calendário
        }
    });
}

function mostrarResumoEvento(evento) {
    const prontuario = evento.extendedProps.prontuario;
    const infoProntuario = prontuario ? 
        `<p><strong>Prontuário:</strong> ${prontuario.paciente}<br>
        ${prontuario.historico}</p>` : '';
    const start = new Date(evento.start).toLocaleString();
    const end = evento.end ? new Date(evento.end).toLocaleString() : 'Sem término';

    Swal.fire({
        title: evento.title,
        html: `
            <div style="text-align: left">
                ${infoProntuario}
                <p><strong>Início:</strong> ${start}</p>
                <p><strong>Término:</strong> ${end}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Fechar',
        cancelButtonText: 'Excluir',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            eventos = eventos.filter(e => e !== evento.extendedProps);
            iniciarCalendario();
        }
    });
}

// Executa diretamente (sem DOMContentLoaded ou setTimeout)
iniciarCalendario();