// مصفوفة المنتجات (بنجيبها من التخزين لو موجودة أو بنبدأ بـ فاضي)
let products = JSON.parse(localStorage.getItem('techstore_products')) || [];

const productForm = document.getElementById('productForm');

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // تجميع بيانات المنتج الجديد
        const newProduct = {
            id: Date.now(), // رقم تعريفي فريد بناءً على الوقت
            name: document.getElementById('pName').value,
            price: parseFloat(document.getElementById('pPrice').value),
            icon: document.getElementById('pIcon').value,
            tag: document.getElementById('pTag').value,
            date: new Date().toLocaleDateString('ar-EG')
        };

        // إضافة المنتج للمصفوفة
        products.push(newProduct);

        // حفظ المصفوفة في التخزين
        localStorage.setItem('techstore_products', JSON.stringify(products));

        // تصفير الفورم بعد الإضافة
        productForm.reset();

        alert('تم إضافة المنتج بنجاح! افتح صفحة المتجر دلوقتي وشوف العظمة.');
        
        // تحديث جدول الإحصائيات لو موجود (اختياري)
        updateAdminStats();
    });
}

// وظيفة لتحديث أرقام لوحة التحكم بناءً على الداتا الحقيقية
function updateAdminStats() {
    const productCountElement = document.querySelector('.stat-card .value');
    if (productCountElement) {
        productCountElement.innerText = products.length;
    }
}

// تشغيل التحديث فور فتح الصفحة
window.onload = updateAdminStats;
