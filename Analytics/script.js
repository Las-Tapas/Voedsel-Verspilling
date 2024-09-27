// Simuleer een database met restaurantgegevens
let wasteData = {
    'Las Tapas': { amount: 50, unit: 'kg' },
    'El Rincón de España': { amount: 30, unit: 'kg' },
    'La Paella Perfecta': { amount: 40, unit: 'kg' },
    'Sabores del Mediterráneo': { amount: 35, unit: 'kg' },
    'Flamenco Bistro': { amount: 45, unit: 'kg' }
};

let products = [];

// Initialiseer de staafgrafiek
const ctx = document.getElementById('waste-chart').getContext('2d');
const wasteChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(wasteData),
        datasets: [{
            label: 'Voedselverspilling (kg)',
            data: Object.values(wasteData).map(d => d.amount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hoeveelheid (kg)'
                }
            }
        }
    }
});

// Initialiseer de taartgrafiek
const pieCtx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: Object.keys(wasteData),
        datasets: [{
            data: Object.values(wasteData).map(d => d.amount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Voedselverspilling per Restaurant (Eerste Maand)'
            }
        }
    }
});

// Functie om het leaderboard bij te werken
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    Object.entries(wasteData)
        .sort((a, b) => a[1].amount - b[1].amount)
        .forEach(([restaurant, data], index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${restaurant}</span> <span>${data.amount}${data.unit}</span>`;
            leaderboardList.appendChild(li);
        });
}

// Functie om de producttabel bij te werken
function updateProductTable() {
    const tableBody = document.querySelector('#product-table tbody');
    tableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = product.name;
        row.insertCell(1).textContent = `${product.amount} ${product.unit}`;
        row.insertCell(2).textContent = product.purchaseDate;
        row.insertCell(3).textContent = product.expiryDate;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijder';
        deleteButton.onclick = () => removeProduct(index);
        row.insertCell(4).appendChild(deleteButton);
    });
}

// Functie om een product te verwijderen
function removeProduct(index) {
    const removedProduct = products.splice(index, 1)[0];
    wasteData['Las Tapas'].amount -= removedProduct.amount;
    updateProductTable();
    updateCharts();
}

// Functie om de grafieken bij te werken
function updateCharts() {
    wasteChart.data.datasets[0].data = Object.values(wasteData).map(d => d.amount);
    wasteChart.update();
    pieChart.data.datasets[0].data = Object.values(wasteData).map(d => d.amount);
    pieChart.update();
}

// Eventlistener voor het formulier
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const productName = document.getElementById('product-name').value;
    const productAmount = Number(document.getElementById('product-amount').value);
    const productUnit = document.getElementById('product-unit').value;
    const purchaseDate = document.getElementById('purchase-date').value;
    const expiryDate = document.getElementById('expiry-date').value;

    products.push({
        name: productName,
        amount: productAmount,
        unit: productUnit,
        purchaseDate: purchaseDate,
        expiryDate: expiryDate
    });

    // Update de gegevens voor Las Tapas
    wasteData['Las Tapas'].amount += productAmount;

    updateProductTable();
    updateCharts();
    updateLeaderboard();

    // Reset het formulier
    e.target.reset();
});

// Functie om maandelijkse voedselverspilling te simuleren
function simulateMonthlyWaste() {
    Object.keys(wasteData).forEach(restaurant => {
        if (restaurant !== 'Las Tapas') {
            wasteData[restaurant].amount = Math.floor(Math.random() * 50) + 20; // Willekeurig tussen 20 en 70
        }
    });
    updateLeaderboard();
    updateCharts();
}

// Simuleer maandelijkse veranderingen elke 10 seconden
setInterval(simulateMonthlyWaste, 10000);

// Initiële updates
updateLeaderboard();
updateProductTable();