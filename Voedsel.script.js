document.addEventListener('DOMContentLoaded', function () {
    const foodTable = document.getElementById('foodTable').getElementsByTagName('tbody')[0];
    const addFoodButton = document.getElementById('addFoodButton');
    const top5Restaurants = document.getElementById('top5Restaurants');

    // Array with dummy data for top 5 restaurants
    const restaurants = [
        { name: "Las Tapas", waste: 5 },
        { name: "El Bocado", waste: 10 },
        { name: "Casa de Tapas", waste: 15 },
        { name: "Tapas del Sol", waste: 20 },
        { name: "La Finca", waste: 25 }
    ];

    // Function to update the top 5 restaurants list
    function updateTop5Restaurants() {
        top5Restaurants.innerHTML = ''; // Clear the list

        restaurants.sort((a, b) => a.waste - b.waste); // Sort by the amount of wasted food

        restaurants.forEach(restaurant => {
            const listItem = document.createElement('li');
            listItem.textContent = `${restaurant.name} - Verspild: ${restaurant.waste} kg`;
            top5Restaurants.appendChild(listItem);
        });
    }

    // Initialize the top 5 list on load
    updateTop5Restaurants();

    // Add food item function
    addFoodButton.addEventListener('click', function () {
        let product = prompt("Voedselproduct:");
        let purchaseDate = prompt("Koopdatum (jjjj-mm-dd):");
        let expirationDate = prompt("Vervaldatum (jjjj-mm-dd):");
        let quantity = prompt("Aantal:");

        if (!product || !purchaseDate || !expirationDate || !quantity) {
            alert("Vul alle velden in.");
            return;
        }

        // Create a new row in the table
        let newRow = foodTable.insertRow();
        let productCell = newRow.insertCell();
        let purchaseDateCell = newRow.insertCell();
        let expirationDateCell = newRow.insertCell();
        let quantityCell = newRow.insertCell();
        let consumedCell = newRow.insertCell();
        let wastedCell = newRow.insertCell();
        let actionsCell = newRow.insertCell();

        // Add data to the cells
        productCell.innerHTML = product;
        purchaseDateCell.innerHTML = purchaseDate;
        expirationDateCell.innerHTML = expirationDate;
        quantityCell.innerHTML = quantity;
        consumedCell.innerHTML = `<input type="number" min="0" max="${quantity}" value="0" onchange="updateWasted(this)">`;
        wastedCell.innerHTML = `<input type="number" min="0" max="${quantity}" value="0" onchange="updateWasted(this)">`;
        actionsCell.innerHTML = `<button onclick="deleteRow(this)">Verwijderen</button>`;
    });

    // Remove row function
    window.deleteRow = function (button) {
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
    };

    // Update function for wasted food
    window.updateWasted = function (input) {
        const row = input.parentNode.parentNode;
        const quantity = parseInt(row.cells[3].innerText);
        const consumed = parseInt(row.cells[4].querySelector('input').value);
        const wasted = parseInt(row.cells[5].querySelector('input').value);

        if (consumed + wasted > quantity) {
            alert("De totale verbruikte en verspilde hoeveelheden kunnen niet groter zijn dan het totale aantal.");
            input.value = 0; // Reset the value
        }
    };

    // Google Charts setup and drawing
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const data = google.visualization.arrayToDataTable([
            ['kG', 'Maand'],
            [1, 5],
            [2, 10],
            [3, 15],
            [4, 20],
            [5, 25],
            [6, 30],
            [7, 35],
            [8, 40],
            [9, 45],
            [10, 60],
            [11, 65],
            [12,  70],
        ]);
        const options = {
            title: 'Voedselverspilling',
            hAxis: { title: 'Maanden' },
            vAxis: { title: 'Totaal aantal in KG' },
            legend: 'none'
        };
        const chart = new google.visualization.LineChart(document.getElementById('myChart'));
        chart.draw(data, options);
    }
});
