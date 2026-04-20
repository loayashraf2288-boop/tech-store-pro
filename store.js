// لينك قاعدة البيانات بتاعتك (Firebase Realtime Database)
const FIREBASE_URL = "https://store-c8993-default-rtdb.firebaseio.com";

let products = [];
// قراءة السلة من ذاكرة المتصفح عشان لو العميل عمل ريفريش الحاجة ماتضيعش
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// --- جلب المنتجات من Firebase ---
async function fetchProductsFromDB() {
    try {
        const response = await fetch(`${FIREBASE_URL}/products.json`);
        const data = await response.json();
        
        products = [];
        if (data) {
            // تحويل البيانات لـ مصفوفة
            Object.keys(data).forEach(key => {
                products.push({ id: key, ...data[key] });
            });
        }
        renderProducts();
    } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
        const container = document.getElementById('productsContainer');
        if(container) {
            container.innerHTML = "<p style='color:var(--danger-red); text-align:center; grid-column:1/-1;'>حدث خطأ في الاتصال بقاعدة البيانات.</p>";
        }
    }
}

// --- عرض المنتجات في الصفحة الرئيسية ---
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
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
                ${product.tag ? `<span class="product-tag" style="position: absolute; top: 10px; right: 10px; background: var(--primary-blue); color: white; font-size: 12px; padding: 3px 8px; border-radius: 5px; z-index: 2; font-weight: bold;">${product.tag}</span>` : ''}
                <i class="fa-regular fa-heart" style="position: absolute; top: 12px; left: 12px; cursor: pointer; z-index: 2;"></i>
                <div class="product-img"><i class="${product.icon || 'fa-solid fa-mobile-screen'}"></i></div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${Number(product.price).toLocaleString()} جنيه</div>
                <button class="btn-add" onclick="addToCart('${product.id}')"><i class="fa-solid fa-cart-shopping"></i> أضف للسلة</button>
            </div>
        `;
    });
}

// --- تشغيل السلة الجانبية (فتح وإغلاق) ---
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');

// ربط كل أيقونات السلة عشان تفتح القائمة الجانبية
document.querySelectorAll('.cart-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        if(cartSidebar) cartSidebar.style.display = 'block';
    });
});

if(closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.style.display = 'none';
    });
}

// --- وظائف السلة (إضافة، تعديل، مسح) ---
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
    if(cartSidebar) cartSidebar.style.display = 'block'; // يفتح السلة عشان يشوف اللي ضافه
}

function changeQty(productId, amount) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += amount;
        if (item.qty <= 0) {
            cart = cart.filter(p => p.id !== productId);
        }
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpans = document.querySelectorAll('.cart-count');
    
    if (!cartItemsDiv) return;

    let total = 0;
    let count = 0;
    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        cartItemsDiv.innerHTML += `
            <div style="display: flex; gap: 10px; margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 50px; height: 50px; background: var(--bg-color); display:flex; align-items:center; justify-content:center; color: var(--primary-blue); border-radius: 5px; font-size: 1.5rem;">
                    <i class="${item.icon || 'fa-solid fa-box'}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.name}</h4>
                    <p style="color: var(--primary-blue); font-weight: bold;">${Number(item.price).toLocaleString()} جنيه</p>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px; background: var(--bg-dark); width: fit-content; padding: 2px 8px; border-radius: 5px; border: 1px solid var(--border-color);">
                        <button onclick="changeQty('${item.id}', -1)" style="background:none; border:none; color:white; cursor:pointer; font-size: 1.1rem;">-</button>
                        <span style="font-size: 0.9rem; font-weight: bold; width: 20px; text-align: center;">${item.qty}</span>
                        <button onclick="changeQty('${item.id}', 1)" style="background:none; border:none; color:white; cursor:pointer; font-size: 1.1rem;">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash" style="color: #ff4d4d; cursor: pointer; padding-top: 5px; font-size: 1.1rem;" onclick="removeFromCart('${item.id}')"></i>
            </div>
        `;
    });

    if(cartTotalSpan) cartTotalSpan.innerText = `${total.toLocaleString()} جنيه`;
    
    // تحديث رقم المنتجات اللي فوق في الهيدر
    cartCountSpans.forEach(span => {
        span.innerText = count;
    });
}

// --- إرسال الطلب (تسجيل في Firebase + فتح الواتساب) ---
async function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة، أضف منتجات أولاً!');
        return;
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    const originalText = checkoutBtn.innerHTML;
    // تغيير شكل الزرار عشان العميل يعرف إن الطلب بيتحمل
    checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تأكيد الطلب...';
    checkoutBtn.disabled = true;

    try {
        // 1. تجهيز بيانات الطلب
        let details = cart.map(i => `${i.name} (الكمية: ${i.qty})`).join('، ');
        let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        const orderData = {
            details: details,
            totalPrice: total,
            date: new Date().toLocaleString('ar-EG'),
            customerName: "طلب جديد من المتجر"
        };

        // 2. حفظ الطلب في Firebase عشان يظهرلك في لوحة التحكم
        await fetch(`${FIREBASE_URL}/orders.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        // 3. تجهيز رسالة الواتساب
        let message = "أهلاً، عندي طلب جديد من متجر TECHSTORE ⚡\n\nتفاصيل الطلب:\n------------------------\n";
        cart.forEach(item => {
            message += `▪️ ${item.name} \nالكمية: ${item.qty} | السعر: ${(item.price * item.qty).toLocaleString()} جنيه\n`;
        });
        message += `------------------------\nالإجمالي: ${total.toLocaleString()} جنيه\n\nبرجاء تأكيد الطلب.`;

        // 4. فتح الواتساب على رقمك
        window.open(`https://wa.me/201121189810?text=${encodeURIComponent(message)}`, '_blank');
        
        // 5. تصفير السلة بعد نجاح الطلب
        cart = [];
        updateCart();
        if(cartSidebar) cartSidebar.style.display = 'none';

    } catch (error) {
        console.error("خطأ في إرسال الطلب:", error);
        alert("حدث خطأ أثناء إرسال الطلب. تأكد من اتصالك بالإنترنت.");
    } finally {
        // إرجاع الزرار لشكله الطبيعي
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
    }
}

// ربط زرار إتمام الطلب في السلة
const checkoutBtnElement = document.getElementById('checkoutBtn');
if(checkoutBtnElement) {
    checkoutBtnElement.addEventListener('click', sendOrderToWhatsApp);
}

// --- تشغيل الوظائف عند فتح الصفحة ---
window.onload = () => {
    fetchProductsFromDB();
    renderCart();
};
