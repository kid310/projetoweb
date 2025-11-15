function abrirModal(modalName) {
    const modalTitles = {
        'admin': 'Turmas',
        'alunos': 'Alunos',
        'matricula': 'Matrícula'
    };
    
    fetch(`modais/${modalName}/${modalName}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('modalTitle').innerText = modalTitles[modalName] || modalName.charAt(0).toUpperCase() + modalName.slice(1);
            document.getElementById('modalBody').innerHTML = html;
            const modal = new bootstrap.Modal(document.getElementById('modalContainer'));
            
            const sidebar = document.getElementById('sidebar');
            const icon = document.getElementById('toggleIcon');
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                icon.classList.remove('bi-chevron-left');
                icon.classList.add('bi-chevron-right');
            }
            
            modal._element.addEventListener('shown.bs.modal', () => {
                const oldScript = document.getElementById('modalScript');
                if (oldScript) oldScript.remove();
                
                const script = document.createElement('script');
                script.src = `modais/${modalName}/${modalName}.js?t=${Date.now()}`;
                script.id = 'modalScript';
                document.body.appendChild(script);
            });

            modal.show();
        });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('toggleIcon');
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('bi-chevron-left');
        icon.classList.add('bi-chevron-right');
    } else {
        icon.classList.remove('bi-chevron-right');
        icon.classList.add('bi-chevron-left');
    }
}
