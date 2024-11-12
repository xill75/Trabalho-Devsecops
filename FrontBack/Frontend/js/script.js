document.addEventListener('DOMContentLoaded', () => {
    // Verificar token e carregar a lista de malwares ao carregar a página
    verificartoken();
    loadMalwares();
    initDarkModeToggle();
    initCsvExport();
});

async function verificartoken() {
    const token = localStorage.getItem('sessao');

    if (!token) {
        // Redireciona para a página de login se não houver token
        window.location.href = 'pages/login.html';
        return;
    }

    const response = await fetch(`http://192.168.98.128:30300/api/users/verificartoken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok) {
        // Redireciona para a página de login se o token for inválido
        window.location.href = 'pages/login.html';
    } else {
        console.log(data.message); // Exemplo de uso da resposta
    }
}

const searchMalware = document.getElementById('searchMalware');
searchMalware.addEventListener('input', loadMalwares);

function initDarkModeToggle() {
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleDarkModeButton.textContent = 
            document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
    });
}

function initCsvExport() {
    const exportCsvButton = document.getElementById('dowloadcsv');
    exportCsvButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://192.168.98.128:30300/api/malware/dowload`);
            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'malwares.csv';
                link.click();
            } else {
                alert('Erro ao gerar o CSV.');
            }
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            alert('Erro ao exportar o arquivo CSV.');
        }
    });
}

const malwareForm = document.getElementById('malwareForm');
const malwareList = document.getElementById('malwareList');
const malwareCount = document.getElementById('malwareCount');

malwareForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    await fetch(`http://192.168.98.128:30300/api/malware`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });

    malwareForm.reset();
    loadMalwares();
});

async function loadMalwares() {
    const response = await fetch(`http://192.168.98.128:30300/api/malware`);
    let malwares = await response.json();
    malwareList.innerHTML = ''; // Limpar a lista de malwares antes de preencher

    const pesquisa = searchMalware.value.toLowerCase();
    malwares = malwares.filter(malware => 
        malware.m_name.toLowerCase().includes(pesquisa)
    );

    const sortBy = document.getElementById('sortMalwares').value;
    if (sortBy === 'name') {
        malwares.sort((a, b) => a.m_name.localeCompare(b.m_name));
    } else if (sortBy === 'date') {
        malwares.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    malwareCount.textContent = malwares.length;

    malwares.forEach(malware => {
        const item = document.createElement('li');
        item.className = 'malware-item';

        // Criando elementos de forma segura, sem usar innerHTML
        const div1 = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = malware.m_name; // Usando textContent para evitar XSS
        div1.appendChild(strong);
        
        const br = document.createElement('br');
        div1.appendChild(br);

        const description = document.createElement('div');
        description.textContent = malware.m_description; // Usando textContent para evitar XSS
        
        div1.appendChild(description);
        item.appendChild(div1);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'malware-item-buttons';
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Editar';
        editButton.setAttribute('data-id', malware.id); // Atribuindo ID para o botão
        editButton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            promptUpdateMalware(id, malware.m_name, malware.m_description);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Excluir';
        deleteButton.setAttribute('data-id', malware.id); // Atribuindo ID para o botão
        deleteButton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            confirmDeleteMalware(id);
        });
        
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        
        item.appendChild(buttonsDiv);
        malwareList.appendChild(item);
    });
}

async function confirmDeleteMalware(id) {
    const userConfirmed = confirm("Você tem certeza que quer excluir este malware?");
    if (userConfirmed) {
        await deleteMalware(id);
    }
}

async function deleteMalware(id) {
    await fetch(`http://192.168.98.128:30300/api/malware/${id}`, { method: 'DELETE' });
    loadMalwares(); // Recarregar a lista de malwares após exclusão
}

function promptUpdateMalware(id, currentName, currentDescription) {
    const name = prompt("Atualize o nome do malware:", currentName);
    const description = prompt("Atualize a descrição do malware:", currentDescription);

    if (name && description) {
        updateMalware(id, name, description);
    } else {
        alert("Preencha todos os campos");
    }
}

async function updateMalware(id, name, description) {
    await fetch(`http://192.168.98.128:30300/api/malware/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });
    loadMalwares(); // Recarregar a lista de malwares após atualização
}

function login() {
    window.location.href = 'pages/login.html';
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'pages/login.html';
}

function paginacontato() {
    window.location.href = 'pages/contato.html';
}
