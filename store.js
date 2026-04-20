const FIREBASE_URL = "https://store-33acf-default-rtdb.firebaseio.com";
let products = [];
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// جلب المنتجات
async function fetchProductsFromDB() {
    try {
        const response = await fetch(`${FIREBASE_URL}/products.json`);
        const data = await response.json();
        products = [];
        if (data) { Object.keys(data).forEach(key => products.push({ id: key, ...data[key] })); }
        renderProducts();
    } catch (error) { console.error("Error", error); }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #8892b0;"><h2>المتجر فارغ حالياً</h2><p>ضيف منتجات من لوحة التحكم يا لؤي</p></div>`;
        return;
    }
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <div class="product-img"><i class="${p.icon}"></i></div>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">${Number(p.price).toLocaleString()} جنيه</div>
                <button class="btn-add" onclick="addToCart('${p.id}')"><i class="fa-solid fa-cart-shopping"></i> أضف للسلة</button>
            </div>`;
    });
}

// السلة
const cartSidebar = document.getElementById('cartSidebar');
document.querySelectorAll('.cart-trigger').forEach(btn => btn.addEventListener('click', () => { if(cartSidebar) cartSidebar.style.display = 'block'; }));
const closeBtn = document.getElementById('closeCartBtn');
if(closeBtn) closeBtn.addEventListener('click', () => cartSidebar.style.display = 'none');

function addToCart(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    const exist = cart.find(i => i.id === id);
    if (exist) exist.qty++; else cart.push({ ...p, qty: 1 });
    updateCart();
    if(cartSidebar) cartSidebar.style.display = 'block';
}

function changeQty(id, amt) {
    const item = cart.find(i => i.id === id);
    if (item) { item.qty += amt; if (item.qty <= 0) cart = cart.filter(p => p.id !== id); updateCart(); }
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); updateCart(); }
function updateCart() { localStorage.setItem('techstore_cart', JSON.stringify(cart)); renderCart(); }

function renderCart() {
    const div = document.getElementById('cartItems');
    if (!div) return;
    let total = 0, count = 0; div.innerHTML = '';
    cart.forEach(i => {
        total += i.price * i.qty; count += i.qty;
        div.innerHTML += `
            <div style="display:flex; gap:10px; margin-bottom:15px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; border:1px solid #1a2a44;">
                <div style="width:50px; height:50px; display:flex; align-items:center; justify-content:center; color:#0066ff; font-size:1.5rem;"><i class="${i.icon}"></i></div>
                <div style="flex:1;">
                    <h4 style="font-size:0.9rem; margin-bottom:5px;">${i.name}</h4>
                    <p style="color:#0066ff; font-weight:bold;">${Number(i.price).toLocaleString()} ج</p>
                    <div style="display:flex; gap:10px; margin-top:5px;"><button onclick="changeQty('${i.id}',-1)" style="background:none; color:white; border:none; cursor:pointer;">-</button><span>${i.qty}</span><button onclick="changeQty('${i.id}',1)" style="background:none; color:white; border:none; cursor:pointer;">+</button></div>
                </div>
                <i class="fa-solid fa-trash" style="color:#ff4d4d; cursor:pointer;" onclick="removeFromCart('${i.id}')"></i>
            </div>`;
    });
    document.getElementById('cartTotal').innerText = `${total.toLocaleString()} جنيه`;
    document.querySelectorAll('.cart-count').forEach(s => s.innerText = count);
}

// Checkout Logic
function openCheckoutModal() {
    if (cart.length === 0) return alert('السلة فارغة!');
    document.getElementById('checkoutModal').style.display = 'flex';
    cartSidebar.style.display = 'none';
}

function closeCheckoutModal() { document.getElementById('checkoutModal').style.display = 'none'; }

async function confirmCheckout() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    if(!name || !phone || !address) return alert('كمل البيانات يا بطل!');

    const btn = document.getElementById('confirmOrderBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
    btn.disabled = true;

    try {
        let details = cart.map(i => `${i.name} (x${i.qty})`).join('، ');
        let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        const orderData = { customerName: name, customerPhone: phone, customerAddress: address, details: details, totalPrice: total, date: new Date().toLocaleString('ar-EG') };

        await fetch(`${FIREBASE_URL}/orders.json`, { method: 'POST', body: JSON.stringify(orderData) });

        let msg = `طلب جديد TECHSTORE ⚡\n👤 الاسم: ${name}\n📱 موبايل: ${phone}\n📍 عنوان: ${address}\n🛒 المنتجات: ${details}\n💰 إجمالي: ${total} جنيه`;
        window.open(`https://wa.me/201121189810?text=${encodeURIComponent(msg)}`, '_blank');
        
        cart = []; updateCart(); closeCheckoutModal();
        alert("تم تسجيل طلبك بنجاح!");
    } catch (err) { alert("مشكلة في الشبكة!"); } 
    finally { btn.innerHTML = 'تأكيد وإرسال الطلب'; btn.disabled = false; }
}

window.onload = () => { fetchProductsFromDB(); renderCart(); };
