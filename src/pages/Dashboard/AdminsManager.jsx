import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminsManager = () => {
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'));
    const unsub = onSnapshot(q, (snap) => {
      setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));
      setAllUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const addAdmin = async () => {
    if (!selectedUser) return;
    await updateDoc(doc(db, 'users', selectedUser), { role: 'admin' });
    setSelectedUser('');
  };

  const removeAdmin = async (id) => {
    if (confirm('إزالة صلاحية المدير؟')) {
      await updateDoc(doc(db, 'users', id), { role: 'customer' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon">إدارة المدراء</h2>
      
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg mb-4">إضافة مدير جديد</h3>
        <div className="flex gap-4">
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 bg-dark border border-dark-border p-2 rounded text-white"
          >
            <option value="">اختر مستخدم...</option>
            {allUsers.filter(u => u.role !== 'admin').map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>
          <button onClick={addAdmin} className="bg-neon text-black px-6 py-2 rounded font-bold">ترقية إلى مدير</button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-dark-border text-gray-400">
              <th className="pb-2">البريد الإلكتروني</th>
              <th className="pb-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b border-dark-border">
                <td className="py-2">{admin.email}</td>
                <td>
                  <button onClick={() => removeAdmin(admin.id)} className="text-red-400">🗑️ إزالة الصلاحية</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsManager;
