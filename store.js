// لينك الداتا بيس بتاعتك (Firebase Realtime Database)
const FIREBASE_URL = "https://store-c8993-default-rtdb.firebaseio.com";

let products = [];
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// --- جلب المنتجات من Firebase ---
async function fetchProductsFromDB() {
    try {
        const response = await fetch(`${FIREBASE_URL}/products.json`);
        const data = await response.json();
        
        products = [];
        if (data) {
            // تحويل البيانات من أوبجكت لمصفوفة عشان نعرف نعرضها
            Object.keys(data).forEach(key => {
                products.push({ id: key, ...data[key] });
            });
        }
        renderProducts();
    } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
        document.getElementById('productsContainer').innerHTML = "<p style='color:red; text-align:center; grid-column:1/-1;'>حدث خطأ في الاتصال بقاعدة البيانات.</p>";
    }
}

// --- عرض المنتجات ---
function renderProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-gray);">
                <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h2>المتجر فارغ حالياً</h2>
                <p>سيتم إضافة المنتجات قريباً من خلال لوحة التحكم.</p>
            </div>`;
        return;
    }

    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <i class="fa-regular fa-heart" style="position: absolute; top: 12px; left: 12px; cursor: pointer; z-index: 2;"></i>
                <div class="product-img"><i class="${product.icon || 'fa-solid fa-box'}"></i></div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${Number(product.price).toLocaleString()} جنيه</div>
                <button class="btn-add" onclick="addToCart('${product.id}')"><i class="fa-solid fa-cart-shopping"></i> أضف للسلة</button>
            </div>
        `;
    });
}

// --- تشغيل السلة ---
const cartSidebar = document.getElementById('cartSidebar');
document.querySelector('.cart-trigger').addEventListener('click', () => cartSidebar.style.display = 'block');
document.getElementById('closeCartBtn').addEventListener('click', () => cartSidebar.style.display = 'none');

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.qty += 1;
    else cart.push({ ...product, qty: 1 });
    
    updateCart();
    // تأثير بسيط عند الإضافة
    cartSidebar.style.display = 'block';
}

function updateCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    let total = 0;
    let count = 0;
    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        cartItemsDiv.innerHTML += `
            <div style="display: flex; gap: 10px; margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                <div style="width: 50px; height: 50px; background: var(--bg-color); display:flex; align-items:center; justify-content:center; color: var(--primary-blue); border-radius: 5px;"><i class="${item.icon}"></i></div>
                <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.name}</h4>
                    <p style="color: var(--primary-blue); font-weight: bold;">${Number(item.price).toLocaleString()} جنيه</p>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
                    <i class="fa-solid fa-trash" style="color: #ff4d4d; cursor: pointer;" onclick="cart.splice(cart.indexOf(${item}), 1); updateCart();"></i>
                    <span style="font-weight: bold;">x${item.qty}</span>
                </div>
            </div>
        `;
    });

    document.getElementById('cartTotal').innerText = `${total.toLocaleString()} جنيه`;
    document.querySelector('.cart-count').innerText = count;
}

// --- إرسال الطلب واتساب ---
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return alert('السلة فارغة!');
    let msg = "طلب جديد TECHSTORE ⚡\n\n";
    let total = 0;
    cart.forEach(i => { msg += `▪ ${i.name} (x${i.qty}) - ${i.price * i.qty} ج\n`; total += i.price * i.qty; });
    msg += `\nالإجمالي: ${total} جنيه`;
    window.open(`https://wa.me/201121189810?text=${encodeURIComponent(msg)}`, '_blank');
});

// تشغيل عند فتح الصفحة
window.onload = () => {
    fetchProductsFromDB();
    renderCart();
};
