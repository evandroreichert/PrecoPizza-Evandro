const btnAdicionar = document.querySelector('#adicionar');
const btnConsultar = document.querySelector('#consultar');

const table = document.querySelector('#table');
const formaSelect = document.querySelector('#iForma');

let pizzas = [];

btnAdicionar.addEventListener('click', () => {
    const nome = document.querySelector('#iNomePizza').value;
    const dimensao1 = parseFloat(document.querySelector('#iDimensao1').value);
    const dimensao2 = parseFloat(document.querySelector('#iDimensao2').value);
    const preco = parseFloat(document.querySelector('#iPreco').value);

    let tamanho, area;

    switch (formaSelect.value) {
        case 'redonda':
            const raio = dimensao1 / 2;
            tamanho = dimensao1; 
            area = Math.PI * (raio * raio);
            break;
        case 'quadrada':
            tamanho = dimensao1; 
            area = dimensao1 * dimensao1;
            break;
        case 'retangular':
            tamanho = dimensao1 * dimensao2; 
            area = dimensao1 * dimensao2;
            break;
        default:
            console.error('Forma de pizza não reconhecida');
            return;
    }

    const pizza = {
        nome: nome,
        tamanho: tamanho,
        preco: preco,
        precoPorCm: area / preco
    };

    pizzas.push(pizza);

    updateTable();
});

function updateTable() {
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    let melhorCustoBeneficio = pizzas[0]; // Assumindo a primeira pizza como a melhor inicialmente

    pizzas.forEach(pizza => {
        let newLine = document.createElement('tr');

        let cellNome = document.createElement('td');
        cellNome.textContent = pizza.nome;
        newLine.appendChild(cellNome);

        let cellTamanho = document.createElement('td');
        cellTamanho.textContent = pizza.tamanho;
        newLine.appendChild(cellTamanho);

        let cellPreco = document.createElement('td');
        cellPreco.textContent = pizza.preco;
        newLine.appendChild(cellPreco);

        let cellPrecoPorCm = document.createElement('td');
        cellPrecoPorCm.textContent = pizza.precoPorCm.toFixed(2);
        newLine.appendChild(cellPrecoPorCm);

        // Cálculo da diferença percentual
        const diferencaPercentual = ((melhorCustoBeneficio.precoPorCm - pizza.precoPorCm) / melhorCustoBeneficio.precoPorCm) * 100;

        let cellDiferencaPercentual = document.createElement('td');
        cellDiferencaPercentual.textContent = diferencaPercentual.toFixed(2);
        newLine.appendChild(cellDiferencaPercentual);

        tbody.appendChild(newLine);

        // Atualizar a melhor pizza se a pizza atual tiver um custo-benefício melhor
        if (pizza.precoPorCm > melhorCustoBeneficio.precoPorCm) {
            melhorCustoBeneficio = pizza;
        }
    });

    // Adicionar a marcação de "MELHOR CB" na linha correspondente
    const rows = tbody.querySelectorAll('tr');
    rows[pizzas.indexOf(melhorCustoBeneficio)].classList.add('melhor-cb');
}