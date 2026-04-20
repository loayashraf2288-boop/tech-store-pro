// 1. نظام تسجيل دخول وهمي (مبدئياً)
const loginForm = document.querySelector('form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // هنا ممكن نحدد يوزر وباسورد معينين
        alert('تم تسجيل الدخول بنجاح يا لؤي!');
        window.location.href = 'dashboard.html'; // بيحولك لصفحة الإحصائيات
    });
}

// 2. إخفاء وإظهار كلمة السر
const togglePass = document.querySelector('.show-pass');
if (togglePass) {
    togglePass.addEventListener('click', function() {
        const passInput = this.previousElementSibling;
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
}

// 3. تأثير "العدّاد" للأرقام (عشان الإحصائيات تزيد قدامك)
const stats = document.querySelectorAll('.stat-card h3');
stats.forEach(stat => {
    const value = stat.innerText;
    // كود بسيط لعمل انيميشن للأرقام ممكن نضيفه هنا لاحقاً
});
