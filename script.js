// Load orders from localStorage
let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
}

function openForm(productName) {
    const form = document.getElementById('orderForm');
    const productInput = document.getElementById('productInput');
    productInput.value = productName;
    form.classList.remove('hidden');
    form.classList.add('fade-in');
}

function closeForm() {
    const form = document.getElementById('orderForm');
    form.classList.add('hidden');
}

function generateOrderId() {
    return `ORD-${Math.floor(Math.random() * 1000000)}-ER`;
}

async function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById('usernameInput').value;
    const telegram = document.getElementById('telegramInput').value;
    const product = document.getElementById('productInput').value;
    
    // Fix the price selection
    const productCard = Array.from(document.querySelectorAll('.product-card')).find(card => 
        card.querySelector('h3').textContent === product
    );
    const price = productCard.querySelector('.priceBox').innerText.split(': ')[1];
    
    const orderId = generateOrderId();

    const message = `Новый заказ!\nID заказа: ${orderId}\nЗаказчик: ${name},\nТовар: ${product},\nТелеграм: ${telegram}`;

    const botToken = "7711745813:AAHazLKxh9Z0OTMwwQGPxtlGYlVd7U0ZtCc";
    const chatId = "-1002429173551";

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    });
    
    userOrders.push({ orderId, product, price });
    saveOrders();

    alert('Ваш заказ отправлен! Спасибо!');
    closeForm();
    window.location.href = "https://t.me/minecraft_craftshop_bot";
}

function showOrders() {
    const ordersSection = document.getElementById('userOrders');
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = userOrders.map(order => 
        `<li class='mb-2'>ID: ${order.orderId}, Товар: ${order.product}, Цена: ${order.price}</li>`
    ).join('');
    ordersSection.classList.remove('hidden');
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();

        if (productName.includes(searchTerm) || category.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Load orders initially to display if the user checks the orders section
document.addEventListener('DOMContentLoaded', showOrders);
