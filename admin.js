const DB_URL = "https://store-c8993-default-rtdb.firebaseio.com";

// --- إدارة المنتجات ---
async function addProduct() {
    const product = {
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        icon: document.getElementById('pIcon').value
    };
    if (!product.name || !product.price) return alert("املا البيانات يا لؤي!");

    await fetch(`${DB_URL}/products.json`, {
        method: 'POST',
        body: JSON.stringify(product)
    });
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    fetchProducts();
}

async function fetchProducts() {
    const res = await fetch(`${DB_URL}/products.json`);
    const data = await res.json();
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    let count = 0;
    if (data) {
        Object.keys(data).forEach(id => {
            count++;
            const p = data[id];
            tbody.innerHTML += `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.price} ج</td>
                    <td><i class="${p.icon}"></i></td>
                    <td><button class="btn btn-del" onclick="deleteProduct('${id}')">مسح</button></td>
                </tr>
            `;
        });
    }
    document.getElementById('stat-products').innerText = count;
}

async function deleteProduct(id) {
    if (confirm("هتمسحه بجد؟")) {
        await fetch(`${DB_URL}/products/${id}.json`, { method: 'DELETE' });
        fetchProducts();
    }
}

// --- إدارة الطلبات ---
async function fetchOrders() {
    const res = await fetch(`${DB_URL}/orders.json`);
    const data = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    let count = 0;
    let totalRev = 0;
    if (data) {
        Object.keys(data).forEach(id => {
            count++;
            const o = data[id];
            totalRev += Number(o.totalPrice);
            tbody.innerHTML += `
                <tr>
                    <td>${o.customerName || 'عميل مجهول'}</td>
                    <td style="font-size: 12px;">${o.details}</td>
                    <td>${o.totalPrice} ج</td>
                    <td>${o.date}</td>
                </tr>
            `;
        });
    }
    document.getElementById('stat-orders').innerText = count;
    document.getElementById('order-count').innerText = count;
    document.getElementById('stat-revenue').innerText = totalRev + " ج";
}

// --- الشات (تجريبي) ---
async function sendChat() {
    const text = document.getElementById('chat-input').value;
    if (!text) return;
    await fetch(`${DB_URL}/messages.json`, {
        method: 'POST',
        body: JSON.stringify({ sender: 'admin', text: text, time: new Date().toLocaleTimeString() })
    });
    document.getElementById('chat-input').value = '';
    fetchChat();
}

async function fetchChat() {
    const res = await fetch(`${DB_URL}/messages.json`);
    const data = await res.json();
    const box = document.getElementById('chat-box');
    box.innerHTML = '';
    if (data) {
        Object.keys(data).forEach(id => {
            const m = data[id];
            box.innerHTML += `<div class="msg ${m.sender}">${m.text}</div>`;
        });
        box.scrollTop = box.scrollHeight;
    }
}

// تشغيل تلقائي
window.onload = () => {
    fetchProducts();
    fetchOrders();
    fetchChat();
    setInterval(fetchOrders, 10000); // تحديث الطلبات كل 10 ثواني
    setInterval(fetchChat, 3000);   // تحديث الشات كل 3 ثواني
};
