const DB_URL = "https://store-33acf-default-rtdb.firebaseio.com";

async function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const icon = document.getElementById('pIcon').value;
    if(!name || !price) return alert('املا البيانات');
    await fetch(`${DB_URL}/products.json`, { method: 'POST', body: JSON.stringify({name, price, icon}) });
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    fetchProducts();
}

async function fetchProducts() {
    const res = await fetch(`${DB_URL}/products.json`);
    const data = await res.json();
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    if(data) {
        Object.keys(data).forEach(id => {
            tbody.innerHTML += `<tr><td>${data[id].name}</td><td>${data[id].price} ج</td><td><button class="btn" style="background:#ff4d4d; color:#fff;" onclick="deleteProduct('${id}')">حذف</button></td></tr>`;
        });
    }
}

async function deleteProduct(id) {
    if(confirm('أكيد؟')) { await fetch(`${DB_URL}/products/${id}.json`, { method: 'DELETE' }); fetchProducts(); }
}

async function fetchOrders() {
    const res = await fetch(`${DB_URL}/orders.json`);
    const data = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    let totalRev = 0;
    if(data) {
        Object.keys(data).reverse().forEach(id => {
            const o = data[id];
            totalRev += Number(o.totalPrice);
            tbody.innerHTML += `<tr>
                <td><b>${o.customerName}</b><br><small>${o.customerPhone}</small></td>
                <td style="font-size:11px">${o.customerAddress}</td>
                <td style="font-size:11px">${o.details}</td>
                <td>${o.totalPrice} ج</td>
            </tr>`;
        });
    }
    document.getElementById('stat-orders').innerText = data ? Object.keys(data).length : 0;
    document.getElementById('stat-revenue').innerText = totalRev + " ج";
}

window.onload = () => { fetchProducts(); fetchOrders(); setInterval(fetchOrders, 20000); };
