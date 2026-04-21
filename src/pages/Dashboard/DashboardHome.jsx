import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const DashboardHome = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 69998 });
  
  const chartData = [
    { name: 'يناير', مبيعات: 4000 },
    { name: 'فبراير', مبيعات: 3000 },
    { name: 'مارس', مبيعات: 5000 },
    { name: 'أبريل', مبيعات: 2780 },
    { name: 'مايو', مبيعات: 1890 },
    { name: 'يونيو', مبيعات: 2390 },
    { name: 'يوليو', مبيعات: 3490 },
  ];

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setStats(prev => ({ ...prev, products: snap.size }));
    });
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setStats(prev => ({ ...prev, orders: snap.size }));
      // حساب إجمالي الإيرادات من الطلبات
      let totalRev = 0;
      snap.docs.forEach(doc => totalRev += doc.data().total || 0);
      setStats(prev => ({ ...prev, revenue: totalRev }));
    });
    const unsubCustomers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, customers: snap.size }));
    });
    return () => { unsubProducts(); unsubOrders(); unsubCustomers(); };
  }, []);

  return (
    <div className="space-y-6">
      {/* بطاقة إجمالي المبيعات */}
      <div className="bg-gradient-to-r from-dark-card to-dark border border-dark-border rounded-xl p-6 flex justify-between items-center">
        <div>
          <h3 className="text-gray-400 text-lg">إجمالي المبيعات</h3>
          <p className="text-4xl font-bold text-neon mt-2">{stats.revenue.toLocaleString()} <span className="text-sm text-gray-500">جنيه</span></p>
        </div>
        <div className="bg-dark px-4 py-2 rounded-lg border border-neon/30">
          <span className="text-green-400">+12% ↑</span>
          <span className="text-gray-400 text-sm mr-2">من الشهر الماضي</span>
        </div>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-400">المنتجات</p>
          <p className="text-2xl font-bold">{stats.products}</p>
          <p className="text-green-400 text-sm mt-2">+8 منتج جديد</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-400">العملاء</p>
          <p className="text-2xl font-bold">{stats.customers}</p>
          <p className="text-green-400 text-sm mt-2">+18 عميل جديد</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-400">الطلبات</p>
          <p className="text-2xl font-bold">{stats.orders}</p>
          <p className="text-green-400 text-sm mt-2">+22 طلب جديد</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <p className="text-gray-400">الأرباح</p>
          <p className="text-2xl font-bold">69,998</p>
          <p className="text-green-400 text-sm mt-2">+12%</p>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 h-80">
        <h3 className="text-xl mb-4 text-neon">توزيع المبيعات</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#141A23', border: '1px solid #00F0FF' }} labelStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="مبيعات" stroke="#00F0FF" strokeWidth={3} dot={{ fill: '#007BFF' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* جدول آخر الطلبات وتنبيهات المخزون */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-lg mb-3">أخر الطلبات</h4>
          <table className="w-full text-sm text-right">
            <thead className="text-gray-400 border-b border-dark-border">
              <tr><th className="pb-2">المنتج</th><th className="pb-2">المبلغ</th><th className="pb-2">الحالة</th></tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border"><td className="py-2">iPhone 15 Pro Max</td><td>2,799</td><td><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">جديد</span></td></tr>
              <tr><td className="py-2">AirPods Pro 2</td><td>3,499</td><td><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">جديد</span></td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h4 className="text-lg mb-3 text-yellow-400">تنبيهات المخزون</h4>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>AirPods Pro 2</span><span className="text-red-400">5 قطع فقط</span></li>
            <li className="flex justify-between"><span>Sony WH-1000XM5</span><span className="text-red-400">3 قطع فقط</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
