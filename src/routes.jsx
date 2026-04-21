import Login from './pages/Login';
import Store from './pages/Store';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import ProductsManager from './pages/Dashboard/ProductsManager';
import OrdersManager from './pages/Dashboard/OrdersManager';
import CustomersManager from './pages/Dashboard/CustomersManager';
import CouponsManager from './pages/Dashboard/CouponsManager';
import AdsManager from './pages/Dashboard/AdsManager';
import AdminsManager from './pages/Dashboard/AdminsManager';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const routes = [
  { path: '/login', element: <Login /> },
  { path: '/', element: <Store /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <AdminRoute>
          <DashboardLayout />
        </AdminRoute>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'products', element: <ProductsManager /> },
      { path: 'orders', element: <OrdersManager /> },
      { path: 'customers', element: <CustomersManager /> },
      { path: 'coupons', element: <CouponsManager /> },
      { path: 'ads', element: <AdsManager /> },
      { path: 'admins', element: <AdminsManager /> },
    ]
  }
];

export default routes;
