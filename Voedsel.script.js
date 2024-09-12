const foodTable = document.getElementById('foodTable').getElementsByTagName('tbody')[0];
const addFoodButton = document.getElementById('addFoodButton');
const top5Restaurants = document.getElementById('top5Restaurants');

// Array met dummy data voor de top 5 restaurants
const restaurants = [
    { name: "Las Tapas", waste: 5 },
    { name: "El Bocado", waste: 10 },
    { name: "Casa de Tapas", waste: 15 },
    { name: "Tapas del Sol", waste: 20 },
    { name: "La Finca", waste: 25 }
];

// Voeg de top 5 restaurants toe aan de lijst
function updateTop5Restaurants() {
    top5Restaurants.innerHTML = ''; // Leeg de lijst

    restaurants.sort((a, b) => a.waste - b.waste); // Sorteer op de hoeveelheid verspild voedsel

    restaurants.forEach(restaurant => {
        const listItem = document.createElement('li');
        listItem.textContent = `${restaurant.name} - Verspild: ${restaurant.waste} kg`;
        top5Restaurants.appendChild(listItem);
    });
}

// Voeg voedsel toe functie
addFoodButton.addEventListener('click', function() {
    let product = prompt("Voedselproduct:");
    let purchaseDate = prompt("Koopdatum (jjjj-mm-dd):");
    let expirationDate = prompt("Vervaldatum (jjjj-mm-dd):");
    let quantity = prompt("Aantal:");

    if (!product || !purchaseDate || !expirationDate || !quantity) {
        alert("Vul alle velden in.");
        return;
    }

    // Maak een nieuwe rij in de tabel
    let newRow = foodTable.insertRow();
    let productCell = newRow.insertCell();
    let purchaseDateCell = newRow.insertCell();
    let expirationDateCell = newRow.insertCell();
    let quantityCell = newRow.insertCell();
    let consumedCell = newRow.insertCell();
    let wastedCell = newRow.insertCell();
    let actionsCell = newRow.insertCell();

    // Voeg gegevens toe aan de cellen
    productCell.innerHTML = product;
    purchaseDateCell.innerHTML = purchaseDate;
    expirationDateCell.innerHTML = expirationDate;
    quantityCell.innerHTML = quantity;
    consumedCell.innerHTML = '<input type="number" min="0" max="' + quantity + '" value="0" onchange="updateWasted(this)">';
    wastedCell.innerHTML = '<input type="number" min="0" max="' + quantity + '" value="0" onchange="updateWasted(this)">';
    actionsCell.innerHTML = '<button onclick="deleteRow(this)">Verwijderen</button>';
});

// Verwijder rij functie
function deleteRow(button) {
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Update functie voor verspild voedsel
function updateWasted(input) {
    const row = input.parentNode.parentNode;
    const quantity = parseInt(row.cells[3].innerText);
    const consumed = parseInt(row.cells[4].querySelector('input').value);
    const wasted = parseInt(row.cells[5].querySelector('input').value);

    if (consumed + wasted > quantity) {
        alert("De totale verbruikte en verspilde hoeveelheden kunnen niet groter zijn dan het totale aantal.");
        input.value = 0; // Reset de waarde
    }
}

// Init functie om de top 5 lijst bij het laden in te stellen
updateTop5Restaurants();
