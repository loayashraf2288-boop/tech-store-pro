import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discount: '', expiry: '' });

  useEffect(() => {
    const q = collection(db, 'coupons');
    const unsub = onSnapshot(q, (snap) => {
      setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'coupons'), {
      ...form,
      discount: Number(form.discount)
    });
    setForm({ code: '', discount: '', expiry: '' });
  };

  const handleDelete = async (id) => {
    if (confirm('حذف الكوبون؟')) {
      await deleteDoc(doc(db, 'coupons', id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة كوبونات الخصم</h2>
      
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 grid grid-cols-3 gap-4">
        <input type="text" placeholder="كود الخصم" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="number" placeholder="نسبة الخصم %" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="date" placeholder="تاريخ الانتهاء" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} className="bg-dark border border-dark-border p-2 rounded text-white" required />
        <button type="submit" className="bg-neon text-black px-6 py-2 rounded font-bold col-span-3">إضافة كوبون</button>
      </form>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-dark-border text-gray-400">
              <th className="pb-2">الكود</th>
              <th className="pb-2">الخصم</th>
              <th className="pb-2">ينتهي في</th>
              <th className="pb-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-dark-border">
                <td className="py-2 font-mono">{c.code}</td>
                <td>{c.discount}%</td>
                <td>{c.expiry}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)} className="text-red-400">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsManager;
