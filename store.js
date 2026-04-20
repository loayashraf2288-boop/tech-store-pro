// --- تهيئة البيانات الأساسية ---
let products = JSON.parse(localStorage.getItem('techstore_products')) || [];
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// --- تشغيل السلة الجانبية (فتح وإغلاق) ---
const cartSidebar = document.querySelector('.sidebar-cart');
const cartIcons = document.querySelectorAll('.fa-cart-shopping');
const closeCartBtn = document.querySelector('.cart-header .fa-xmark');

cartIcons.forEach(icon => {
    icon.parentElement.addEventListener('click', (e) => {
        if(!e.target.classList.contains('btn-add') && !e.target.parentElement.classList.contains('btn-add')) {
            cartSidebar.style.display = 'block';
        }
    });
});

if(closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.style.display = 'none';
    });
}

cartSidebar.style.display = 'none';
cartSidebar.style.position = 'fixed';
cartSidebar.style.left = '0';
cartSidebar.style.top = '0';
cartSidebar.style.height = '100vh';
cartSidebar.style.zIndex = '1000';
cartSidebar.style.boxShadow = '5px 0 15px rgba(0,0,0,0.5)';

// --- عرض المنتجات في الصفحة الرئيسية ---
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = ''; 

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-gray);">
                <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h2>المتجر فارغ حالياً</h2>
                <p>سيتم إضافة المنتجات قريباً من خلال لوحة التحكم.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                <i class="fa-regular fa-heart" style="position: absolute; top: 15px; left: 15px; cursor: pointer;"></i>
                <div class="product-img"><i class="${product.icon || 'fa-solid fa-box'}"></i></div>
                <h3 class="product-title">${product.name}</h3>
                <div class="stars">
                    4.9 <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <div class="product-price">${product.price.toLocaleString()} جنيه</div>
                <button class="btn-add" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-shopping"></i> أضف للسلة</button>
            </div>
        `;
        productsGrid.innerHTML += productHTML;
    });
}

// --- وظائف السلة ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    alert(`تم إضافة ${product.name} للسلة`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQty(productId, amount) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += amount;
        if (item.qty <= 0) removeFromCart(productId);
        else updateCart();
    }
}

function updateCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartContainer = document.querySelector('.cart-items-container');
    const totalElement = document.querySelector('.total-row span:last-child');
    const badgeElements = document.querySelectorAll('.badge');

    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        totalItems += item.qty;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-img" style="display:flex; justify-content:center; align-items:center; background: var(--bg-color); color: var(--primary-blue); font-size: 1.5rem;"><i class="${item.icon || 'fa-solid fa-box'}"></i></div>
                <div class="cart-item-info" style="flex: 1;">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} جنيه</p>
                    <div class="qty-controls">
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <i class="fa-regular fa-trash-can" style="color: #ff4d4d; cursor: pointer;" onclick="removeFromCart(${item.id})"></i>
            </div>
        `;
    });

    if (totalElement) totalElement.innerText = `${total.toLocaleString()} جنيه`;
    
    badgeElements.forEach(badge => {
        if(badge.parentElement.innerText.includes('السلة')) {
            badge.innerText = totalItems;
        }
    });

    // ربط زرار إتمام الطلب بالواتساب
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = sendOrderToWhatsApp;
    }
}

// --- إرسال الطلب عبر الواتساب ---
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة، أضف منتجات أولاً!');
        return;
    }

    let message = "أهلاً، عندي طلب جديد من متجر TECHSTORE ⚡\n\nتفاصيل الطلب:\n------------------------\n";
    let total = 0;

    cart.forEach(item => {
        message += `▪️ ${item.name} \nالكمية: ${item.qty} | السعر: ${(item.price * item.qty).toLocaleString()} جنيه\n`;
        total += item.price * item.qty;
    });

    message += `------------------------\nالإجمالي: ${total.toLocaleString()} جنيه\n\nبرجاء تأكيد الطلب.`;

    // رقم الواتساب الخاص بك
    const phoneNumber = "201121189810"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // فتح الواتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    // تصفير السلة بعد إرسال الطلب (اختياري، تقدر تشيل السطرين دول لو مش حابب السلة تفضى)
    cart = [];
    updateCart();
}

window.onload = () => {
    renderProducts();
    renderCart();
};
