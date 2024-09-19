document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebarButton');
    const foodTable = document.getElementById('foodTable').getElementsByTagName('tbody')[0];
    const addFoodButton = document.getElementById('addFoodButton');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart(wastedLasTapas = 1) {
        const randomPercentages = generateRandomPercentages(4, 100 - wastedLasTapas);

        const data = google.visualization.arrayToDataTable([
            ['Restaurant', 'Verspild (kg)'],
            ['Las Tapas', wastedLasTapas],
            ['El Bocado', randomPercentages[0]],
            ['Casa de Tapas', randomPercentages[1]],
            ['Tapas del Sol', randomPercentages[2]],
            ['La Finca', randomPercentages[3]]
        ]);

        const options = {
            title: 'Voedselverspilling per Restaurant',
            pieHole: 0.4
        };

        const chart = new google.visualization.PieChart(document.getElementById('myChart'));
        chart.draw(data, options);
    }

    function generateRandomPercentages(count, total) {
        const percentages = [];
        let sum = 0;

        for (let i = 0; i < count - 1; i++) {
            const random = Math.floor(Math.random() * (total - sum));
            percentages.push(random);
            sum += random;
        }
        percentages.push(total - sum); 
        return percentages;
    }

    function loadFoodItems() {
        const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
        foodItems.forEach(item => addRowToTable(item));
    }

    function addRowToTable(item) {
        const newRow = foodTable.insertRow();
        newRow.insertCell().innerText = item.product;
        newRow.insertCell().innerText = item.purchaseDate;
        newRow.insertCell().innerText = item.expirationDate;
        newRow.insertCell().innerText = item.quantity;
        newRow.insertCell().innerHTML = `<input type="number" min="0" max="${item.quantity}" value="${item.consumed || 0}" onchange="updateWasted(this)">`;
        newRow.insertCell().innerHTML = `<input type="number" min="0" max="${item.quantity}" value="${item.wasted || 0}" onchange="updateWasted(this)">`;
        newRow.insertCell().innerHTML = `<button onclick="deleteRow(this)">Verwijderen</button>`;
    }

    addFoodButton.addEventListener('click', function () {
        let product = prompt("Voedselproduct:");
        let purchaseDate = prompt("Koopdatum (jjjj-mm-dd):");
        let expirationDate = prompt("Vervaldatum (jjjj-mm-dd):");
        let quantity = prompt("Aantal:");

        if (!product || !purchaseDate || !expirationDate || !quantity || isNaN(quantity)) {
            alert("Vul alle velden correct in.");
            return;
        }

        const newFoodItem = {
            product,
            purchaseDate,
            expirationDate,
            quantity,
            consumed: 0,
            wasted: 0
        };

        addRowToTable(newFoodItem);
        saveFoodItems();

        drawChart(parseInt(quantity)); 
    });

   
    window.deleteRow = function (button) {
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        saveFoodItems(); 
        drawChart(); 
    };

    window.updateWasted = function (input) {
        const row = input.parentNode.parentNode;
        const quantity = parseInt(row.cells[3].innerText) || 0;
        const consumed = parseInt(row.cells[4].querySelector('input').value) || 0;
        const wasted = parseInt(row.cells[5].querySelector('input').value) || 0;

        if (consumed + wasted > quantity) {
            alert("De totale verbruikte en verspilde hoeveelheden kunnen niet groter zijn dan het totale aantal.");
            input.value = 0; 
            return; 
        }

        saveFoodItems();
        drawChart(wasted); 
    };

    function saveFoodItems() {
        const foodItems = [];
        Array.from(foodTable.rows).forEach(row => {
            const cells = row.cells;
            if (cells.length > 0) {
                foodItems.push({
                    product: cells[0].innerText,
                    purchaseDate: cells[1].innerText,
                    expirationDate: cells[2].innerText,
                    quantity: cells[3].innerText,
                    consumed: parseInt(cells[4].querySelector('input').value) || 0,
                    wasted: parseInt(cells[5].querySelector('input').value) || 0
                });
            }
        });
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }

    loadFoodItems();
    drawChart(); 
});
