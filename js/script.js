
let savedGames = [];

function validateDuplicateNumbers() {
    const fixedNumbers = [];
    const fixedNumbersDiv = document.getElementById('fixed-numbers');
    const inputs = fixedNumbersDiv.getElementsByTagName('input');

    for (let input of inputs) {
        if (input.value !== '') {
            const value = parseInt(input.value);
            if (fixedNumbers.includes(value)) {
                alert(`Número duplicado detectado: ${value}. Por favor, insira um número diferente.`);
                input.value = '';
                return false;
            }
            fixedNumbers.push(value);
        }
    }
    return true;
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
        newInput.onchange = validateDuplicateNumbers;

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
    if (!validateDuplicateNumbers()) {
        return;
    }

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

    // Generate 30 additional random numbers
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