document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // إخفاء صفحة الدخول وإظهار اللوحة
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'flex';
    
    // تشغيل الرسم البياني بعد الدخول
    initChart();
});

function initChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{
                label: 'المبيعات',
                data: [40, 60, 45, 80, 70, 90, 120],
                borderColor: '#3b82f6',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: {
            scales: { y: { ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } }
        }
    });
}
