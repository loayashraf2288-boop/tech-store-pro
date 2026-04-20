const DB_URL = "https://store-33acf-default-rtdb.firebaseio.com";
let products = [];
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// جلب المنتجات
async function fetchProducts() {
    const res = await fetch(`${DB_URL}/products.json`);
    const data = await res.json();
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    products = [];
    if(data) {
        Object.keys(data).forEach(id => {
            products.push({id, ...data[id]});
            container.innerHTML += `
                <div class="product-card">
                    <div class="product-img"><i class="${data[id].icon}"></i></div>
                    <div class="product-title" style="font-size: 14px;">${data[id].name}</div>
                    <div class="product-price">${data[id].price} ج</div>
                    <button class="btn-add" onclick="addToCart('${id}')">أضف للسلة</button>
                </div>`;
        });
    } else { container.innerHTML = '<p>المتجر متصفر حالياً</p>'; }
}

// السلة
const sidebar = document.getElementById('cartSidebar');
document.getElementById('openCart').onclick = () => sidebar.style.display = 'block';
document.getElementById('closeCart').onclick = () => sidebar.style.display = 'none';

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const exist = cart.find(x => x.id === id);
    if(exist) exist.qty++; else cart.push({...p, qty: 1});
    saveCart();
}

function saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const div = document.getElementById('cartItems');
    let total = 0, count = 0;
    div.innerHTML = '';
    cart.forEach(i => {
        total += i.price * i.qty; count += i.qty;
        div.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px;">
            <span>${i.name} (x${i.qty})</span>
            <span style="color:var(--primary-blue)">${i.price * i.qty} ج</span>
        </div>`;
    });
    document.getElementById('cartTotal').innerText = total + " جنيه";
    document.querySelectorAll('.cart-count').forEach(s => s.innerText = count);
}

// التوصيل
function openCheckout() { if(cart.length > 0) document.getElementById('checkoutModal').style.display = 'flex'; }
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

async function confirmCheckout() {
    const n = document.getElementById('custName').value;
    const p = document.getElementById('custPhone').value;
    const a = document.getElementById('custAddress').value;
    if(!n || !p || !a) return alert('كمل بياناتك يا بطل');

    const btn = document.getElementById('confirmOrderBtn');
    btn.disabled = true; btn.innerText = "جاري الحفظ...";

    const order = { customerName: n, customerPhone: p, customerAddress: a, 
                   details: cart.map(x => `${x.name} (x${x.qty})`).join(', '),
                   totalPrice: cart.reduce((s, x) => s + (x.price * x.qty), 0),
                   date: new Date().toLocaleString('ar-EG') };

    await fetch(`${DB_URL}/orders.json`, { method: 'POST', body: JSON.stringify(order) });
    
    let msg = `طلب جديد TECHSTORE ⚡\nالاسم: ${n}\nموبايل: ${p}\nعنوان: ${a}\nالمنتجات: ${order.details}\nإجمالي: ${order.totalPrice} جنيه`;
    window.open(`https://wa.me/201121189810?text=${encodeURIComponent(msg)}`, '_blank');
    
    cart = []; saveCart(); closeCheckout();
    btn.disabled = false; btn.innerText = "تأكيد الطلب";
}

window.onload = () => { fetchProducts(); renderCart(); };
