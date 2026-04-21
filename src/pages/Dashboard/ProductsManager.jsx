import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const q = collection(db, 'products');
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) };
    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), data);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'products'), data);
    }
    setForm({ name: '', price: '', description: '', image: '' });
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (confirm('متأكد من حذف المنتج؟')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة المنتجات</h2>
      
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 grid grid-cols-2 gap-4">
        <input type="text" placeholder="اسم المنتج" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="number" placeholder="السعر" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="bg-dark border border-dark-border p-2 rounded" required />
        <input type="text" placeholder="الوصف" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-dark border border-dark-border p-2 rounded col-span-2" />
        <input type="text" placeholder="رابط الصورة" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="bg-dark border border-dark-border p-2 rounded col-span-2" />
        <button type="submit" className="bg-neon text-black px-6 py-2 rounded font-bold col-span-2">{editingId ? 'تحديث' : 'إضافة'}</button>
      </form>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <table className="w-full text-right">
          <thead><tr className="border-b border-dark-border"><th>الاسم</th><th>السعر</th><th>إجراءات</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-dark-border">
                <td className="py-2">{p.name}</td>
                <td>{p.price} جنيه</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="text-blue-400 ml-2">✏️</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManager;
