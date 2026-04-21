import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdsManager = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '', link: '', active: true });

  useEffect(() => {
    const q = collection(db, 'ads');
    const unsub = onSnapshot(q, (snap) => {
      setAds(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'ads'), form);
    setForm({ title: '', imageUrl: '', link: '', active: true });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'ads', id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة الإعلانات</h2>
      
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 grid grid-cols-2 gap-4">
        <input type="text" placeholder="عنوان الإعلان" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="text" placeholder="رابط الصورة" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="text" placeholder="رابط المنتج/الصفحة" value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="bg-dark border border-dark-border p-2 rounded col-span-2" />
        <label className="flex items-center gap-2 text-gray-400">
          <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="accent-neon" /> نشط
        </label>
        <button type="submit" className="bg-neon text-black px-6 py-2 rounded font-bold col-span-2">إضافة إعلان</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex gap-4">
            <img src={ad.imageUrl} alt={ad.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-bold">{ad.title}</h4>
              <p className="text-sm text-gray-400 truncate">{ad.link}</p>
              <span className={`text-xs ${ad.active ? 'text-green-400' : 'text-gray-500'}`}>{ad.active ? 'نشط' : 'غير نشط'}</span>
            </div>
            <button onClick={() => handleDelete(ad.id)} className="text-red-400">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsManager;
