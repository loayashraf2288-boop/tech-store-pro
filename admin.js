// قراءة المنتجات من التخزين المحلي
let products = JSON.parse(localStorage.getItem('techstore_products')) || [];

// تحديث إحصائيات لوحة التحكم عند فتح الصفحة
function updateAdminStats() {
    const totalProductsCount = document.getElementById('totalProductsCount');
    if (totalProductsCount) {
        totalProductsCount.innerText = products.length; // بيعرض عدد المنتجات الحقيقي
    }
}

// التعامل مع فورم إضافة المنتج
const productForm = document.getElementById('productForm');

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // تجميع بيانات المنتج من الفورم
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('pName').value,
            price: parseFloat(document.getElementById('pPrice').value),
            icon: document.getElementById('pIcon').value,
            tag: document.getElementById('pTag').value
        };

        // إضافة المنتج وحفظه
        products.push(newProduct);
        localStorage.setItem('techstore_products', JSON.stringify(products));

        // مسح الخانات وتحديث الرقم
        productForm.reset();
        updateAdminStats();

        // رسالة تأكيد
        alert('تم إضافة المنتج للمتجر بنجاح!');
    });
}

// التعامل مع زرار تسجيل الخروج
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        // مسح حالة تسجيل الدخول
        localStorage.removeItem('techstore_admin_logged_in');
        // تحويل لصفحة اللوجين
        window.location.href = "admin-login.html";
    });
}

// تشغيل التحديث فوراً
window.onload = updateAdminStats;
