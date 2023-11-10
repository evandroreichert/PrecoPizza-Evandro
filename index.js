const table = document.querySelector('#table')
const formaSelect = document.querySelector('#iForma')
const tbody = table.querySelector('tbody')

let pizzas = []

document.querySelector('form').addEventListener('submit', function (event) {
    adicionarPizza(event)
})

function adicionarPizza(event) {
    const nome = document.querySelector('#iNomePizza').value
    const dimensao1 = parseFloat(document.querySelector('#iDimensao1').value)
    const dimensao2 = parseFloat(document.querySelector('#iDimensao2').value)
    const preco = parseFloat(document.querySelector('#iPreco').value)

    event.preventDefault()

    if (!nome || isNaN(dimensao1) || isNaN(preco)) {
        alert('Por favor, preencha todos os campos obrigatórios e forneça valores válidos.')
        return
    }

    // se a forma for retangular, verifica se dimensao2 é válido
    if (formaSelect.value === 'retangular' && isNaN(dimensao2)) {
        alert('Por favor, forneça um valor válido para Dimensão 2.')
        return
    }

    let tamanho, area

    switch (formaSelect.value) {
        case 'redonda':
            const raio = dimensao1 / 2
            tamanho = dimensao1
            area = Math.PI * (raio * raio)
            break
        case 'quadrada':
            tamanho = dimensao1 * dimensao1
            area = tamanho 
            break
        case 'retangular':
            tamanho = dimensao1 * dimensao2
            area = tamanho 
            break
        default:
            console.error('Forma de pizza não reconhecida')
            return
    }

    const pizza = {
        nome: nome,
        tamanho: tamanho,
        dimensao1: dimensao1,
        dimensao2: dimensao2,
        preco: preco,
        precoPorCm: preco / area,
        forma: formaSelect.value 
    }

    pizzas.push(pizza)
    updateTable() 
}

function updateTable() {
    tbody.innerHTML = ''

    // ordena as pizzas por preço por cm² 
    pizzas.sort((a, b) => a.precoPorCm - b.precoPorCm)

    let melhorCustoBeneficio = pizzas[0]

    pizzas.forEach((pizza, index) => {
        let newLine = document.createElement('tr')

        let cellNome = document.createElement('td')
        cellNome.textContent = pizza.nome
        newLine.appendChild(cellNome)

        let cellTamanho = document.createElement('td')
        if (pizza.forma === 'retangular') {
            cellTamanho.textContent = `${pizza.dimensao1}cm x ${pizza.dimensao2}cm`
        } else if (pizza.forma === 'quadrada') {
            cellTamanho.textContent = `${pizza.dimensao1}cm x ${pizza.dimensao1}cm`
        } else {
            cellTamanho.textContent = pizza.tamanho + 'cm'
        }
        newLine.appendChild(cellTamanho)

        let cellPreco = document.createElement('td')
        cellPreco.textContent = pizza.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        newLine.appendChild(cellPreco)

        let cellPrecoPorCm = document.createElement('td')
        cellPrecoPorCm.textContent = pizza.precoPorCm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        newLine.appendChild(cellPrecoPorCm)

        let cellDiferenca = document.createElement('td')
        const diferencaPercentual = calcularDiferencaPercentual(pizza, melhorCustoBeneficio)
        cellDiferenca.textContent = diferencaPercentual
        newLine.appendChild(cellDiferenca)

        tbody.appendChild(newLine)
 
        // deixa o melhor cb verdinho 
        if (index === 0) {
            newLine.classList.add('table-success')
            cellDiferenca.textContent = "MELHOR CB"
        }
    })
}

function toggleInputs() {
    const dimensao1Label = document.querySelector('#label1')
    const dimensao2Label = document.querySelector('#label2')
    const dimensao2Input = document.querySelector('#iDimensao2')

    switch (formaSelect.value) {
        case 'redonda':
            dimensao1Label.textContent = 'Tamanho (cm)'
            dimensao2Label.classList.add('hidden')
            dimensao2Input.classList.add('hidden')
            break
        case 'quadrada':
            dimensao1Label.textContent = 'Tamanho (cm)'
            dimensao2Label.classList.add('hidden')
            dimensao2Input.classList.add('hidden')
            break
        case 'retangular':
            dimensao1Label.textContent = 'Lado 1 (cm)'
            dimensao2Label.textContent = 'Lado 2 (cm):'
            dimensao2Label.classList.remove('hidden')
            dimensao2Input.classList.remove('hidden')
            break
        default:
            console.error('Forma de pizza não reconhecida')
    }
}

function calcularDiferencaPercentual(pizza, melhorCustoBeneficio) {
    const diferencaPercentual = ((pizza.precoPorCm - melhorCustoBeneficio.precoPorCm) / melhorCustoBeneficio.precoPorCm) * 100

    if (diferencaPercentual > 0) {
        return `+${diferencaPercentual.toFixed(2)}%`
    } else {
        return `${diferencaPercentual.toFixed(2)}%`
    }
}
