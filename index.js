        const table = document.querySelector('#table');
        const formaSelect = document.querySelector('#iForma');
        const tbody = table.querySelector('tbody');

        let pizzas = [];

        function adicionarPizza() {
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
                    tamanho = dimensao1 * dimensao1;
                    area = tamanho; // Área da pizza quadrada é o próprio tamanho
                    break;
                case 'retangular':
                    tamanho = dimensao1 * dimensao2;
                    area = tamanho; // Área da pizza retangular é o próprio tamanho
                    break;
                default:
                    console.error('Forma de pizza não reconhecida');
                    return;
            }

            const pizza = {
                nome: nome,
                tamanho: tamanho,
                dimensao1: dimensao1,
                dimensao2: dimensao2,
                preco: preco,
                precoPorCm: preco / area,
                forma: formaSelect.value // Adiciona o formato ao objeto de pizza
            };

            pizzas.push(pizza);
            updateTable(); // Atualiza a tabela após adicionar uma pizza
        }

        function updateTable() {
            tbody.innerHTML = '';

            // Ordena as pizzas por preço por cm² em ordem crescente
            pizzas.sort((a, b) => a.precoPorCm - b.precoPorCm);

            let melhorCustoBeneficio = pizzas[0];

            pizzas.forEach((pizza, index) => {
                let newLine = document.createElement('tr');

                let cellNome = document.createElement('td');
                cellNome.textContent = pizza.nome;
                newLine.appendChild(cellNome);

                let cellTamanho = document.createElement('td');
                if (pizza.forma === 'retangular') {
                    cellTamanho.textContent = `${pizza.dimensao1}cm x ${pizza.dimensao2}cm`;
                } else if (pizza.forma === 'quadrada') {
                    cellTamanho.textContent = `${pizza.dimensao1}cm x ${pizza.dimensao1}cm`;
                } else {
                    cellTamanho.textContent = pizza.tamanho + 'cm';
                }
                newLine.appendChild(cellTamanho);


                let cellPreco = document.createElement('td');
                cellPreco.textContent = pizza.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                newLine.appendChild(cellPreco);

                let cellPrecoPorCm = document.createElement('td');
                cellPrecoPorCm.textContent = pizza.precoPorCm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                newLine.appendChild(cellPrecoPorCm);

                let cellDiferenca = document.createElement('td');
                const diferencaPercentual = calcularDiferencaPercentual(pizza, melhorCustoBeneficio);
                cellDiferenca.textContent = diferencaPercentual;
                newLine.appendChild(cellDiferenca);

                tbody.appendChild(newLine);

                // Adicionar a marcação de "MELHOR CB" na linha correspondente
                if (index === 0) {
                    newLine.classList.add('table-success');
                cellDiferenca.textContent = "MELHOR CB";
                }
            });
        }

        function toggleInputs() {
            const dimensao1Label = document.querySelector('#label1');
            const dimensao2Label = document.querySelector('#label2');
            const dimensao2Input = document.querySelector('#iDimensao2');

            switch (formaSelect.value) {
                case 'redonda':
                    dimensao1Label.textContent = 'Tamanho (cm)';
                    dimensao2Label.classList.add('hidden');
                    dimensao2Input.classList.add('hidden');
                    break;
                case 'quadrada':
                    dimensao1Label.textContent = 'Tamanho (cm)';
                    dimensao2Label.classList.add('hidden');
                    dimensao2Input.classList.add('hidden');
                    break;
                case 'retangular':
                    dimensao1Label.textContent = 'Lado 1 (cm)';
                    dimensao2Label.textContent = 'Lado 2 (cm):';
                    dimensao2Label.classList.remove('hidden');
                    dimensao2Input.classList.remove('hidden');
                    break;
                default:
                    console.error('Forma de pizza não reconhecida');
            }
        }

        function calcularDiferencaPercentual(pizza, melhorCustoBeneficio) {
            const diferencaPercentual = ((pizza.precoPorCm - melhorCustoBeneficio.precoPorCm) / melhorCustoBeneficio.precoPorCm) * 100;

            if (diferencaPercentual > 0) {
                return `+${diferencaPercentual.toFixed(2)}%`;
            } else {
                return `${diferencaPercentual.toFixed(2)}%`;
            }
        }