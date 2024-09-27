document.addEventListener('DOMContentLoaded', loadOrders);

function loadOrders() {
    fetch('GetOrders.php')
        .then(response => response.json())
        .then(orders => {
            const ordersDiv = document.getElementById('orders');
            ordersDiv.innerHTML = ''; // Clear previous orders
            orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order';
                orderDiv.innerHTML = `
                    <h2>table #${order.table_number}</h2>
                    <p>order time ${order.order_time}</p>
                    <p>${order.items}</p>
                    <button class="remove-btn" onclick="removeOrder(${order.id})">✓</button>
                `;
                ordersDiv.appendChild(orderDiv);
            });
        });
}

function removeOrder(orderId) {
    fetch('RemoveOrders.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `orderId=${orderId}`
    })
    .then(response => response.text())
    .then(response => {
        console.log(response);
        loadOrders(); // Reload orders after removal
    });
}