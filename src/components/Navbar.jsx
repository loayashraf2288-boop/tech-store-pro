import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Navbar = ({ onCartClick }) => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-dark-card border-b border-dark-border p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-neon">TECH</span><span className="text-white">STORE</span>
        </Link>
        <div className="flex gap-4">
          <button onClick={onCartClick} className="relative p-2">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neon text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
