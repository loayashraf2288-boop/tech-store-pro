import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = collection(db, 'orders');
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'orders', id), { status: newStatus });
  };

  const statusColors = {
    'جديد': 'bg-blue-500/20 text-blue-400',
    'قيد التجهيز': 'bg-yellow-500/20 text-yellow-400',
    'مكتمل': 'bg-green-500/20 text-green-400',
    'ملغي': 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة الطلبات</h2>
      
      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-dark-border text-gray-400">
              <th className="pb-2">رقم الطلب</th>
              <th className="pb-2">العميل</th>
              <th className="pb-2">الإجمالي</th>
              <th className="pb-2">التاريخ</th>
              <th className="pb-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-dark-border">
                <td className="py-2">{order.id.slice(0, 6)}</td>
                <td>{order.customerEmail || 'عميل'}</td>
                <td>{order.total} جنيه</td>
                <td>{order.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '-'}</td>
                <td>
                  <select 
                    value={order.status || 'جديد'} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`rounded px-2 py-1 text-sm ${statusColors[order.status] || 'bg-gray-500/20'}`}
                  >
                    <option value="جديد">جديد</option>
                    <option value="قيد التجهيز">قيد التجهيز</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
