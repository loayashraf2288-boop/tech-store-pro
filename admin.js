const DB_URL = "https://store-33acf-default-rtdb.firebaseio.com";

// إدارة المنتجات
async function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const icon = document.getElementById('pIcon').value;
    if (!name || !price) return alert("املا البيانات!");

    await fetch(`${DB_URL}/products.json`, { method: 'POST', body: JSON.stringify({name, price, icon}) });
    document.getElementById('productForm').reset();
    fetchProducts();
}

async function fetchProducts() {
    const res = await fetch(`${DB_URL}/products.json`);
    const data = await res.json();
    const tbody = document.querySelector('#products-table tbody');
    if(!tbody) return; tbody.innerHTML = '';
    let count = 0;
    if (data) {
        Object.keys(data).forEach(id => {
            count++; const p = data[id];
            tbody.innerHTML += `<tr><td>${p.name}</td><td>${p.price} ج</td><td><i class="${p.icon}"></i></td><td><button class="btn" style="background:#ff4d4d; color:white;" onclick="deleteProduct('${id}')">حذف</button></td></tr>`;
        });
    }
    document.getElementById('stat-products').innerText = count;
}

async function deleteProduct(id) {
    if(confirm("مسح؟")) { await fetch(`${DB_URL}/products/${id}.json`, { method: 'DELETE' }); fetchProducts(); }
}

// إدارة الطلبات (الجديدة)
async function fetchOrders() {
    const res = await fetch(`${DB_URL}/orders.json`);
    const data = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    if(!tbody) return; tbody.innerHTML = '';
    let count = 0; let totalRev = 0;
    if (data) {
        Object.keys(data).reverse().forEach(id => {
            count++; const o = data[id]; totalRev += Number(o.totalPrice);
            tbody.innerHTML += `
                <tr>
                    <td><strong>${o.customerName}</strong><br><small style="color:#0066ff">${o.customerPhone}</small></td>
                    <td style="font-size:12px">${o.customerAddress}</td>
                    <td style="font-size:12px">${o.details}</td>
                    <td style="font-weight:bold; color:#00cc66">${o.totalPrice} ج</td>
                    <td style="font-size:11px">${o.date}</td>
                </tr>`;
        });
    }
    document.getElementById('stat-orders').innerText = count;
    document.getElementById('stat-revenue').innerText = totalRev.toLocaleString() + " ج";
}

window.onload = () => { fetchProducts(); fetchOrders(); setInterval(fetchOrders, 30000); };
