import { useCart } from '../contexts/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const handleCheckout = () => {
    alert('تم حفظ الطلب! (سيتم الربط بقاعدة البيانات قريباً)');
    clearCart();
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>}
      <div className={`fixed top-0 right-0 h-full w-96 bg-dark-card border-l border-dark-border shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} dir="rtl">
        <div className="p-4 border-b border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold">سلة التسوق</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center">السلة فارغة</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-dark-border py-3">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-neon">{item.price} جنيه</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-dark rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-dark rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 mr-2">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-dark-border">
          <div className="flex justify-between mb-4">
            <span>الإجمالي:</span>
            <span className="text-neon font-bold text-xl">{total} جنيه</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-neon text-black py-3 rounded-lg font-bold disabled:opacity-50" disabled={cart.length === 0}>
            إتمام الشراء
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
