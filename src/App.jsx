import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import routes from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element}>
                {route.children?.map((child, cIdx) => (
                  <Route key={cIdx} index={child.index} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
