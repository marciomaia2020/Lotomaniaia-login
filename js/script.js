let savedGames = [];

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Conta criada com sucesso!');
            document.getElementById('signup-form').reset();
            showLoginForm();
        } else {
            alert('Erro ao criar conta: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login bem-sucedido!');
            document.getElementById('login-form').reset();
            // Implementar lógica adicional após login bem-sucedido
        } else {
            alert('Erro ao fazer login: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function showSignupForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function addFixedNumberInput() {
    const fixedNumbersDiv = document.getElementById('fixed-numbers');
    const currentInputs = fixedNumbersDiv.getElementsByTagName('input').length;

    if (currentInputs < 20) {
        const newInput = document.createElement('input');
        newInput.type = 'number';
        newInput.id = `fixed-number-${currentInputs + 1}`;
        newInput.min = 0;
        newInput.max = 99;

        const newLabel = document.createElement('label');
        newLabel.for = newInput.id;
        newLabel.innerText = `Número Fixo ${currentInputs + 1}:`;

        fixedNumbersDiv.appendChild(newLabel);
        fixedNumbersDiv.appendChild(newInput);
    } else {
        alert("Você pode adicionar no máximo 20 números fixos.");
    }
}

function generateNumbers() {
    const fixedNumbers = [];
    for (let i = 1; i <= 20; i++) {
        const fixedNumberInput = document.getElementById(`fixed-number-${i}`);
        if (fixedNumberInput && fixedNumberInput.value !== '') {
            fixedNumbers.push(parseInt(fixedNumberInput.value));
        }
    }

    if (fixedNumbers.length < 20) {
        alert("Por favor, insira 20 números fixos.");
        return;
    }

    const allNumbers = Array.from({ length: 100 }, (_, i) => i);
    const availableNumbers = allNumbers.filter(num => !fixedNumbers.includes(num));
    const randomNumbers = [];

    while (randomNumbers.length < 30) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const number = availableNumbers.splice(randomIndex, 1)[0];
        randomNumbers.push(number);
    }

    const generatedNumbers = [...fixedNumbers, ...randomNumbers].sort((a, b) => a - b);
    document.getElementById('generated-numbers').innerText = `Números Gerados: ${generatedNumbers.join(', ')}`;
}

function saveGame() {
    const generatedText = document.getElementById('generated-numbers').innerText;
    if (!generatedText) {
        alert("Nenhum jogo gerado para salvar.");
        return;
    }

    const generatedNumbers = generatedText.replace('Números Gerados: ', '');
    savedGames.push(generatedNumbers);

    const savedGamesDiv = document.getElementById('saved-games');
    savedGamesDiv.innerHTML = savedGames.map(game => `<div>${game}</div>`).join('');
}

function exportToExcel() {
    if (savedGames.length === 0) {
        alert("Nenhum jogo salvo para exportar.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(savedGames.map(game => game.split(', ')));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jogos Salvos");
    XLSX.writeFile(workbook, "jogos_lotomania.xlsx");
}
