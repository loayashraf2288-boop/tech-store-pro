import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'الرئيسية', icon: '🏠' },
    { path: '/dashboard/products', label: 'المنتجات', icon: '📦' },
    { path: '/dashboard/orders', label: 'الطلبات', icon: '🛒' },
    { path: '/dashboard/customers', label: 'العملاء', icon: '👥' },
    { path: '/dashboard/coupons', label: 'كوبونات الخصم', icon: '🎫' },
    { path: '/dashboard/ads', label: 'الإعلانات', icon: '📢' },
    { path: '/dashboard/admins', label: 'المدراء', icon: '👑' },
  ];

  return (
    <div className="flex h-screen bg-dark text-white" dir="rtl">
      {/* الشريط الجانبي */}
      <aside className="w-64 bg-dark-card border-l border-dark-border p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-neon mb-8">TECHSTORE</h2>
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-neon/10 text-neon border-r-2 border-neon' : 'hover:bg-gray-800'}`
              }
              end
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white">
          <span>🚪</span> تسجيل خروج
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
