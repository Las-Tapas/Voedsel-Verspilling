document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebarButton');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }
    
    const foodTable = document.getElementById('foodTable').getElementsByTagName('tbody')[0];
    const addFoodButton = document.getElementById('addFoodButton');

    // Load food items from local storage
    function loadFoodItems() {
        const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
        console.log('Loaded food items:', foodItems);
        foodItems.forEach(item => {
            const newRow = foodTable.insertRow();
            newRow.insertCell().innerText = item.product;
            newRow.insertCell().innerText = item.purchaseDate;
            newRow.insertCell().innerText = item.expirationDate;
            newRow.insertCell().innerText = item.quantity;
            newRow.insertCell().innerHTML = `<input type="number" min="0" max="${item.quantity}" value="${item.consumed || 0}" onchange="updateWasted(this)">`;
            newRow.insertCell().innerHTML = `<input type="number" min="0" max="${item.quantity}" value="${item.wasted || 0}" onchange="updateWasted(this)">`;
            newRow.insertCell().innerHTML = `<button onclick="deleteRow(this)">Verwijderen</button>`;
        });
    }

    loadFoodItems();

    // Add food item function
    addFoodButton.addEventListener('click', function () {
        let product = prompt("Voedselproduct:");
        let purchaseDate = prompt("Koopdatum (jjjj-mm-dd):");
        let expirationDate = prompt("Vervaldatum (jjjj-mm-dd):");
        let quantity = prompt("Aantal:");

        if (!product || !purchaseDate || !expirationDate || !quantity || isNaN(quantity)) {
            alert("Vul alle velden correct in.");
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
        productCell.innerText = product;
        purchaseDateCell.innerText = purchaseDate;
        expirationDateCell.innerText = expirationDate;
        quantityCell.innerText = quantity;
        consumedCell.innerHTML = `<input type="number" min="0" max="${quantity}" value="0" onchange="updateWasted(this)">`;
        wastedCell.innerHTML = `<input type="number" min="0" max="${quantity}" value="0" onchange="updateWasted(this)">`;
        actionsCell.innerHTML = `<button onclick="deleteRow(this)">Verwijderen</button>`;

        // Save to local storage
        saveFoodItems();
    });

    // Remove row function
    window.deleteRow = function (button) {
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        saveFoodItems(); // Update local storage after deletion
    };

    // Update function for wasted food
    window.updateWasted = function (input) {
        const row = input.parentNode.parentNode;
        const quantity = parseInt(row.cells[3].innerText) || 0;
        const consumed = parseInt(row.cells[4].querySelector('input').value) || 0;
        const wasted = parseInt(row.cells[5].querySelector('input').value) || 0;

        console.log('Updating wasted food: Quantity:', quantity, 'Consumed:', consumed, 'Wasted:', wasted);

        if (consumed + wasted > quantity) {
            alert("De totale verbruikte en verspilde hoeveelheden kunnen niet groter zijn dan het totale aantal.");
            input.value = 0; // Reset the value
            return; // Stop further processing
        }

        saveFoodItems(); // Update local storage when values change
    };

    // Function to save food items to local storage
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
        console.log('Saving to local storage:', foodItems);
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }

    // Google Charts setup and drawing
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const data = google.visualization.arrayToDataTable([
            ['Restaurant', 'Verspild (kg)'],
            ['Las Tapas', 1],
            ['El Bocado', 1],
            ['Casa de Tapas', 1],
            ['Tapas del Sol', 1],
            ['La Finca', 1]
        ]);

        const options = {
            title: 'Voedselverspilling per Restaurant',
            pieHole: 0.4
        };

        const chart = new google.visualization.PieChart(document.getElementById('myChart'));
        chart.draw(data, options);

        console.log('Chart drawn with data:', data.toJSON());
    }

    // Optional: Schedule chart update every month
    setInterval(() => {
        drawChart();
    }, 30 * 24 * 60 * 60 * 1000); // Roughly every month
});
