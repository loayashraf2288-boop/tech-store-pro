import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = collection(db, 'users');
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleDelete = async (id) => {
    if (confirm('متأكد من حذف العميل؟')) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة العملاء</h2>
      
      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-dark-border text-gray-400">
              <th className="pb-2">البريد الإلكتروني</th>
              <th className="pb-2">الدور</th>
              <th className="pb-2">تاريخ التسجيل</th>
              <th className="pb-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust.id} className="border-b border-dark-border">
                <td className="py-2">{cust.email}</td>
                <td>{cust.role === 'admin' ? <span className="text-neon">مدير</span> : 'عميل'}</td>
                <td>{cust.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '-'}</td>
                <td>
                  <button onClick={() => handleDelete(cust.id)} className="text-red-400">🗑️ حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersManager;
